/**
 * functions to compute required colors for the specified component
 */

/**
 * compute text color(steps remained) as a high contrast color
 * of the cell color
 * @param color color string of the input color,e.g. '#ffffff'
 */
function computeContrastColor(color) {
  // extract RGB
  let r = color.slice(1, 3)
  let g = color.slice(3, 5)
  let b = color.slice(5, 7)
  let count = parseInt(r, 16) + parseInt(g, 16) + parseInt(b, 16)

  // compute high contrast color
  let textColor = "#dddddd"
  if (count > 128 * 3) {
    textColor = "#444444"
  }
  return textColor
}

/**
 * get the color of the cell
 * @param cell cell objects
 * @param colors color array of the game grid
 */
function computeColor(cell, colors) {
  // set to black if it's misplaced without steps left
  if (cell.steps === 0 && cell.row !== cell.targetRow) {
    return "#212121"
  } else {
    // original color
    return colors[cell.targetRow]
  }
}

export { computeColor, computeContrastColor }
