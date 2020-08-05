/**
 *  Game context
 */
import React, { createContext, useContext } from "react"

const GameContext = createContext(null)
const useGameContext = () => useContext(GameContext)

export { GameContext, useGameContext }
