import { Skin, SkinMaterial } from '../types';

export interface ArtworkPoint {
  x: number;
  y: number;
}

export interface DrawSnakeArtworkOptions {
  ctx: CanvasRenderingContext2D;
  positions: ArtworkPoint[];
  cellSize: number;
  skin: Skin;
  direction: ArtworkPoint;
  time: number;
  mouthOpen?: number;
  glow?: boolean;
  bulges?: ArtworkBulge[];
}

export interface ArtworkBulge {
  progress: number;
  strength: number;
}

interface RenderPoint extends ArtworkPoint {
  tangentX: number;
  tangentY: number;
  normalX: number;
  normalY: number;
  radius: number;
  tailProgress: number;
}

const TAU = Math.PI * 2;

function chaikin(points: ArtworkPoint[], iterations = 2): ArtworkPoint[] {
  if (points.length < 3) return points.map(point => ({ ...point }));

  let result = points.map(point => ({ ...point }));
  for (let pass = 0; pass < iterations; pass++) {
    const next: ArtworkPoint[] = [{ ...result[0] }];
    for (let index = 0; index < result.length - 1; index++) {
      const a = result[index];
      const b = result[index + 1];
      next.push(
        { x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 },
        { x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 },
      );
    }
    next.push({ ...result[result.length - 1] });
    result = next;
  }
  return result;
}

function splitAtWraps(points: ArtworkPoint[], cellSize: number): ArtworkPoint[][] {
  const runs: ArtworkPoint[][] = [];
  let run: ArtworkPoint[] = [];
  const maxDistance = cellSize * 1.65;

  points.forEach((point, index) => {
    const previous = points[index - 1];
    if (previous && Math.hypot(point.x - previous.x, point.y - previous.y) > maxDistance) {
      if (run.length) runs.push(run);
      run = [];
    }
    run.push(point);
  });

  if (run.length) runs.push(run);
  return runs;
}

function enrich(points: ArtworkPoint[], cellSize: number, taperTail: boolean): RenderPoint[] {
  return points.map((point, index) => {
    const before = points[Math.max(0, index - 1)];
    const after = points[Math.min(points.length - 1, index + 1)];
    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const magnitude = Math.hypot(dx, dy) || 1;
    const tangentX = dx / magnitude;
    const tangentY = dy / magnitude;
    const progress = points.length <= 1 ? 0 : index / (points.length - 1);
    const neck = 0.9 + Math.min(1, progress / 0.14) * 0.1;
    const tailProgress = taperTail ? Math.max(0, (progress - 0.58) / 0.42) : 0;
    const smoothTailProgress = tailProgress * tailProgress * (3 - 2 * tailProgress);
    const tail = 1 - smoothTailProgress * 0.94;
    const breathing = 1 + Math.sin(progress * Math.PI * 5) * 0.018;
    return {
      ...point,
      tangentX,
      tangentY,
      normalX: -tangentY,
      normalY: tangentX,
      radius: cellSize * 0.405 * neck * tail * breathing,
      tailProgress,
    };
  });
}

function makeRibbon(points: RenderPoint[], scale = 1, tailTipLength = 0): Path2D {
  const path = new Path2D();
  if (!points.length) return path;

  points.forEach((point, index) => {
    const x = point.x + point.normalX * point.radius * scale;
    const y = point.y + point.normalY * point.radius * scale;
    if (index === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  });

  let reverseStart = points.length - 1;
  const tail = points[points.length - 1];
  const hasNaturalTail = points.length > 1 && tail.tailProgress > 0.98;

  if (hasNaturalTail) {
    const tailRadius = tail.radius * scale;
    const tipLength = tailTipLength || Math.max(...points.map(point => point.radius)) * 0.92;
    const tipX = tail.x + tail.tangentX * tipLength;
    const tipY = tail.y + tail.tangentY * tipLength;
    const shoulderX = tail.x + tail.tangentX * tipLength * 0.48;
    const shoulderY = tail.y + tail.tangentY * tipLength * 0.48;

    path.quadraticCurveTo(
      shoulderX + tail.normalX * tailRadius * 0.62,
      shoulderY + tail.normalY * tailRadius * 0.62,
      tipX,
      tipY,
    );
    path.quadraticCurveTo(
      shoulderX - tail.normalX * tailRadius * 0.62,
      shoulderY - tail.normalY * tailRadius * 0.62,
      tail.x - tail.normalX * tailRadius,
      tail.y - tail.normalY * tailRadius,
    );
    reverseStart -= 1;
  }

  for (let index = reverseStart; index >= 0; index--) {
    const point = points[index];
    path.lineTo(
      point.x - point.normalX * point.radius * scale,
      point.y - point.normalY * point.radius * scale,
    );
  }
  path.closePath();
  return path;
}

function makeCenterLine(points: RenderPoint[]): Path2D {
  const path = new Path2D();
  points.forEach((point, index) => {
    if (index === 0) path.moveTo(point.x, point.y);
    else path.lineTo(point.x, point.y);
  });
  return path;
}

function materialIs(material: SkinMaterial, ...materials: SkinMaterial[]) {
  return materials.includes(material);
}

function applyBulges(runs: RenderPoint[][], cellSize: number, bulges: ArtworkBulge[]) {
  if (!bulges.length) return;

  let totalLength = 0;
  runs.forEach(run => {
    for (let index = 1; index < run.length; index++) {
      totalLength += Math.hypot(run[index].x - run[index - 1].x, run[index].y - run[index - 1].y);
    }
  });
  if (totalLength <= 0) return;

  const samples: { point: RenderPoint; distance: number; baseRadius: number }[] = [];
  let travelled = 0;

  runs.forEach(run => {
    run.forEach((point, index) => {
      if (index > 0) {
        travelled += Math.hypot(point.x - run[index - 1].x, point.y - run[index - 1].y);
      }
      samples.push({ point, distance: travelled, baseRadius: point.radius });
    });
  });

  bulges.forEach(bulge => {
    const centerDistance = Math.max(0, Math.min(1, bulge.progress)) * totalLength;
    let centerSample = samples[0];
    for (const sample of samples) {
      if (Math.abs(sample.distance - centerDistance) < Math.abs(centerSample.distance - centerDistance)) {
        centerSample = sample;
      }
    }

    // Treat the swallowed coin as a real circle centered on the snake's path.
    // Its radius shrinks with progress, while max() blends it into the body.
    const coinRadius = centerSample.baseRadius + cellSize * (0.025 + Math.max(0, bulge.strength) * 0.235);
    samples.forEach(sample => {
      const longitudinalDistance = Math.abs(sample.distance - centerDistance);
      if (longitudinalDistance >= coinRadius) return;
      const circularHalfWidth = Math.sqrt(
        Math.max(0, coinRadius * coinRadius - longitudinalDistance * longitudinalDistance),
      );
      sample.point.radius = Math.max(sample.point.radius, circularHalfWidth);
    });
  });
}

function getStableTailDirection(points: RenderPoint[], cellSize: number) {
  const tail = points[points.length - 1];
  if (!tail) return { x: 1, y: 0 };

  let anchor = points[Math.max(0, points.length - 2)] || tail;
  let coveredDistance = 0;
  for (let index = points.length - 2; index >= 0; index--) {
    const next = points[index + 1];
    const current = points[index];
    coveredDistance += Math.hypot(next.x - current.x, next.y - current.y);
    anchor = current;
    if (coveredDistance >= cellSize * 1.65) break;
  }

  const dx = tail.x - anchor.x;
  const dy = tail.y - anchor.y;
  const magnitude = Math.hypot(dx, dy);
  if (magnitude < cellSize * 0.15) return { x: tail.tangentX, y: tail.tangentY };
  return { x: dx / magnitude, y: dy / magnitude };
}

function drawTailAdornment(
  ctx: CanvasRenderingContext2D,
  points: RenderPoint[],
  skin: Skin,
  cellSize: number,
  time: number,
  glow: boolean,
) {
  const tail = points[points.length - 1];
  if (!tail) return;
  const material = skin.visual.material;
  const stableDirection = getStableTailDirection(points, cellSize);
  const angle = Math.atan2(stableDirection.y, stableDirection.x);

  ctx.save();
  ctx.translate(tail.x, tail.y);
  ctx.rotate(angle);

  if (materialIs(material, 'fire', 'magma')) {
    if (glow) {
      ctx.shadowColor = skin.glowColor;
      ctx.shadowBlur = cellSize * 0.55;
    }
    for (let flame = -1; flame <= 1; flame++) {
      const offset = flame * cellSize * 0.13;
      const reach = cellSize * (0.58 + (flame === 0 ? 0.2 : 0.06)) + Math.sin(time * 9 + flame) * cellSize * 0.06;
      ctx.fillStyle = flame === 0 ? skin.visual.detailColor : skin.visual.secondaryDetailColor;
      ctx.beginPath();
      ctx.moveTo(-cellSize * 0.06, offset - cellSize * 0.12);
      ctx.bezierCurveTo(cellSize * 0.2, offset - cellSize * 0.2, reach * 0.68, offset - cellSize * 0.13, reach, offset);
      ctx.bezierCurveTo(reach * 0.62, offset + cellSize * 0.05, cellSize * 0.2, offset + cellSize * 0.2, -cellSize * 0.06, offset + cellSize * 0.12);
      ctx.closePath();
      ctx.fill();
    }
  } else if (materialIs(material, 'ice', 'crystal')) {
    ctx.fillStyle = skin.visual.detailColor;
    ctx.strokeStyle = skin.visual.highlightColor;
    ctx.lineWidth = Math.max(1, cellSize * 0.035);
    for (let spike = -1; spike <= 1; spike++) {
      ctx.beginPath();
      ctx.moveTo(-cellSize * 0.04, spike * cellSize * 0.12 - cellSize * 0.09);
      ctx.lineTo(cellSize * (0.5 + (spike === 0 ? 0.18 : 0)), spike * cellSize * 0.16);
      ctx.lineTo(-cellSize * 0.04, spike * cellSize * 0.12 + cellSize * 0.09);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (materialIs(material, 'energy', 'plasma', 'light', 'rainbow')) {
    const pulse = 0.75 + Math.sin(time * 8) * 0.12;
    ctx.globalCompositeOperation = 'lighter';
    const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, cellSize * 0.34 * pulse);
    aura.addColorStop(0, skin.visual.highlightColor);
    aura.addColorStop(0.38, skin.visual.detailColor);
    aura.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = aura;
    ctx.globalAlpha = 0.52;
    ctx.beginPath();
    ctx.arc(0, 0, cellSize * 0.34 * pulse, 0, TAU);
    ctx.fill();
  } else if (materialIs(material, 'void', 'shadow', 'blood')) {
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = skin.visual.detailColor;
    for (let mist = 0; mist < 4; mist++) {
      const radius = cellSize * (0.16 + mist * 0.04);
      ctx.beginPath();
      ctx.arc(Math.sin(time * 2 + mist) * cellSize * 0.07, Math.sin(time * 3 + mist) * cellSize * 0.15, radius, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawScaleMotif(ctx: CanvasRenderingContext2D, radius: number, cellSize: number, skin: Skin) {
  ctx.strokeStyle = skin.visual.detailColor;
  ctx.fillStyle = skin.visual.secondaryDetailColor;
  ctx.lineWidth = Math.max(1, cellSize * 0.035);
  for (let row = -1; row <= 1; row++) {
    const y = row * radius * 0.47;
    const width = row === 0 ? cellSize * 0.25 : cellSize * 0.18;
    ctx.beginPath();
    ctx.moveTo(-width, y);
    ctx.quadraticCurveTo(0, y - radius * 0.27, width, y);
    ctx.quadraticCurveTo(0, y + radius * 0.27, -width, y);
    ctx.closePath();
    ctx.globalAlpha = row === 0 ? 0.58 : 0.36;
    ctx.fill();
    ctx.globalAlpha = 0.68;
    ctx.stroke();
  }
}

function drawFireMotif(
  ctx: CanvasRenderingContext2D,
  radius: number,
  cellSize: number,
  skin: Skin,
  time: number,
  index: number,
) {
  const pulse = 0.84 + Math.sin(time * 6.5 + index * 0.8) * 0.16;
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = skin.visual.secondaryDetailColor;
  ctx.lineWidth = cellSize * 0.16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.42 * pulse;
  ctx.beginPath();
  ctx.moveTo(-cellSize * 0.3, -radius * 0.82);
  ctx.lineTo(cellSize * 0.14, -radius * 0.34);
  ctx.lineTo(-cellSize * 0.12, -radius * 0.04);
  ctx.lineTo(cellSize * 0.26, radius * 0.33);
  ctx.lineTo(-cellSize * 0.2, radius * 0.82);
  ctx.stroke();

  ctx.strokeStyle = skin.visual.detailColor;
  ctx.lineWidth = cellSize * 0.07;
  ctx.globalAlpha = 0.95 * pulse;
  ctx.stroke();

  ctx.strokeStyle = skin.visual.highlightColor;
  ctx.lineWidth = cellSize * 0.025;
  ctx.globalAlpha = 0.9;
  ctx.stroke();
}

function drawBodyMotif(
  ctx: CanvasRenderingContext2D,
  point: RenderPoint,
  skin: Skin,
  cellSize: number,
  time: number,
  index: number,
) {
  const material = skin.visual.material;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(Math.atan2(point.tangentY, point.tangentX));

  if (materialIs(material, 'fire', 'magma')) {
    drawFireMotif(ctx, point.radius, cellSize, skin, time, index);
  } else if (materialIs(material, 'organic', 'metal', 'crystal')) {
    drawScaleMotif(ctx, point.radius, cellSize, skin);
  } else if (materialIs(material, 'energy', 'plasma', 'light')) {
    const pulse = 0.72 + Math.sin(time * 7 - index * 0.7) * 0.25;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = skin.visual.detailColor;
    ctx.globalAlpha = pulse;
    ctx.lineWidth = cellSize * 0.07;
    ctx.beginPath();
    ctx.moveTo(0, -point.radius * 0.82);
    ctx.bezierCurveTo(cellSize * 0.24, -point.radius * 0.42, -cellSize * 0.24, point.radius * 0.42, 0, point.radius * 0.82);
    ctx.stroke();
    ctx.fillStyle = skin.visual.highlightColor;
    ctx.beginPath();
    ctx.arc(0, 0, cellSize * 0.09, 0, TAU);
    ctx.fill();
  } else if (material === 'cyber') {
    ctx.strokeStyle = skin.visual.detailColor;
    ctx.lineWidth = Math.max(1, cellSize * 0.045);
    ctx.globalAlpha = 0.86;
    ctx.strokeRect(-cellSize * 0.28, -point.radius * 0.72, cellSize * 0.56, point.radius * 1.44);
    ctx.beginPath();
    ctx.moveTo(-cellSize * 0.28, 0);
    ctx.lineTo(-cellSize * 0.06, 0);
    ctx.lineTo(cellSize * 0.08, -point.radius * 0.35);
    ctx.lineTo(cellSize * 0.28, -point.radius * 0.35);
    ctx.stroke();
    ctx.fillStyle = skin.visual.highlightColor;
    ctx.fillRect(-cellSize * 0.04, -cellSize * 0.04, cellSize * 0.08, cellSize * 0.08);
  } else if (material === 'sludge') {
    ctx.fillStyle = skin.visual.detailColor;
    ctx.globalAlpha = 0.5;
    const bubbles = [
      [-0.18, -0.3, 0.1],
      [0.12, 0.24, 0.13],
      [0.26, -0.1, 0.07],
    ];
    bubbles.forEach(([x, y, size]) => {
      ctx.beginPath();
      ctx.arc(x * cellSize, y * point.radius, size * cellSize, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = skin.visual.highlightColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  } else if (material === 'ice') {
    ctx.strokeStyle = skin.visual.highlightColor;
    ctx.fillStyle = skin.visual.secondaryDetailColor;
    ctx.globalAlpha = 0.62;
    ctx.lineWidth = Math.max(1, cellSize * 0.035);
    ctx.beginPath();
    ctx.moveTo(-cellSize * 0.3, 0);
    ctx.lineTo(0, -point.radius * 0.78);
    ctx.lineTo(cellSize * 0.3, 0);
    ctx.lineTo(0, point.radius * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-cellSize * 0.3, 0);
    ctx.lineTo(cellSize * 0.3, 0);
    ctx.moveTo(0, -point.radius * 0.78);
    ctx.lineTo(0, point.radius * 0.78);
    ctx.stroke();
  } else if (materialIs(material, 'void', 'shadow', 'blood')) {
    ctx.strokeStyle = skin.visual.detailColor;
    ctx.lineWidth = cellSize * 0.065;
    ctx.globalAlpha = 0.58 + Math.sin(time * 3 + index) * 0.18;
    ctx.beginPath();
    ctx.arc(0, 0, cellSize * 0.18, Math.PI * 0.15, Math.PI * 1.55);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-cellSize * 0.13, point.radius * 0.5);
    ctx.lineTo(0, 0);
    ctx.lineTo(cellSize * 0.16, -point.radius * 0.45);
    ctx.stroke();
  } else if (material === 'rainbow') {
    const hue = (time * 45 + index * 53) % 360;
    ctx.strokeStyle = `hsl(${hue}, 95%, 68%)`;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = cellSize * 0.12;
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.moveTo(0, -point.radius * 0.88);
    ctx.lineTo(0, point.radius * 0.88);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = cellSize * 0.025;
    ctx.stroke();
  }
  ctx.restore();
}

function drawBodyRun(
  ctx: CanvasRenderingContext2D,
  points: RenderPoint[],
  skin: Skin,
  cellSize: number,
  time: number,
  glow: boolean,
) {
  if (points.length === 1) {
    ctx.fillStyle = skin.bodyColors[0];
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, points[0].radius, 0, TAU);
    ctx.fill();
    return;
  }

  const tailTipLength = cellSize * 0.38;
  const outerPath = makeRibbon(points, 1.08, tailTipLength);
  const innerPath = makeRibbon(points, 0.93, tailTipLength);
  const centerLine = makeCenterLine(points);

  ctx.save();
  ctx.translate(0, cellSize * 0.13);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.5)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = cellSize * 0.3;
  ctx.fill(outerPath);
  ctx.restore();

  if (glow && skin.trail) {
    ctx.save();
    ctx.shadowColor = skin.glowColor;
    ctx.shadowBlur = cellSize * 0.48;
    ctx.globalAlpha = 0.48;
    ctx.fillStyle = skin.glowColor;
    ctx.fill(outerPath);
    ctx.restore();
  }

  ctx.fillStyle = skin.visual.outlineColor;
  ctx.fill(outerPath);

  const minY = Math.min(...points.map(point => point.y - point.radius));
  const maxY = Math.max(...points.map(point => point.y + point.radius));
  const bodyGradient = ctx.createLinearGradient(0, minY, 0, maxY || minY + 1);
  if (skin.visual.material === 'rainbow') {
    const hue = (time * 58) % 360;
    bodyGradient.addColorStop(0, `hsl(${(hue + 45) % 360}, 100%, 82%)`);
    bodyGradient.addColorStop(0.24, `hsl(${hue}, 92%, 62%)`);
    bodyGradient.addColorStop(0.58, `hsl(${(hue + 115) % 360}, 92%, 54%)`);
    bodyGradient.addColorStop(1, `hsl(${(hue + 205) % 360}, 88%, 40%)`);
  } else {
    bodyGradient.addColorStop(0, skin.visual.highlightColor);
    bodyGradient.addColorStop(0.22, skin.headColor);
    bodyGradient.addColorStop(0.58, skin.bodyColors[0]);
    bodyGradient.addColorStop(1, skin.bodyColors[1] || skin.visual.outlineColor);
  }
  ctx.fillStyle = bodyGradient;
  ctx.fill(innerPath);

  ctx.save();
  ctx.clip(innerPath);

  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = skin.visual.highlightColor;
  ctx.lineWidth = cellSize * 0.13;
  ctx.stroke(centerLine);

  let distanceSinceDetail = cellSize * 0.55;
  let motifIndex = 0;
  for (let index = 1; index < points.length - 1; index++) {
    const point = points[index];
    const previous = points[index - 1];
    distanceSinceDetail += Math.hypot(point.x - previous.x, point.y - previous.y);
    if (distanceSinceDetail < cellSize * 0.72) continue;
    distanceSinceDetail = 0;

    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(Math.atan2(point.tangentY, point.tangentX));
    ctx.strokeStyle = skin.visual.outlineColor;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = Math.max(1, cellSize * 0.035);
    ctx.beginPath();
    ctx.moveTo(0, -point.radius * 0.9);
    ctx.lineTo(0, point.radius * 0.9);
    ctx.stroke();
    ctx.restore();

    drawBodyMotif(ctx, point, skin, cellSize, time, motifIndex++);
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.34;
  ctx.strokeStyle = skin.visual.highlightColor;
  ctx.lineWidth = Math.max(1, cellSize * 0.028);
  ctx.stroke(outerPath);
  ctx.restore();
}

function headPath(cellSize: number, scale = 1): Path2D {
  const path = new Path2D();
  const c = cellSize * scale;
  path.moveTo(-c * 0.5, -c * 0.34);
  path.bezierCurveTo(-c * 0.22, -c * 0.5, c * 0.2, -c * 0.48, c * 0.48, -c * 0.3);
  path.quadraticCurveTo(c * 0.63, -c * 0.16, c * 0.62, 0);
  path.quadraticCurveTo(c * 0.63, c * 0.16, c * 0.48, c * 0.3);
  path.bezierCurveTo(c * 0.2, c * 0.48, -c * 0.22, c * 0.5, -c * 0.5, c * 0.34);
  path.quadraticCurveTo(-c * 0.66, 0, -c * 0.5, -c * 0.34);
  path.closePath();
  return path;
}

function drawHead(
  ctx: CanvasRenderingContext2D,
  head: ArtworkPoint,
  direction: ArtworkPoint,
  skin: Skin,
  cellSize: number,
  mouthOpen: number,
  time: number,
  glow: boolean,
) {
  const angle = Math.atan2(direction.y, direction.x);
  const material = skin.visual.material;
  const outer = headPath(cellSize, 1.04);
  const inner = headPath(cellSize, 0.92);

  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(angle);

  ctx.save();
  ctx.translate(0, cellSize * 0.12);
  ctx.fillStyle = 'rgba(2, 6, 23, 0.58)';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = cellSize * 0.3;
  ctx.fill(outer);
  ctx.restore();

  if (glow) {
    ctx.shadowColor = skin.glowColor;
    ctx.shadowBlur = cellSize * 0.45;
  }
  ctx.fillStyle = skin.visual.outlineColor;
  ctx.fill(outer);

  const gradient = ctx.createLinearGradient(0, -cellSize * 0.46, 0, cellSize * 0.46);
  if (material === 'rainbow') {
    const hue = (time * 58 + 25) % 360;
    gradient.addColorStop(0, `hsl(${(hue + 55) % 360}, 100%, 85%)`);
    gradient.addColorStop(0.3, `hsl(${hue}, 95%, 62%)`);
    gradient.addColorStop(1, `hsl(${(hue + 170) % 360}, 90%, 43%)`);
  } else {
    gradient.addColorStop(0, skin.visual.highlightColor);
    gradient.addColorStop(0.3, skin.headColor);
    gradient.addColorStop(1, skin.bodyColors[1] || skin.headColor);
  }
  ctx.fillStyle = gradient;
  ctx.fill(inner);
  ctx.shadowBlur = 0;

  if (materialIs(material, 'fire', 'magma')) {
    ctx.strokeStyle = skin.visual.detailColor;
    ctx.lineWidth = cellSize * 0.07;
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    ctx.moveTo(-cellSize * 0.26, -cellSize * 0.05);
    ctx.lineTo(-cellSize * 0.05, cellSize * 0.08);
    ctx.lineTo(cellSize * 0.16, -cellSize * 0.04);
    ctx.lineTo(cellSize * 0.4, cellSize * 0.04);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  } else if (material === 'cyber') {
    ctx.strokeStyle = skin.visual.detailColor;
    ctx.lineWidth = cellSize * 0.035;
    ctx.strokeRect(-cellSize * 0.22, -cellSize * 0.29, cellSize * 0.52, cellSize * 0.58);
  } else if (materialIs(material, 'ice', 'crystal', 'metal')) {
    ctx.strokeStyle = skin.visual.detailColor;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = cellSize * 0.035;
    ctx.beginPath();
    ctx.moveTo(-cellSize * 0.34, 0);
    ctx.lineTo(0, -cellSize * 0.3);
    ctx.lineTo(cellSize * 0.38, 0);
    ctx.lineTo(0, cellSize * 0.3);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  const eyeX = cellSize * 0.13;
  const eyeY = cellSize * 0.27;
  const eyeRadius = cellSize * 0.105;
  for (const side of [-1, 1]) {
    ctx.fillStyle = skin.visual.eyeColor;
    ctx.beginPath();
    ctx.ellipse(eyeX, side * eyeY, eyeRadius * 1.06, eyeRadius, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = skin.visual.outlineColor;
    ctx.lineWidth = Math.max(1, cellSize * 0.025);
    ctx.stroke();

    ctx.fillStyle = skin.visual.pupilColor;
    ctx.beginPath();
    ctx.ellipse(eyeX + cellSize * 0.035, side * eyeY, eyeRadius * 0.22, eyeRadius * 0.66, 0, 0, TAU);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.arc(eyeX + cellSize * 0.055, side * eyeY - cellSize * 0.025, cellSize * 0.022, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = skin.visual.outlineColor;
    ctx.lineWidth = cellSize * 0.055;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(eyeX - cellSize * 0.09, side * (eyeY + cellSize * 0.09));
    ctx.lineTo(eyeX + cellSize * 0.11, side * (eyeY + cellSize * 0.075));
    ctx.stroke();
  }

  ctx.fillStyle = skin.visual.outlineColor;
  ctx.globalAlpha = 0.5;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cellSize * 0.43, side * cellSize * 0.11, cellSize * 0.025, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (mouthOpen > 0.03) {
    const open = Math.min(1, mouthOpen);
    ctx.fillStyle = materialIs(material, 'fire', 'magma') ? '#7f1d1d' : '#220b1b';
    ctx.beginPath();
    ctx.ellipse(cellSize * 0.46, 0, cellSize * (0.1 + open * 0.11), cellSize * (0.08 + open * 0.22), 0, 0, TAU);
    ctx.fill();

    ctx.fillStyle = materialIs(material, 'ice', 'crystal') ? '#ecfeff' : '#fff7ed';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cellSize * 0.39, side * cellSize * (0.1 + open * 0.12));
      ctx.lineTo(cellSize * 0.51, side * cellSize * (0.07 + open * 0.07));
      ctx.lineTo(cellSize * 0.43, side * cellSize * 0.01);
      ctx.closePath();
      ctx.fill();
    }

    if (open > 0.45) {
      const tongueWave = Math.sin(time * 10) * cellSize * 0.025;
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = cellSize * 0.045;
      ctx.beginPath();
      ctx.moveTo(cellSize * 0.47, 0);
      ctx.quadraticCurveTo(cellSize * 0.7, tongueWave, cellSize * 0.82, 0);
      ctx.stroke();
      ctx.lineWidth = cellSize * 0.025;
      ctx.beginPath();
      ctx.moveTo(cellSize * 0.79, 0);
      ctx.lineTo(cellSize * 0.9, -cellSize * 0.07);
      ctx.moveTo(cellSize * 0.79, 0);
      ctx.lineTo(cellSize * 0.9, cellSize * 0.07);
      ctx.stroke();
    }
  }

  if (materialIs(material, 'ice', 'crystal', 'void', 'shadow')) {
    ctx.fillStyle = skin.visual.detailColor;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(-cellSize * 0.2, side * cellSize * 0.37);
      ctx.lineTo(-cellSize * 0.05, side * cellSize * 0.66);
      ctx.lineTo(cellSize * 0.08, side * cellSize * 0.36);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawSnakeArtwork({
  ctx,
  positions,
  cellSize,
  skin,
  direction,
  time,
  mouthOpen = 0,
  glow = true,
  bulges = [],
}: DrawSnakeArtworkOptions) {
  if (!positions.length || cellSize <= 0) return;

  const pixelPositions = positions.map(position => ({
    x: position.x * cellSize + cellSize / 2,
    y: position.y * cellSize + cellSize / 2,
  }));
  const runs = splitAtWraps(pixelPositions, cellSize);
  const enrichedRuns = runs.map((run, index) => enrich(chaikin(run), cellSize, index === runs.length - 1));
  const tailRun = enrichedRuns[enrichedRuns.length - 1];
  applyBulges(enrichedRuns, cellSize, bulges);

  if (tailRun?.length) drawTailAdornment(ctx, tailRun, skin, cellSize, time, glow);
  enrichedRuns.slice().reverse().forEach(run => drawBodyRun(ctx, run, skin, cellSize, time, glow));
  drawHead(ctx, pixelPositions[0], direction, skin, cellSize, mouthOpen, time, glow);
}
