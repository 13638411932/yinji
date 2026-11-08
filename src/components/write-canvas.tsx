import { Eraser, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

export function WriteCanvas({
  glyph,
  className,
}: {
  glyph: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Point[][]>([]);
  const currentRef = useRef<Point[] | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [showGuide, setShowGuide] = useState(true);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#fbf8f2";
    ctx.fillRect(0, 0, width, height);

    const inset = 18;
    const size = Math.min(width, height) - inset * 2;
    const x = (width - size) / 2;
    const y = (height - size) / 2;

    ctx.strokeStyle = "rgba(42, 88, 72, 0.22)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);
    ctx.beginPath();
    ctx.moveTo(x, y + size / 2);
    ctx.lineTo(x + size, y + size / 2);
    ctx.moveTo(x + size / 2, y);
    ctx.lineTo(x + size / 2, y + size);
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.stroke();

    if (showGuide) {
      ctx.fillStyle = "rgba(42, 88, 72, 0.22)";
      ctx.font = `500 ${Math.floor(size * 0.46)}px "Noto Sans", "Noto Sans SC", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(glyph, width / 2, height / 2 + 4);
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1c1916";
    ctx.lineWidth = 5;
    for (const stroke of strokesRef.current) {
      drawStroke(ctx, stroke);
    }
    if (currentRef.current) drawStroke(ctx, currentRef.current);
  }, [glyph, showGuide]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    paint();
  }, [paint]);

  useEffect(() => {
    const run = async () => {
      try {
        await document.fonts.load('160px "Noto Sans"');
      } catch {
        /* ignore */
      }
      resize();
    };
    void run();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    paint();
  }, [paint]);

  function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    currentRef.current = [pointFromEvent(event)];
    paint();
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!currentRef.current) return;
    currentRef.current.push(pointFromEvent(event));
    paint();
  }

  function onPointerUp() {
    if (currentRef.current && currentRef.current.length > 1) {
      strokesRef.current = [...strokesRef.current, currentRef.current];
      setStrokeCount(strokesRef.current.length);
    }
    currentRef.current = null;
    paint();
  }

  function undo() {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    paint();
  }

  function clear() {
    strokesRef.current = [];
    currentRef.current = null;
    setStrokeCount(0);
    paint();
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="overflow-hidden rounded-xl shadow-card">
        <canvas
          ref={canvasRef}
          className="block h-72 w-full touch-none bg-bg-elevated"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setShowGuide((v) => !v)}>
          {showGuide ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {showGuide ? "藏字" : "显字"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={undo} disabled={strokeCount === 0}>
          <RotateCcw className="size-4" />
          撤销
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={clear} disabled={strokeCount === 0}>
          <Eraser className="size-4" />
          清除
        </Button>
        <span className="ml-auto text-xs text-muted tabular-nums">{strokeCount} 笔</span>
      </div>
    </div>
  );
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Point[]) {
  if (stroke.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(stroke[0]!.x, stroke[0]!.y);
  for (let i = 1; i < stroke.length; i++) {
    ctx.lineTo(stroke[i]!.x, stroke[i]!.y);
  }
  ctx.stroke();
}
