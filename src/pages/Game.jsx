import { Layout } from "antd"
import React, { useState } from "react"
import GameGrid from "../components/GameGrid"
import PropTypes from "prop-types"
import { GameContext } from "../modules/GameContext"
import gridData from "../data/level1.json"

const { Header, Content } = Layout

const Game = (props) => {
  let level = props.match.params.id

  const [selectedCell, setSelectedCell] = useState(null)
  const [cells, setCells] = useState(gridData.cells)

  /**
   * handle cell clicked event
   * @param row row of the cell
   * @param col column of the cell
   */
  const handleCellClicked = (row, col) => {
    let cell = cells[row][col]
    // do nothing if the current cell have no step remained
    if (cell.steps === 0) {
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

      // shallow copy, update cells data
      setCells(cells.slice(0))
    }
  }

  const context = {
    cells: cells,
    selectedCell: selectedCell,
    colors: gridData.colors,
    size: parseInt(gridData.size),
    handleCellClicked: handleCellClicked,
  }

  return (
    <Layout>
      <Header>Harmony Game</Header>
      <Content>
        <GameContext.Provider value={context}>
          <GameGrid />
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
