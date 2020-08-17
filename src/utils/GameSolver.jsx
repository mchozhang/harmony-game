/**
 * search algorithm to find the game solution
 */
import PriorityQueue from "js-priority-queue"
import { cloneDeep } from "lodash"

let heuristicMap = new Map()

function aStarSearch(grid) {
  if (isDead(grid)) {
    return []
  }

  let queue = new PriorityQueue({
    comparator: function (a, b) {
      return heuristicMap.get(a.toString()) - heuristicMap.get(b.toString())
    },
  })
  let startState = new State(grid)
  let explored = new Set()

  heuristicMap.set(startState.toString(), heuristic(startState))
  explored.add(startState.toString())
  queue.queue(startState)
  while (queue.length > 0) {
    // console.log("queue length:", queue.length)
    let currentState = queue.dequeue()

    if (currentState.hasWon) {
      console.log("explored:", explored.size)
      return solutionMoves(currentState)
    }

    let validMoves = getValidMoves(currentState.grid)
    for (let i = 0; i < validMoves.length; i++) {
      let newState = currentState.takeAction(validMoves[i])
      if (!explored.has(newState.toString())) {
        let heuristicVal = heuristic(newState) + newState.cost
        heuristicMap.set(newState.toString(), heuristicVal)

        // heuristic value greater than 1000 is considered to be dead
        if (heuristicVal < 1000) {
          explored.add(newState.toString())
          queue.queue(newState)
        }
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
    this.cost = 0
    this.lastMove = null
    this.parent = null
    this.size = grid.length
    this.count = grid.length * grid.length
    this.str = ""
    this.completeCount = 0
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let cell = grid[i][j]
        this.str += `${cell.steps}${cell.targetRow}`
        if (isCellComplete(cell)) {
          this.completeCount++
        }
      }
    }
    this.hasWon = this.completeCount === this.count
  }

  takeAction(move) {
    // update grid data
    let newGrid = cloneDeep(this.grid)
    let firstCell = newGrid[move[0]][move[1]]
    let secondCell = newGrid[move[2]][move[3]]
    let tmpSteps = firstCell.steps
    let tmpTargetRow = firstCell.targetRow
    firstCell.steps = secondCell.steps - 1
    firstCell.targetRow = secondCell.targetRow
    secondCell.steps = tmpSteps - 1
    secondCell.targetRow = tmpTargetRow

    // copy new state
    let state = new State(newGrid)
    state.parent = this
    state.cost = this.cost + 1
    state.lastMove = move

    return state
  }

  toString() {
    return this.str
  }
}

/**
 * heuristic function of the grid search，
 * calculate the expected steps for a cell to get to its target,
 * rule out some dead state by adding 1000 to the counter.
 * @param state 2D cell list
 */
function heuristic(state) {
  let count = 0
  let targetedCell = new Set()
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid.length; j++) {
      let cell = state.grid[i][j]
      if (cell.steps === 1) {
        let targetKey = `${i}${j}`
        // cells with 1 step remained
        if (cell.row !== cell.targetRow) {
          // a cell not in target row with 1 step remained
          if (
            isCellComplete(state.grid[cell.targetRow][j]) ||
            targetedCell.has(targetKey)
          ) {
            // game is dead when target cell is occupied
            // or 2 cells has the same target
            return 9999
          } else {
            // target cell is fixed
            targetedCell.add(targetKey)
            count++
          }
        } else {
          // cell in the target row but not complete
          count++
        }
      } else if (!isCellComplete(cell)) {
        // non-complete cells are all considered as 2 steps away
        count += 2
      }
    }
  }
  return count
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
 * whether the cell is complete
 * @param cell cell object
 * @returns {boolean}
 */
const isCellComplete = (cell) => {
  return cell.steps === 0 && cell.targetRow === cell.row
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
