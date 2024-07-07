"use client";
import ChatBox from "@/components/ChatBox";
//@ts-ignore
import ShareUrl from "@/components/ShareUrl";
import { useDraw } from "@/hooks/useDraw";
import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { io } from "socket.io-client";
import { useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

export default function Page<pageProps>({}) {
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const [color, setColor] = useState<string>("#000");
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const params = useParams<{ tag: string; roomId: string }>();
  const searchParams = useSearchParams();
  const [roomID, setRoomID] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const id = params.roomId;
    console.log("Room ID from params:", id);
    setRoomID(id);
    const nameParam = searchParams.get('query');
    console.log("Name from searchParams:", nameParam);
    setName(nameParam || '');
  }, [params, searchParams]);

  useEffect(() => {
    setCanvasWidth(window.innerWidth);
    setCanvasHeight(window.innerHeight);
  }, []);

  const socket = io(`http://localhost:3001/`, {
    query: {
      roomID: roomID,
      name: name
    },
  });

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      console.log("sending canvas state");
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("Received canvas state from server");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color }: DrawLineProps) => {
        if (!ctx) return console.log("no ctx here");
        drawLine({ prevPoint, currentPoint, ctx, color });
      }
    );

    socket.on("clear", clear);

    return () => {
      socket.off("draw-line");
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("clear");
    };
  }, [canvasRef, socket, clear]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, ctx, color });
  }

  function drawLine({ prevPoint, currentPoint, ctx, color }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-center">
      <div className="flex h-[5rem] justify-between gap-[20rem] mt-[2rem]">
        <ChromePicker
          className="h-[4rem] z-10"
          color={color}
          onChange={(e) => setColor(e.hex)}
        />
        <button
          //@ts-ignore
          onClick={() => {
            clear();
            socket.emit("clear");
          }}
          className="text-xl font-bold bg-indigo-500 text-white w-[7rem] h-[3rem] z-40 rounded-md"
        >
          clear canvas
        </button>
        <ShareUrl id={roomID} />
      </div>

      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="absolute z-1"
      />
      {/* @ts-ignore */}
      <ChatBox socket={socket} />
    </div>
  );
}
