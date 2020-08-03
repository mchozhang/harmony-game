/**
 * helper functions of the game
 */

/**
 * judge whether has won the game
 * @param cells 2d cell grid
 * @returns {boolean} has won the game
 */
export const hasWon = (cells) => {
  let len = cells.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      let cell = cells[i][j]
      // if at least one cell has steps remained or isn't in the correct row,
      // then it hasn't won
      if (cell.steps !== 0 || cell.targetRow !== cell.row) {
        return false
      }
    }
  }
  return true
}

/**
 * judge whether the game is dead
 * @param cells 2d cell grid
 * @returns {boolean} is the game dead
 */
export const isDead = (cells) => {
  let len = cells.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      let cell = cells[i][j]
      // if at least one cell has no step remained and isn't in the correct row,
      // then it is dead
      if (cell.steps === 0 && cell.targetRow !== cell.row) {
        return true
      }
    }
  }
  return false
}
