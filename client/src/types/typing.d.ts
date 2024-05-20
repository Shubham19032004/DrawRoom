type Draw = {
    ctx: CanvasRenderingContext2D
    currentPoint: Point
    prevPoint: Point | null
    color?:any
  }
  

  type Point = { x: number; y: number }

