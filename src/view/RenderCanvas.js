// @flow
import { pointType } from '../enum'
import { matrixString } from '../utils'
import Game from '../model/Game'

export default class RenderCanvas {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  backCanvas: HTMLCanvasElement
  backContext: CanvasRenderingContext2D
  brickCanvas: HTMLCanvasElement
  brickContext: CanvasRenderingContext2D
  width: number
  height: number
  lastBackPoints: string

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) return

    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.width = canvas.width
    this.height = canvas.height

    // clone elements
    let backCanvas = (this.backCanvas = canvas.cloneNode(true))
    let { offsetTop, offsetLeft } = canvas
    backCanvas.setAttribute(
      'id',
      (canvas.getAttribute('id') || '_canvas') + '_back'
    )
    canvas.parentElement && canvas.parentElement.appendChild(backCanvas)
    backCanvas.style.position = 'absolute'
    backCanvas.style.top = offsetTop + 'px'
    backCanvas.style.left = offsetLeft + 'px'
    backCanvas.style.zIndex = '2'
    this.backContext = backCanvas.getContext('2d')

    let brickCanvas = (this.brickCanvas = canvas.cloneNode(true))
    brickCanvas.setAttribute(
      'id',
      (canvas.getAttribute('id') || '_canvas') + '_brick'
    )
    canvas.parentElement && canvas.parentElement.appendChild(brickCanvas)
    brickCanvas.style.position = 'absolute'
    brickCanvas.style.top = offsetTop + 'px'
    brickCanvas.style.left = offsetLeft + 'px'
    brickCanvas.style.zIndex = '3'
    this.brickContext = brickCanvas.getContext('2d')
  }

  render(game: Game) {
    let { matrix, brick, oldBrickColor, backColor } = game
    let { width, height, context, backContext, brickContext } = this

    if (!matrix) return

    let firstLine = matrix[0]

    if (!firstLine) return

    this.renderBack(backColor)

    let cellWidth = width / firstLine.length
    let cellHeight = height / matrix.length
    let { color: brickColor } = brick || {}

    let backPoints = matrixString(
      matrix.map(
        row => row && row.map(col => Number(col === pointType.oldBrick))
      )
    )

    let sameBack = this.lastBackPoints && backPoints === this.lastBackPoints

    if (!sameBack) {
      this.cleanBack()
    }

    this.cleanBrick()

    // render brick
    matrix.forEach((row, rowIndex) => {
      row &&
        row.forEach((col, colIndex) => {
          switch (col) {
            case pointType.newBrick:
              brickContext.fillStyle = brickColor
              brickContext.fillRect(
                colIndex * cellWidth,
                rowIndex * cellHeight,
                cellWidth,
                cellHeight
              )
              break
            case pointType.oldBrick:
              backContext.fillStyle = oldBrickColor

              backContext.fillRect(
                colIndex * cellWidth,
                rowIndex * cellHeight,
                cellWidth,
                cellHeight
              )
              break
            default:
              return
          }
        })
    })
  }

  renderBack(backColor: string = 'gray') {
    let { context, width, height } = this

    context.fillStyle = backColor
    context.fillRect(0, 0, width, height)
  }

  cleanBrick() {
    this.brickCanvas.width = this.brickCanvas.width
  }

  cleanBack() {
    this.backCanvas.width = this.backCanvas.width
  }
}
