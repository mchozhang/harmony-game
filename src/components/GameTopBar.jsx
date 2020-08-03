/**
 * top bar of the game page, displaying the level and buttons
 */
import React, { useEffect, useState } from "react"
import { Button, Col, Modal, Row, Typography } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRedo, faUndo } from "@fortawesome/free-solid-svg-icons"
import "../styles/game.less"
import { useGameContext } from "../utils/GameContext"
import { hasWon } from "../utils/GameHelper"
import { computeContrastColor } from "../utils/ColorUtils"

const { Title } = Typography

const GameTopBar = (props) => {
  const {
    colors,
    level,
    cells,
    lastMove,
    setLastMove,
    setCells,
    handleRestart,
  } = useGameContext()

  // background color
  const [color, setColor] = useState("#ffffff")

  useEffect(() => {
    if (colors.length > 0) {
      setColor(colors[0])
    }
  }, [colors])

  /**
   * undo the last move
   */
  function undo() {
    if (lastMove === null || hasWon(cells)) {
      undoWarning()
      return
    }

    // swap the cells back
    let firstCell = cells[lastMove.row1][lastMove.col1]
    let secondCell = cells[lastMove.row2][lastMove.col2]
    let tempSteps = firstCell.steps
    let tempTargetRow = firstCell.targetRow
    firstCell.steps = secondCell.steps + 1
    firstCell.targetRow = secondCell.targetRow
    secondCell.steps = tempSteps + 1
    secondCell.targetRow = tempTargetRow

    // update cells data
    setCells([...cells])

    // only the move recent move can be undone
    setLastMove(null)
  }

  /**
   * modal warns only the last move can be undone,
   * the modal will close in 3 seconds
   */
  function undoWarning() {
    let secondsToGo = 3
    const modal = Modal.success({
      content: "You may only undo your most recent move.",
    })

    const timer = setInterval(() => {
      secondsToGo -= 1
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      modal.destroy()
    }, secondsToGo * 1000)
  }

  return (
    <Row style={{ backgroundColor: color }}>
      <Col flex="5" />
      <Col flex="0 450px" className="top-bar">
        <Title className="title" style={{ color: computeContrastColor(color) }}>
          Level {level}
        </Title>
        <Button
          className="undo-btn"
          type="text"
          title="undo"
          style={{ color: computeContrastColor(color) }}
          onClick={() => undo()}
        >
          <FontAwesomeIcon icon={faUndo} size="2x" />
        </Button>
        <Button
          className="restart-btn"
          type="text"
          title="restart"
          style={{ color: computeContrastColor(color) }}
          onClick={() => handleRestart()}
        >
          <FontAwesomeIcon icon={faRedo} size="2x" />
        </Button>
      </Col>
      <Col flex="5" />
    </Row>
  )
}

export default GameTopBar
