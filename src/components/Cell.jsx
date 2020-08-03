/**
 * cell of the game grid
 */
import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { Space } from "antd"
import { useGameContext } from "../utils/GameContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons"
import { computeContrastColor, computeColor } from "../utils/ColorUtils"
import "../styles/cell.less"

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
    // update cell states, triggered when any cell config is updated
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

Cell.propTypes = {
  row: PropTypes.number,
  col: PropTypes.number,
}

export default Cell
