/**
 * Grid view that let player select levels
 */
import React from "react"
import { Row, Col, Button, Typography } from "antd"
import levelData from "../config/levels.json"
import "../styles/level-grid.less"
import { Link } from "react-router-dom"
import Cookies from "universal-cookie"

const { Title, Text } = Typography
const cookies = new Cookies()

const LevelGrid = (props) => {
  let levels = []

  let conqueredCookie = cookies.get("conquered")
  let conquered = []
  if (conqueredCookie != null) {
    conquered = conqueredCookie.split(",")
    console.log(conquered)
  }

  for (let i = 0; i < levelData.levels.length; i++) {
    let levelNum = levelData.levels[i]
    let buttonType = conquered.includes(`${levelNum}`)
      ? "conquered-level-btn"
      : "level-btn"
    levels.push(
      <Col className="col" key={i}>
        <Link to={`/level/${levelNum}`}>
          <Button className={buttonType}>{levelData.levels[i]}</Button>
        </Link>
      </Col>
    )
  }

  return (
    <>
      {/*title*/}
      <Row justify="center">
        <Col span={18}>
          <Title className="title">Select Level</Title>
        </Col>
      </Row>

      {/*grid*/}
      <Row justify="center">
        <Col flex="5 1" />
        <Col span={18} style={{ minWidth: 500 }}>
          <Row className="row">{levels}</Row>
        </Col>
        <Col flex="5 1" />
      </Row>
    </>
  )
}

export default LevelGrid
