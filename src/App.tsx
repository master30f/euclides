import { useState, useRef } from "react"
import { invoke } from "@tauri-apps/api/tauri"
import "./App.css"

interface Point {
  x: number,
  y: number
}

type Shape = Point

function App() {
  const [instructions, setInstructions] = useState<string[]>([])
  const [shapes, setShapes] = useState<Shape[]>([])
  const instructionInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function resizeCanvas() {
    const canvas = canvasRef.current!
    
    canvas.width = canvas.parentElement!.clientWidth
    canvas.height = canvas.parentElement!.clientHeight

    drawShapes()
  }

  function drawShapes() {
    const canvas = canvasRef.current!

    const origin: Point = {
      x: canvas.width / 2,
      y: canvas.height / 2
    }

    const ctx = canvas.getContext("2d")!
    
    for (const shape of shapes) {
      ctx.beginPath()
      ctx.arc(origin.x + shape.x, origin.x + shape.y, 1, 0, 2*Math.PI)
      ctx.fill()
    }
  }

  async function appendInstruction(instruction: string) {
    const [newInstructions, newShapes] = await invoke("append_instruction", { instruction }) as [string[], Shape[]];
    setInstructions(newInstructions)
    setShapes(newShapes)

    drawShapes()
  }

  return (
    <div className="app">
      <div className="canvas-container" onResize={resizeCanvas}>
        <canvas
          className="canvas"
          ref={canvasRef}>
        </canvas>
      </div>
      <div className="instructions">
        <div>
          {instructions.map(instruction => {
            return (
              <p>{instruction}</p>
            )
          })}
        </div>

        <form
          className="instruction-form"
          onSubmit={(e) => {
            e.preventDefault();
            const instructionInput = instructionInputRef.current
            if (instructionInput && instructionInput.value) {
              appendInstruction(instructionInput.value)
              instructionInput.value = ""
            }
          }}
        >
          <input
            type="text"
            className="instruction-input"
            ref={instructionInputRef}
          />
        </form>
      </div>
    </div>
  );
}

export default App;
