import { PNG } from 'pngjs';

/**
 * Analyzes a PNG buffer to detect black polygons / corrupt geometric artifacts.
 *
 * Rules from PlanMaxxing spec:
 * 1. Black pixel defined as r < 8, g < 8, b < 8, a > 250.
 * 2. Connected component algorithm (BFS / Queue).
 * 3. Fails if:
 *    - Any single black connected component occupies > 2% of total canvas area; OR
 *    - Any single black component spans > 25% of canvas width or height.
 */
export function analyzePngBuffer(pngBuffer) {
  const png = PNG.sync.read(pngBuffer);
  const width = png.width;
  const height = png.height;
  const totalPixels = width * height;

  const data = png.data;
  const isBlack = new Uint8Array(totalPixels);

  let blackPixelCount = 0;

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    // Opaque or near-opaque black pixel check
    if (r < 8 && g < 8 && b < 8 && a > 250) {
      isBlack[i] = 1;
      blackPixelCount++;
    }
  }

  const visited = new Uint8Array(totalPixels);
  let maxComponentSize = 0;
  let maxWidthSpan = 0;
  let maxHeightSpan = 0;
  let componentCount = 0;

  const queue = new Int32Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    if (isBlack[i] === 1 && visited[i] === 0) {
      componentCount++;
      let compSize = 0;
      let minX = width;
      let maxX = 0;
      let minY = height;
      let maxY = 0;

      let qHead = 0;
      let qTail = 0;

      queue[qTail++] = i;
      visited[i] = 1;

      while (qHead < qTail) {
        const curr = queue[qHead++];
        compSize++;

        const cx = curr % width;
        const cy = Math.floor(curr / width);

        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        // 4-neighborhood
        // Left
        if (cx > 0) {
          const left = curr - 1;
          if (isBlack[left] === 1 && visited[left] === 0) {
            visited[left] = 1;
            queue[qTail++] = left;
          }
        }
        // Right
        if (cx < width - 1) {
          const right = curr + 1;
          if (isBlack[right] === 1 && visited[right] === 0) {
            visited[right] = 1;
            queue[qTail++] = right;
          }
        }
        // Top
        if (cy > 0) {
          const top = curr - width;
          if (isBlack[top] === 1 && visited[top] === 0) {
            visited[top] = 1;
            queue[qTail++] = top;
          }
        }
        // Bottom
        if (cy < height - 1) {
          const bottom = curr + width;
          if (isBlack[bottom] === 1 && visited[bottom] === 0) {
            visited[bottom] = 1;
            queue[qTail++] = bottom;
          }
        }
      }

      const wSpan = (maxX - minX + 1) / width;
      const hSpan = (maxY - minY + 1) / height;

      if (compSize > maxComponentSize) {
        maxComponentSize = compSize;
      }
      if (wSpan > maxWidthSpan) {
        maxWidthSpan = wSpan;
      }
      if (hSpan > maxHeightSpan) {
        maxHeightSpan = hSpan;
      }
    }
  }

  const maxComponentRatio = maxComponentSize / totalPixels;
  const blackPixelRatio = blackPixelCount / totalPixels;

  // Failure criteria: component > 2% of area OR component spans > 25% of width/height
  const hasBlackArtifacts = maxComponentRatio > 0.02 || maxWidthSpan > 0.25 || maxHeightSpan > 0.25;

  return {
    width,
    height,
    totalPixels,
    blackPixelCount,
    blackPixelRatio,
    maxComponentSize,
    maxComponentRatio,
    maxWidthSpan,
    maxHeightSpan,
    componentCount,
    hasBlackArtifacts,
  };
}
