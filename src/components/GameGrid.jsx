/**
 * game grid, consists of game row
 */
import React from "react"
import GameRow from "./GameRow"
import { useGameContext } from "../modules/GameContext"
import "../styles/game-grid.less"

const GameGrid = (props) => {
  const { size } = useGameContext()

  // initialize data for each row
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
