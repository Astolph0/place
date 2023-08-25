import { PointerEvent, useEffect, useRef, useState } from "react";

export default function MapRender(props: {
  map: { colour: string; user: string }[][];
  onTileSelect?: (x: number, y: number) => void;
}) {
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;

  const [zoom, setZoom] = useState(1);
  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);

  const zoom2 = useRef(1);
  const pos2 = useRef({ x: 0, y: 0 });
  const mouseDown = useRef(false);
  const mouseMoved = useRef(false);

  const screenRes = useRef({ width: 640, height: 480 });
  const [screenWidth, setScreenWidth] = useState(640);
  const [screenHeight, setScreenHeight] = useState(480);

  const resizeHandle = () => {
    screenRes.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setScreenWidth(screenRes.current.width);
    setScreenHeight(screenRes.current.height);
  };

  const scrollHandle = (e: WheelEvent) => {
    const previousZoom = zoom2.current;
    const zoomScrollSpeed = 1 + Math.abs(zoom2.current - 1) * 0.1;
    zoom2.current -= (e.deltaY / 100) * zoomScrollSpeed;
    zoom2.current = Math.max(0.5, Math.min(100, zoom2.current)); // Limit zoom range

    const scaleFactor = zoom2.current / previousZoom;

    if (zoom !== zoom2.current) {
      const pos = { ...pos2.current };

      // Calculate cursor position relative to the container
      const cursorX =
        e.clientX - canvasRef.current.getBoundingClientRect().left;
      const cursorY = e.clientY - canvasRef.current.getBoundingClientRect().top;

      // Calculate the position change due to zoom
      const deltaX = cursorX - pos.x;
      const deltaY = cursorY - pos.y;

      // Update the position based on cursor and zoom
      pos.x = cursorX - deltaX * scaleFactor;
      pos.y = cursorY - deltaY * scaleFactor;

      pos2.current = pos;
      setMoveX(pos.x);
      setMoveY(pos.y);

      setZoom(zoom2.current);
    }
  };

  const pointerDownHandle = (e: PointerEvent<HTMLCanvasElement>) => {
    mouseDown.current = true;
    mouseMoved.current = false;
  };

  const pointerMoveHandle = (e: PointerEvent<HTMLCanvasElement>) => {
    if (mouseDown.current) {
      mouseMoved.current = true;
      pos2.current.x += e.movementX;
      pos2.current.y += e.movementY;
      setMoveX(pos2.current.x);
      setMoveY(pos2.current.y);
    }
  };

  const pointerUpHandle = (e: PointerEvent<HTMLCanvasElement>) => {
    mouseDown.current = false;
    if (!mouseMoved.current) {
      const canvas = canvasRef.current;
      const x = e.clientX - canvas.getBoundingClientRect().left;
      const y = e.clientY - canvas.getBoundingClientRect().top;
      const i = Math.floor((y - moveY) / zoom);
      const j = Math.floor((x - moveX) / zoom);

      if (i < 0) return;
      if (j < 0) return;
      if (i > props.map.length - 1) return;
      if (j > props.map[i].length - 1) return;
      if (props.onTileSelect) {
        props.onTileSelect(j, i);
      }
    }
  };

  const firstResize = useRef(true);

  useEffect(() => {
    if (firstResize.current) {
      firstResize.current = false;
      resizeHandle();

      zoom2.current = Math.min(
        screenRes.current.width / 110,
        screenRes.current.height / 110
      );
      setZoom(zoom2.current);

      pos2.current = {
        x: screenRes.current.width / 2 - (100 * zoom2.current) / 2,
        y: screenRes.current.height / 2 - (100 * zoom2.current) / 2,
      };
      setMoveX(pos2.current.x);
      setMoveY(pos2.current.y);
    }

    window.addEventListener("resize", resizeHandle);
    window.addEventListener("wheel", scrollHandle);
    return () => {
      window.removeEventListener("resize", resizeHandle);
      window.removeEventListener("wheel", scrollHandle);
    };
  }, [props.map, screenRes, scrollHandle]);

  function drawMap() {
    resizeHandle();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // render the map
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < props.map.length; i++) {
        const row = props.map[i];
        for (let j = 0; j < row.length; j++) {
          ctx.fillStyle = `#${row[j].colour}`;
          if (row[j].colour === "r") ctx.fillStyle = "#ff0000";
          if (row[j].colour === "g") ctx.fillStyle = "#00ff00";
          if (row[j].colour === "b") ctx.fillStyle = "#0000ff";
          if (row[j].colour === "y") ctx.fillStyle = "#ffff00";
          if (row[j].colour === "p") ctx.fillStyle = "#FFA9FF";
          if (row[j].colour === "c") ctx.fillStyle = "#00ffff";
          if (row[j].colour === "o") ctx.fillStyle = "#ff8800";
          if (row[j].colour === "w") ctx.fillStyle = "#ffffff";
          if (row[j].colour === "0") ctx.fillStyle = "#111111";
          ctx.fillRect(j * zoom + moveX, i * zoom + moveY, zoom, zoom);
        }
      }
    }
  }

  useEffect(() => {
    drawMap();
  }, [canvasRef, drawMap]);

  return (
    <canvas
      ref={canvasRef}
      width={screenWidth}
      height={screenHeight}
      style={{
        position: "fixed",
        left: "0",
        top: "0",
        width: "100vw",
        height: "100vh",
      }}
      onPointerDown={pointerDownHandle}
      onPointerMove={pointerMoveHandle}
      onPointerUp={pointerUpHandle}
    />
  );
}
