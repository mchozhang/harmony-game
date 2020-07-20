/**
 *  Game context
 */
import React, { createContext, useContext, useState } from "react"

let game = {
  level: 0,
  cells: [],
  selectedCell: [-1, -1],
  colors: [],
  size: 0,
  handleCellClicked: () => {},
}

const GameContext = createContext(game)
const useGameContext = () => useContext(GameContext)

export { GameContext, useGameContext }
