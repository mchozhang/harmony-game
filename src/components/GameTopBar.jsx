/**
 * top bar of the game page, displaying the level and buttons
 */
import React, { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Button, Col, Modal, Row, Typography } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRedo,
  faUndo,
  faBars,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import { GameContext, useGameContext } from "../utils/GameContext"
import { hasWon } from "../utils/GameSolver"
import { computeContrastColor } from "../utils/ColorUtils"
import "../styles/game.less"
import RuleModal from "./RuleModal"

const { Title } = Typography

const GameTopBar = (props) => {
  const {
    colors,
    level,
    cells,
    lastMove,
    setLastMove,
    setHintMove,
    setCells,
    setSelectedCell,
    handleRestart,
  } = useGameContext()

  // display game rule
  const [isModalVisible, setIsModalVisible] = useState(false)

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
  const undo = () => {
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
    setHintMove(null)
    setSelectedCell(null)
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

  // show the modal of game rule text
  const displayRuleModal = () => {
    setIsModalVisible(true)
  }

  return (
    <>
      <Row style={{ backgroundColor: color }}>
        <Col flex="1" />
        <Col flex="0 500px" className="top-bar">
          <Title
            className="title"
            style={{ color: computeContrastColor(color) }}
          >
            Level {level}
          </Title>

          {/*buttons on the left*/}
          <div className="left-btn-group">
            {/*menu button*/}
            <NavLink to="/">
              <Button
                type="text"
                className="menu-btn"
                title="menu"
                style={{ color: computeContrastColor(color) }}
              >
                <FontAwesomeIcon icon={faBars} size="2x" />
              </Button>
            </NavLink>

            {/*undo button*/}
            <Button
              className="undo-btn"
              type="text"
              title="undo"
              style={{ color: computeContrastColor(color) }}
              onClick={undo}
            >
              <FontAwesomeIcon icon={faUndo} size="2x" />
            </Button>
          </div>

          <div className="right-btn-group">
            {/*restart button*/}
            <Button
              type="text"
              title="restart"
              style={{ color: computeContrastColor(color) }}
              onClick={handleRestart}
            >
              <FontAwesomeIcon icon={faRedo} size="2x" />
            </Button>

            {/*info button*/}
            <Button
              className="undo-btn"
              type="text"
              title="check the game rule"
              style={{ color: computeContrastColor(color) }}
              onClick={displayRuleModal}
            >
              <FontAwesomeIcon icon={faInfoCircle} size="2x" />
            </Button>
          </div>
        </Col>
        <Col flex="1" />
      </Row>
      <RuleModal visible={isModalVisible} setVisibility={setIsModalVisible} />
    </>
  )
}

export default GameTopBar
