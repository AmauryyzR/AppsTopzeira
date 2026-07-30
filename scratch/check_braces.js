import fs from 'fs';

const content = fs.readFileSync('src/apps/mathrender/components/DesmosStudio.tsx', 'utf8');
const lines = content.split('\n');

let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const prevDepth = depth;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') depth++;
    if (line[j] === '}') depth--;
  }
  if (prevDepth === 0 && depth > 0) {
    console.log(`Open block at L${i + 1}: ${line.trim().slice(0, 40)}`);
  } else if (prevDepth > 0 && depth === 0) {
    console.log(`Close block at L${i + 1}`);
  }
}
console.log(`Final depth: ${depth}`);
