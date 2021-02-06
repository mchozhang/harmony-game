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
import { greedySearch } from "../utils/GameSolver"
import config from "../config/config.json"

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
    // computeSolutionLocally()
    requestForHintMove()
  }

  function computeSolutionLocally() {
    let search = new Promise((resolve, reject) => {
      let solution = greedySearch(cells)
      if (solution.length !== 0) {
        resolve(solution)
      } else {
        reject()
      }
    }).then(
      (solution) => {
        // solution found
        setSelectedCell(null)
        setHintMove(solution[0])
      },
      () => {
        // no solution found
        let msg = "No solution found, you should restart this game."
        showWarning(msg)
      }
    )
  }

  /**
   * send an http request for hint move
   */
  function requestForHintMove() {
    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level: level,
        grid: cells,
      }),
    }

    fetch(config.solutionEndpoint, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setSelectedCell(null)
          let action = data.action
          if (
            cells[action[0]][action[1]].steps > 0 &&
            cells[action[2]][action[3]].steps > 0
          ) {
            setHintMove(data.action)
          } else {
            showWarning("No solution found, you should restart this game.")
          }
        } else {
          showWarning("An error has occurred during requesting for hint move.")
        }
      })
  }

  function showWarning(message) {
    let secondsToGo = 3
    const modal = Modal.success({
      content: message,
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
          onClick={getHint}
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
