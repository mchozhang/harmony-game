/**
 * bottom bar of the game page, displaying operation buttons
 */

import React, { useEffect, useState } from "react"
import { Button, Col, Modal, Row } from "antd"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faArrowRight,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons"
import { useGameContext } from "../utils/GameContext"
import { computeContrastColor } from "../utils/ColorUtils"
import "../styles/game.less"
import { aStarSearch } from "../utils/GameSolver"

const GameBottomBar = (props) => {
  const {
    colors,
    level,
    cells,
    setHintMove,
    setSelectedCell,
  } = useGameContext()

  // background color
  const [color, setColor] = useState("#ffffff")

  useEffect(() => {
    if (colors.length > 0) {
      setColor(colors[colors.length - 1])
    }
  }, [colors])

  /**
   * show hint for the next move
   */
  const getHint = () => {
    let solution = aStarSearch(cells)
    if (solution.length === 0) {
      noSolutionWarning()
    } else {
      setSelectedCell(null)
      setHintMove(solution[0])
    }
  }

  function noSolutionWarning() {
    let secondsToGo = 3
    const modal = Modal.success({
      content: "No solution found, you should restart this game.",
    })

    const timer = setInterval(() => {
      secondsToGo -= 1
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      modal.destroy()
    }, secondsToGo * 1000)
  }

  // visibility of the last and next level buttons
  let lastLevelVisibility = "hidden"
  let nextLevelVisibility = "hidden"
  if (level > 1) {
    lastLevelVisibility = "visible"
  }
  if (level < 30) {
    nextLevelVisibility = "visible"
  }

  return (
    <Row style={{ backgroundColor: color }}>
      <Col flex="5" />
      <Col flex="0 450px" className="bot-bar">
        {/*last level button*/}
        <Link to={`/level/${level - 1}`}>
          <Button
            className="last-level-btn"
            type="text"
            title="last level"
            style={{
              visibility: lastLevelVisibility,
              color: computeContrastColor(color),
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="2x" />
          </Button>
        </Link>
        {/*hint button*/}
        <Button
          title="hint"
          type="text"
          className="hint-btn"
          onClick={() => getHint()}
          style={{ color: computeContrastColor(color) }}
        >
          <FontAwesomeIcon icon={faLightbulb} size="2x" />
        </Button>

        {/*next level button*/}
        <Link to={`/level/${level + 1}`}>
          <Button
            className="next-level-btn"
            type="text"
            style={{
              visibility: nextLevelVisibility,
              color: computeContrastColor(color),
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} size="2x" title="next level" />
          </Button>
        </Link>
      </Col>
      <Col flex="5" />
    </Row>
  )
}

export default GameBottomBar
