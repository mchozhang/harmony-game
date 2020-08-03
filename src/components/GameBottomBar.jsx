/**
 * bottom bar of the game page, displaying operation buttons
 */

import React, { useEffect, useState } from "react"
import { Button, Col, Row } from "antd"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useGameContext } from "../utils/GameContext"
import { computeContrastColor } from "../utils/ColorUtils"

const GameBottomBar = (props) => {
  const { colors, level } = useGameContext()

  // background color
  const [color, setColor] = useState("#ffffff")

  useEffect(() => {
    if (colors.length > 0) {
      setColor(colors[colors.length - 1])
    }
  }, [colors])

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
