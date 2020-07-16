import React, { useState } from "react"
import { Row, Col } from "antd"
import GameRow from "./GameRow"
import { useGameContext } from "../modules/GameContext"

const GameGrid = (props) => {
  const { cells, size } = useGameContext()

  let gameRows = []

  // initialize data for each row
  for (let i = 0; i < size; i++) {
    gameRows.push(<GameRow row={i} key={i} />)
  }

  return (
    <>
      {gameRows}
    </>
  )
}

export default GameGrid
