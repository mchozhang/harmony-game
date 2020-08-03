/**
 * game grid, consists of game row
 */
import React from "react"
import GameRow from "./GameRow"
import { useGameContext } from "../utils/GameContext"

const GameGrid = (props) => {
  const { size } = useGameContext()

  // initialize config for each row
  let gameRows = []
  for (let i = 0; i < size; i++) {
    gameRows.push(<GameRow row={i} key={i} />)
  }

  return (
    <>
      {/*game grid*/}
      <div>{gameRows}</div>
    </>
  )
}

export default GameGrid
