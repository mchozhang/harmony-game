import React from "react"
import { Row, Col, Button, Typography } from "antd"
import levelData from "../data/levels.json"
import "../styles/level-grid.less"
import { Link } from "react-router-dom"

const { Title } = Typography

const LevelGrid = (props) => {
  let levels = []

  for (let i = 0; i < levelData.levels.length; i++) {
    levels.push(
      <Col className="col" key={i}>
        <Link to={`/level/${levelData.levels[i]}`}>
          <Button className="level-btn">{levelData.levels[i]}</Button>
        </Link>
      </Col>
    )
  }

  return (
    <>
      {/*title*/}
      <Row justify="center">
        <Col span={16}>
          <Title className="title">Select Level</Title>
        </Col>
      </Row>

      {/*grid*/}
      <Row justify="center">
        <Col span={16}>
          <Row className="row">{levels}</Row>
        </Col>
      </Row>
    </>
  )
}

export default LevelGrid
