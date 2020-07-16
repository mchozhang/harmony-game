/**
 * a row of a game grid
 */
import React from "react"
import { Row, Col } from "antd"
import PropTypes from "prop-types"
import Cell from "./Cell"
import { useGameContext } from "../modules/GameContext"

const GameRow = (props) => {
  const { colors, cells, size } = useGameContext()
  const color = colors[props.row]
  let rowCells = cells[props.row]

  return (
    <>
      <Row justify="center">
        <Col span={6} style={{ backgroundColor: color }} />
        <Col>
          <Row>
            {rowCells.map((cell) => (
              <Cell
                row={parseInt(cell.row)}
                col={parseInt(cell.col)}
                key={cell.col}
              />
            ))}
          </Row>
        </Col>
        <Col span={6} style={{ backgroundColor: color }} />
      </Row>
    </>
  )
}

GameRow.propTypes = {
  row: PropTypes.number,
}

export default GameRow