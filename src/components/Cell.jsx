import React, { useState, useEffect } from "react"
import "../styles/cell.less"
import PropTypes from "prop-types"
import { Space, Typography } from "antd"
import { useGameContext } from "../modules/GameContext"

const { Title } = Typography

const Cell = (props) => {
  const { cells, colors, handleCellClicked, selectedCell } = useGameContext()

  let cell = cells[props.row][props.col]
  // let isSelected = false
  const [color, setColor] = useState(colors[cell.targetRow])
  const [textColor, setTextColor] = useState(getTextColor(color))
  const [text, setText] = useState(getText(cell.steps))
  const [edgeLength, setEdgeLength] = useState(150)
  const [margin, setMargin] = useState(0)

  useEffect(() => {
    // update cell states, triggered when any cell data is updated
    setColor(colors[cell.targetRow])
    setTextColor(getTextColor(color))
    setText(getText([cell.steps]))

    if (
      selectedCell !== null &&
      selectedCell.row === cell.row &&
      selectedCell.col === cell.col
    ) {
      setEdgeLength(160)
      setMargin(-10)
    } else {
      setEdgeLength(150)
      setMargin(0)
    }
  })

  const onCellClicked = () => {
    handleCellClicked(cell.row, cell.col)
  }

  return (
    <Space
      className="cell"
      style={{
        backgroundColor: color,
        width: edgeLength,
        height: edgeLength,
        margin: margin,
      }}
      align="center"
      onClick={() => onCellClicked()}
    >
      <Title className="text" style={{ color: textColor }}>
        {text}
      </Title>
    </Space>
  )
}

/**
 * set cell text based on steps
 * @param steps
 * @returns {string}
 */
function getText(steps) {
  // set text
  let text = ""
  for (let i = 0; i < steps; i++) {
    text += "＊"
  }
  return text
}

/**
 * compute text color(steps remained) as a high contrast color
 * of the cell color
 * @param cellColor color of the cell
 */
function getTextColor(cellColor) {
  // extract RGB
  let r = cellColor.slice(1, 3)
  let g = cellColor.slice(3, 5)
  let b = cellColor.slice(5, 7)
  let count = parseInt(r, 16) + parseInt(g, 16) + parseInt(b, 16)

  // compute high contrast color
  let textColor = "#dddddd"
  if (count > 128 * 3) {
    textColor = "#444444"
  }
  return textColor
}

Cell.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
}

export default Cell
