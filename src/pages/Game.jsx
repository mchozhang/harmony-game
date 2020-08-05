/**
 * Game page, displays the layout of the game
 */
import { Layout } from "antd"
import React, { useState } from "react"
import GameGrid from "../components/GameGrid"
import TopBar from "../components/TopBar"
import PropTypes from "prop-types"
import { GameContext } from "../utils/GameContext"
import { cloneDeep } from "lodash"
import { useHistory } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { GET_LEVEL } from "../utils/GraphQL"
import { hasWon, isDead } from "../utils/GameSolver"
import "../styles/game.less"
import Cookies from "universal-cookie"
import GameTopBar from "../components/GameTopBar"
import GameBottomBar from "../components/GameBottomBar"

const { Content } = Layout
const cookies = new Cookies()

const Game = (props) => {
  // parse parameters
  let level = parseInt(props.match.params.id)

  // browser history
  const history = useHistory()

  // game states
  const [selectedCell, setSelectedCell] = useState(null)
  const [size, setSize] = useState(0)
  const [cells, setCells] = useState([])
  const [colors, setColors] = useState([])
  const [lastMove, setLastMove] = useState(null)
  const [hintMove, setHintMove] = useState(null)

  /**
   * restart the game, re-initialize the game config
   */
  const restart = () => {
    setCells(cloneDeep(data.level.cells))
    setColors(cloneDeep(data.level.colors))
    setSize(data.level.size)
    setSelectedCell(null)
    setLastMove(null)
    setHintMove(null)
  }

  // graphql query request
  const { loading, error, data } = useQuery(GET_LEVEL, {
    variables: { id: level },
    onCompleted: restart,
  })

  // display query loading and error
  if (loading) return null
  if (error) return `Error! ${error}`

  /**
   * handle cell clicked event
   * @param row row of the cell
   * @param col column of the cell
   */
  const handleCellClicked = (row, col) => {
    let cell = cells[row][col]
    // do nothing if the current cell have no step remained
    if (cell.steps === 0 || isDead(cells) || hasWon(cells)) {
      return
    }

    if (selectedCell === null) {
      // select the first cell
      setSelectedCell(cells[row][col])
      setHintMove(null)
    } else if (selectedCell.row === row && selectedCell.col === col) {
      // unselect the cell
      setSelectedCell(null)
    } else if (
      (row === selectedCell.row || col === selectedCell.col) &&
      selectedCell.steps !== 0
    ) {
      // swap the selected cell and the clicked cell
      handleSwap(row, col)
    }
  }

  /**
   * swap 2 cells
   * @param row row of the clicked cell
   * @param col column of the clicked cell
   */
  function handleSwap(row, col) {
    // unselect the cell
    setSelectedCell(null)

    // swap the cells in the same row or the same column
    let firstCell = cells[selectedCell.row][selectedCell.col]
    let secondCell = cells[row][col]
    let tempSteps = firstCell.steps
    let tempTargetRow = firstCell.targetRow
    firstCell.steps = secondCell.steps - 1
    firstCell.targetRow = secondCell.targetRow
    secondCell.steps = tempSteps - 1
    secondCell.targetRow = tempTargetRow

    // record the last move
    setLastMove({
      row1: firstCell.row,
      col1: firstCell.col,
      row2: secondCell.row,
      col2: secondCell.col,
    })

    setHintMove(null)

    // shallow copy, update cells config
    setCells([...cells])

    // check whether the game has finished
    if (hasWon(cells)) {
      setLevelCookies()
      nextLevel()
    }
  }

  /**
   * use cookies to record the levels that have been conquered
   */
  function setLevelCookies() {
    let conquered = cookies.get("conquered")
    if (conquered == null) {
      cookies.set("conquered", `${level},`)
    } else {
      cookies.set("conquered", conquered + `${level},`)
    }
  }

  /**
   * win and navigate to the next level after 3 seconds
   */
  function nextLevel() {
    if (level < 30) {
      setTimeout(() => {
        history.push(`/level/${level + 1}`)
      }, 3000)
    }
  }

  // initial game context config
  const context = {
    level: level,
    cells: cells,
    setCells: setCells,
    selectedCell: selectedCell,
    setSelectedCell: setSelectedCell,
    colors: colors,
    size: size,
    lastMove: lastMove,
    setLastMove: setLastMove,
    hintMove: hintMove,
    setHintMove: setHintMove,
    handleCellClicked: handleCellClicked,
    handleRestart: restart,
  }

  return (
    <Layout>
      <TopBar />
      <Content>
        <GameContext.Provider value={context}>
          <GameTopBar />
          <GameGrid />
          <GameBottomBar />
        </GameContext.Provider>
      </Content>
    </Layout>
  )
}

Game.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}

export default Game
