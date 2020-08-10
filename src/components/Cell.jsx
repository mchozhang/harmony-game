/**
 * cell of the game grid
 */
import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Space } from "antd"
import { useGameContext } from "../utils/GameContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons"
import { computeContrastColor, computeColor } from "../utils/ColorUtils"
import "../styles/cell.less"
import { hasWon } from "../utils/GameSolver"

const Cell = (props) => {
  const {
    cells,
    colors,
    handleCellClicked,
    selectedCell,
    hintMove,
  } = useGameContext()

  const row = props.row
  const col = props.col

  // color of the cell
  const [color, setColor] = useState("#000000")
  // high contrast color for text and border
  const [contrastColor, setContrastColor] = useState("#ffffff")
  const [borderWidth, setBorderWidth] = useState(0)

  // present icons in the cell
  let icons = getIcons()

  useEffect(() => {
    // update cell states, triggered when any cell config is updated
    let cellColor = computeColor(cells[row][col], colors)
    setColor(cellColor)
    setContrastColor(computeContrastColor(cellColor))

    // present the border when selected
    if (
      selectedCell !== null &&
      selectedCell.row === row &&
      selectedCell.col === col
    ) {
      setBorderWidth(5)
    } else {
      setBorderWidth(0)
    }

    // border of hint move
    if (hintMove !== null) {
      if (
        (hintMove[0] === row && hintMove[1] === col) ||
        (hintMove[2] === row && hintMove[3] === col)
      ) {
        setBorderWidth(5)
      } else {
        setBorderWidth(0)
      }
    }
  }, [colors, color, selectedCell, cells, row, col, hintMove])

  const onCellClicked = () => {
    handleCellClicked(row, col)
  }

  /**
   * set icons of the cell based on its state
   */
  function getIcons() {
    if (hasWon(cells)) {
      return <FontAwesomeIcon size="2x" icon={faCheck} color={contrastColor} />
    }
    // has steps remained
    let stars = []
    for (let i = 0; i < cells[row][col].steps; i++) {
      stars.push(
        <FontAwesomeIcon
          className="step"
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
        width: `${13.5 - colors.length}rem`,
        height: `${13.5 - colors.length}rem`,
        // size: `${14 - colors.length}rem`,
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
