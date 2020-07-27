/**
 * cell of the game grid
 */
import React, { useState, useEffect, useRef } from "react"
import "../styles/cell.less"
import PropTypes from "prop-types"
import { Space } from "antd"
import { useGameContext } from "../modules/GameContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons"

const Cell = (props) => {
  const {
    cells,
    colors,
    handleCellClicked,
    selectedCell,
    hasWon,
  } = useGameContext()

  // current cell object
  const cell = useRef({
    targetRow: 0,
    steps: 0,
    row: props.row,
    col: props.col,
  })

  // color of the cell
  const [color, setColor] = useState("#000000")
  // high contrast color for text and border
  const [contrastColor, setContrastColor] = useState("#ffffff")
  const [borderWidth, setBorderWidth] = useState(0)

  // present icons in the cell
  let icons = getIcons()

  useEffect(() => {
    if (cells != null) cell.current = cells[props.row][props.col]
    // cell.current = cells.length ? cells[props.row][props.col] : cell.current
    // update cell states, triggered when any cell data is updated
    let cellColor = computeColor(cell.current, colors)
    setColor(cellColor)
    setContrastColor(computeContrastColor(cellColor))

    // present the border when selected
    if (
      selectedCell !== null &&
      selectedCell.row === props.row &&
      selectedCell.col === props.col
    ) {
      setBorderWidth(2)
    } else {
      setBorderWidth(0)
    }
  }, [cell, colors, color, selectedCell, cells, props.row, props.col])

  const onCellClicked = () => {
    handleCellClicked(props.row, props.col)
  }

  /**
   * set icons of the cell based on its state
   * @returns []
   */
  function getIcons() {
    if (hasWon) {
      return <FontAwesomeIcon size="2x" icon={faCheck} color={contrastColor} />
    }
    // has steps remained
    let stars = []
    for (let i = 0; i < cell.current.steps; i++) {
      stars.push(
        <FontAwesomeIcon
          size="2x"
          icon={faStar}
          color={contrastColor}
          key={i}
        />
      )
    }
    // place a dummy component
    if (stars.length === 0) {
      return <span />
    }
    return stars
  }

  return (
    <Space
      className="cell"
      style={{
        backgroundColor: color,
        borderWidth: borderWidth,
        borderColor: contrastColor,
      }}
      align="center"
      onClick={() => onCellClicked()}
    >
      {icons}
    </Space>
  )
}

/**
 * compute text color(steps remained) as a high contrast color
 * of the cell color
 * @param cellColor color string of the cell
 */
function computeContrastColor(cellColor) {
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

/**
 * get the color of the cell
 * @param cell cell objects
 * @param colors color array of the game grid
 */
function computeColor(cell, colors) {
  // set to black if it's misplaced without steps left
  if (cell.steps === 0 && cell.row !== cell.targetRow) {
    return "#212121"
  } else {
    // original color
    return colors[cell.targetRow]
  }
}

Cell.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
}

export default Cell
