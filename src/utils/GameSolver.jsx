/**
 * search algorithm to find the game solution
 */
import PriorityQueue from "js-priority-queue"
import { cloneDeep } from "lodash"

function aStarSearch(grid) {
  if (isDead(grid)) {
    return []
  }

  let queue = new PriorityQueue({
    comparator: function (a, b) {
      return heuristic(a) - heuristic(b)
    },
  })
  let startState = new State(grid)
  let explored = new GridSet()

  queue.queue(startState)
  explored.add(startState)
  while (queue.length > 0) {
    let currentState = queue.dequeue()

    if (hasWon(currentState.grid)) {
      return solutionMoves(currentState)
    }

    let validMoves = getValidMoves(currentState.grid)
    for (let i = 0; i < validMoves.length; i++) {
      let newState = new State(cloneDeep(currentState.grid))
      newState.takeAction(validMoves[i])
      if (!explored.has(newState)) {
        newState.parent = currentState
        explored.add(newState)
        queue.queue(newState)
      }
    }
  }
  return []
}

/**
 * all the valid moves of the grid
 * @param grid 2D cell list
 * @returns {[]} list of moves
 */
function getValidMoves(grid) {
  let moves = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      moves.push(...validMovesForCell(i, j, grid))
    }
  }
  return moves
}

/**
 * downwardly find valid moves for one position(selected cell)
 * @param row row of the selected cell
 * @param col column of the selected cell
 * @param grid 2D cell list
 * @returns {[]} list of moves of the selected cell
 */
function validMovesForCell(row, col, grid) {
  let result = []
  let origin = grid[row][col]
  if (origin.steps === 0) {
    return []
  }

  // cells in the same column
  for (let i = row + 1; i < grid.length; i++) {
    let target = grid[i][col]
    if (exchangeable(origin, target)) {
      result.push([row, col, i, col])
    }
  }
  //cells in the same row
  for (let i = col + 1; i < grid.length; i++) {
    let target = grid[row][i]
    if (exchangeable(origin, target)) {
      result.push([row, col, row, i])
    }
  }
  return result
}

/**
 * pre-condition: origin has steps remained
 * whether 2 cells are exchangeable(not dead after exchanging)
 * @param origin origin cell
 * @param target target cell
 */
function exchangeable(origin, target) {
  return (
    target.steps > 0 &&
    !(origin.steps === 1 && origin.targetRow !== target.row) &&
    !(target.steps === 1 && target.targetRow !== origin.row)
  )
}

/**
 * state of the game
 */
class State {
  constructor(grid) {
    this.grid = grid
    this.lastMove = null
    this.parent = null
  }

  takeAction(move) {
    let firstCell = this.grid[move[0]][move[1]]
    let secondCell = this.grid[move[2]][move[3]]
    let tmpSteps = firstCell.steps
    let tmpTargetRow = firstCell.targetRow
    firstCell.steps = secondCell.steps - 1
    firstCell.targetRow = secondCell.targetRow
    secondCell.steps = tmpSteps - 1
    secondCell.targetRow = tmpTargetRow
    this.lastMove = move
  }

  toString() {
    let result = ""
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid.length; j++) {
        let cell = this.grid[i][j]
        result += `(${cell.steps},${cell.targetRow})`
      }
    }
    return result
  }
}

/**
 * A set structure to keep non-identical grid states
 */
class GridSet extends Set {
  add(state) {
    super.add(state.toString())
  }

  has(state) {
    return super.has(state.toString())
  }
}

let map = new Map()

/**
 * heuristic function of the grid search
 * @param state 2D cell list
 */
function heuristic(state) {
  let key = state.toString()
  if (map.has(key)) {
    return map.get(key)
  }

  let grid = state.grid
  let count = 0
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      let cell = grid[i][j]
      if (cell.row !== cell.targetRow) {
        count++
      } else if (cell.steps > 0) {
        count++
      }
    }
  }
  map.set(key, count / 2)
  return count / 2
}

function solutionMoves(state) {
  if (state === null) {
    return []
  }
  let result = []
  let current = state
  while (current.parent !== null) {
    result.splice(0, 0, current.lastMove)
    current = current.parent
  }
  return result
}

/**
 * judge whether has won the game
 * @param grid 2d cell grid
 * @returns {boolean} has won the game
 */
const hasWon = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      let cell = grid[i][j]
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
const isDead = (cells) => {
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

export { aStarSearch, hasWon, isDead }
