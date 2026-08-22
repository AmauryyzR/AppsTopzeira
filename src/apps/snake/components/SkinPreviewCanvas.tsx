import { useEffect, useRef } from 'react';
import { Skin } from '../types';
import { drawSnakeArtwork } from '../engine/SnakeArtwork';

interface SkinPreviewCanvasProps {
  skin: Skin;
}

export default function SkinPreviewCanvas({ skin }: SkinPreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let lastDraw = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const intersectionObserver = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { rootMargin: '120px' });
    intersectionObserver.observe(canvas);

    const draw = (timestamp: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || timestamp - lastDraw < 32) return;
      lastDraw = timestamp;

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);

      const background = ctx.createRadialGradient(width * 0.6, height * 0.45, 0, width * 0.5, height * 0.5, width * 0.65);
      background.addColorStop(0, `${skin.glowColor}22`);
      background.addColorStop(0.52, '#101827');
      background.addColorStop(1, '#050a14');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      const cellSize = Math.min(width / 9.3, height / 3.35);
      const verticalCenter = height / cellSize / 2 - 0.5;
      const horizontalOffset = Math.max(0, (width / cellSize - 8.6) / 2);
      const wave = Math.sin(timestamp / 850) * 0.08;
      const positions = [
        { x: horizontalOffset + 7.15, y: verticalCenter - 0.05 },
        { x: horizontalOffset + 6.22, y: verticalCenter - 0.05 },
        { x: horizontalOffset + 5.3, y: verticalCenter + 0.13 + wave },
        { x: horizontalOffset + 4.38, y: verticalCenter + 0.27 },
        { x: horizontalOffset + 3.46, y: verticalCenter + 0.1 - wave },
        { x: horizontalOffset + 2.54, y: verticalCenter - 0.13 },
        { x: horizontalOffset + 1.62, y: verticalCenter - 0.06 },
        { x: horizontalOffset + 0.85, y: verticalCenter + 0.06 },
      ];

      drawSnakeArtwork({
        ctx,
        positions,
        cellSize,
        skin,
        direction: { x: 1, y: 0 },
        time: timestamp / 1000,
        mouthOpen: 0,
        glow: true,
      });
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [skin]);

  return <canvas ref={canvasRef} className="block h-full w-full" aria-label={`Animated preview of ${skin.name}`} />;
}

