/**
 * Game page, displays the layout of the game
 */
import { Button, Col, Layout, Row, Typography, Modal } from "antd"
import React, { useState, useRef } from "react"
import GameGrid from "../components/GameGrid"
import PropTypes from "prop-types"
import { GameContext } from "../modules/GameContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faArrowRight,
  faRedo,
  faUndo,
} from "@fortawesome/free-solid-svg-icons"
import gridData from "../data/level1.json"
import { cloneDeep } from "lodash"
import { Link, useHistory } from "react-router-dom"

const { Title } = Typography
const { Header, Content } = Layout

const Game = (props) => {
  const history = useHistory()

  let level = parseInt(props.match.params.id)

  // deep copy the cells data
  const originalGridData = cloneDeep(gridData.cells)
  const size = parseInt(gridData.size)
  const colors = gridData.colors
  const [selectedCell, setSelectedCell] = useState(null)
  const [cells, setCells] = useState([...originalGridData])
  const [isDead, setIsDead] = useState(false)
  const [hasWon, setHasWon] = useState(false)

  // counter for cells complete
  const completeCounter = useRef(0)

  // last move
  const lastMove = useRef(null)

  // visibility of the last and next level buttons
  let lastLevelVisibility = "hidden"
  let nextLevelVisibility = "hidden"
  if (level > 1) {
    lastLevelVisibility = "visible"
  }
  if (level < 30) {
    nextLevelVisibility = "visible"
  }

  /**
   * handle cell clicked event
   * @param row row of the cell
   * @param col column of the cell
   */
  const handleCellClicked = (row, col) => {
    let cell = cells[row][col]
    // do nothing if the current cell have no step remained
    if (cell.steps === 0 || isDead || hasWon) {
      return
    }

    if (selectedCell === null) {
      // select the first cell
      setSelectedCell(cells[row][col])
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
    lastMove.current = {
      row1: firstCell.row,
      col1: firstCell.col,
      row2: secondCell.row,
      col2: secondCell.col,
    }

    // shallow copy, update cells data
    setCells([...cells])

    // update game states
    updateWinningState(firstCell)
    updateWinningState(secondCell)

    // check whether the game has finished
    if (completeCounter.current === size * size) {
      setHasWon(true)
      nextLevel()
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

  /**
   * update complete cell counter and check whether the cell has died
   * @param cell
   */
  function updateWinningState(cell) {
    if (cell.steps === 0) {
      if (cell.row === cell.targetRow) {
        completeCounter.current++
      } else {
        setIsDead(true)
      }
    }
  }

  /**
   * restart the game, re-initialize the data
   */
  function restart() {
    setCells(cloneDeep(originalGridData))
    setSelectedCell(null)
    setIsDead(false)
    setHasWon(false)
    completeCounter.current = 0
    lastMove.current = null
  }

  /**
   * undo the last move
   */
  function undo() {
    if (lastMove.current === null || hasWon) {
      undoWarning()
      return
    }

    // swap the cells
    let firstCell = cells[lastMove.current.row1][lastMove.current.col1]
    let secondCell = cells[lastMove.current.row2][lastMove.current.col2]
    let tempSteps = firstCell.steps
    let tempTargetRow = firstCell.targetRow
    firstCell.steps = secondCell.steps + 1
    firstCell.targetRow = secondCell.targetRow
    secondCell.steps = tempSteps + 1
    secondCell.targetRow = tempTargetRow

    setCells([...cells])
    setIsDead(false)

    // only the move recent move can be undone
    lastMove.current = null
  }

  /**
   * modal warns only the last move can be undone,
   * the modal will close in 3 seconds
   */
  function undoWarning() {
    let secondsToGo = 3
    const modal = Modal.success({
      content: "you may only undo your most recent move.",
    })

    const timer = setInterval(() => {
      secondsToGo -= 1
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      modal.destroy()
    }, secondsToGo * 1000)
  }

  // initial game context data
  const context = {
    level: level,
    cells: cells,
    selectedCell: selectedCell,
    colors: colors,
    size: size,
    hasWon: hasWon,
    handleCellClicked: handleCellClicked,
  }

  return (
    <Layout>
      <Header>Harmony Game</Header>
      <Content>
        <GameContext.Provider value={context}>
          {/*top bar*/}
          <Row style={{ backgroundColor: colors[0] }}>
            <Col flex="5" />
            <Col flex="0 450px" className="top-bar">
              <Title className="title">Level {level}</Title>
              <Button
                className="undo-btn"
                type="text"
                title="undo"
                onClick={() => undo()}
              >
                <FontAwesomeIcon icon={faUndo} size="2x" />
              </Button>
              <Button
                className="restart-btn"
                type="text"
                title="restart"
                onClick={() => restart()}
              >
                <FontAwesomeIcon icon={faRedo} size="2x" />
              </Button>
            </Col>
            <Col flex="5" />
          </Row>

          <GameGrid />

          {/*bottom bar*/}
          <Row style={{ backgroundColor: colors[colors.length - 1] }}>
            <Col flex="5" />
            <Col flex="0 450px" className="bot-bar">
              <Link to={`/level/${level - 1}`}>
                <Button
                  className="last-level-btn"
                  type="text"
                  title="last level"
                  style={{ visibility: lastLevelVisibility }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                </Button>
              </Link>
              <Link to={`/level/${level + 1}`}>
                <Button
                  className="next-level-btn"
                  type="text"
                  style={{ visibility: nextLevelVisibility }}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="2x"
                    title="next level"
                  />
                </Button>
              </Link>
            </Col>
            <Col flex="5" />
          </Row>
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
