/**
 * a row of a game grid
 */
import React from "react"
import { Row, Col, Space } from "antd"
import PropTypes from "prop-types"
import Cell from "./Cell"
import { useGameContext } from "../utils/GameContext"

const GameRow = (props) => {
  const { colors, cells } = useGameContext()
  const color = colors[props.row]
  let rowCells = cells[props.row]

  return (
    <Row justify="center">
      <Col flex="5 1" style={{ backgroundColor: color }} />
      <Col flex="0 450px">
        <Space size={0}>
          {rowCells.map((cell) => (
            <Cell
              row={parseInt(cell.row)}
              col={parseInt(cell.col)}
              key={cell.col}
            />
          ))}
        </Space>
      </Col>
      <Col flex="5 1" style={{ backgroundColor: color }} />
    </Row>
  )
}

GameRow.propTypes = {
  row: PropTypes.number,
}

export default GameRow
