// @flow
import { pointType } from '../enum'
import { matrixString } from '../utils'
import Game from '../model/Game'

export default class RenderCanvas {
  game: Game
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  backCanvas: HTMLCanvasElement
  backContext: CanvasRenderingContext2D
  brickCanvas: HTMLCanvasElement
  brickContext: CanvasRenderingContext2D
  width: number
  height: number
  cellWidth: number
  cellHeight: number
  lastBackPoints: string
  backColor: string

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) return

    this.canvas = canvas
  }

  init() {
    let { canvas } = this
    this.context = canvas.getContext('2d')
    this.width = canvas.width
    this.height = canvas.height
    this.backColor = '#e0e0e0'

    // clone elements
    let backCanvas = (this.backCanvas = canvas.cloneNode(true))
    let { offsetTop, offsetLeft } = canvas
    backCanvas.setAttribute(
      'id',
      (canvas.getAttribute('id') || '_canvas') + '_back'
    )
    backCanvas.className += ' ghost-canvas'
    canvas.parentElement && canvas.parentElement.appendChild(backCanvas)
    backCanvas.style.position = 'absolute'
    // backCanvas.style.top = offsetTop + 'px'
    // backCanvas.style.left = offsetLeft + 'px'
    backCanvas.style.zIndex = '2'
    this.backContext = backCanvas.getContext('2d')

    let brickCanvas = (this.brickCanvas = canvas.cloneNode(true))
    brickCanvas.setAttribute(
      'id',
      (canvas.getAttribute('id') || '_canvas') + '_brick'
    )
    brickCanvas.className += ' ghost-canvas'
    canvas.parentElement && canvas.parentElement.appendChild(brickCanvas)
    brickCanvas.style.position = 'absolute'
    // brickCanvas.style.top = offsetTop + 'px'
    // brickCanvas.style.left = offsetLeft + 'px'
    brickCanvas.style.zIndex = '3'
    this.brickContext = brickCanvas.getContext('2d')
  }

  loadGame(game: Game) {
    let { width, height } = this
    let { matrix } = (this.game = game)

    let firstLine = matrix[0]

    if (!firstLine) return

    this.cellWidth = width / firstLine.length
    this.cellHeight = height / matrix.length

    this.renderBack()
  }

  render() {
    let {
      game,
      width,
      height,
      context,
      backContext,
      brickContext,
      cellWidth,
      cellHeight
    } = this

    if (!game) throw new Error('load game first')

    let { matrix, brick, oldBrickColor, backColor } = game

    if (!matrix) return
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
    brickContext.lineWidth = 1
    matrix.forEach((row, rowIndex) => {
      row &&
        row.forEach((col, colIndex) => {
          let $context = null
          let fillStyle = null
          let strokeStyle = null
          switch (col) {
            case pointType.newBrick:
              $context = brickContext
              fillStyle = brickColor
              strokeStyle = '#000'
              break
            case pointType.oldBrick:
              $context = backContext
              fillStyle = oldBrickColor
              strokeStyle = '#000'
              break
            default:
              return
          }

          if ($context && fillStyle && strokeStyle) {
            $context.fillStyle = fillStyle
            $context.fillRect(
              colIndex * cellWidth,
              rowIndex * cellHeight,
              cellWidth,
              cellHeight
            )

            $context.strokeStyle = strokeStyle
            $context.strokeRect(
              colIndex * cellWidth,
              rowIndex * cellHeight,
              cellWidth,
              cellHeight
            )
          }
        })
    })
  }

  renderBack() {
    let {
      game,
      context,
      width,
      height,
      backColor,
      cellHeight,
      cellWidth
    } = this
    let { matrix } = game

    matrix.forEach((row, rowIndex) => {
      row &&
        row.forEach((col, colIndex) => {
          context.fillStyle = backColor
          context.fillRect(
            colIndex * cellWidth,
            rowIndex * cellHeight,
            cellWidth,
            cellHeight
          )

          context.strokeStyle = '#9e9e9e'
          context.strokeRect(
            colIndex * cellWidth,
            rowIndex * cellHeight,
            cellWidth,
            cellHeight
          )
        })
    })
  }

  cleanBrick() {
    this.brickCanvas.width = this.brickCanvas.width
  }

  cleanBack() {
    this.backCanvas.width = this.backCanvas.width
  }
}
