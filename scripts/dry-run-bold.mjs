import fs from 'fs';
import path from 'path';

const files = [
  'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/natureza/biologia.ts',
  'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/natureza/fisica.ts',
  'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/natureza/quimica.ts',
  'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/matematica.ts',
  'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/humanas/historia.ts',
  'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/humanas/geografia.ts',
  'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/humanas/filosofia.ts',
  'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/humanas/sociologia.ts',
  'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/linguagens.ts',
];

function transformKeyConcept(line) {
  // Line format: '...concept text...',
  // Match single quotes or double quotes or backticks inside keyConcepts
  const match = line.match(/^(\s*)(['"`])(.*)(['"`],?)$/);
  if (!match) return line;

  const [_, indent, quoteOpen, content, quoteClose] = match;

  // If already bolded at the start, skip
  if (content.trim().startsWith('**')) {
    return line;
  }

  let newContent = content;

  // Case 1: Term (Parenthetical): Rest
  // e.g., Briófitas (Musgos e Hepáticas): ... -> **Briófitas** (Musgos e Hepáticas): ...
  const parenColonMatch = content.match(/^([^:(]+?)\s*(\([^)]+\))\s*:\s*(.*)$/);
  if (parenColonMatch) {
    const term = parenColonMatch[1].trim();
    const parens = parenColonMatch[2].trim();
    const rest = parenColonMatch[3];
    newContent = `**${term}** ${parens}: ${rest}`;
  } else {
    // Case 2: Term: Rest (no parens before colon)
    // e.g., Equação de Torricelli: Ferramenta... -> **Equação de Torricelli**: Ferramenta...
    const colonMatch = content.match(/^([^:]+?)\s*:\s*(.*)$/);
    if (colonMatch) {
      const term = colonMatch[1].trim();
      const rest = colonMatch[2];
      // Only if term is reasonable length (not a whole paragraph)
      if (term.length > 0 && term.length < 80) {
        newContent = `**${term}**: ${rest}`;
      }
    }
  }

  if (newContent !== content) {
    return `${indent}${quoteOpen}${newContent}${quoteClose}`;
  }
  return line;
}

let totalTransformed = 0;

for (const filePath of files) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const lines = code.split('\n');
  let inKeyConcepts = false;
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('keyConcepts: [')) {
      inKeyConcepts = true;
      continue;
    }
    if (inKeyConcepts && line.includes('],')) {
      inKeyConcepts = false;
      continue;
    }
    if (inKeyConcepts) {
      const newLine = transformKeyConcept(line);
      if (newLine !== line) {
        count++;
        totalTransformed++;
      }
    }
  }
  console.log(`${path.basename(filePath)}: ${count} concepts to transform`);
}

console.log(`Total concepts to bold: ${totalTransformed}`);
