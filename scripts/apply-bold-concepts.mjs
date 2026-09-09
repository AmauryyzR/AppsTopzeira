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
  const match = line.match(/^(\s*)(['"`])(.*)(['"`],?)$/);
  if (!match) return line;

  const [_, indent, quoteOpen, content, quoteClose] = match;

  if (content.trim().startsWith('**')) {
    return line;
  }

  let newContent = content;

  // Case 1: Term (Parenthetical): Rest
  const parenColonMatch = content.match(/^([^:(]+?)\s*(\([^)]+\))\s*:\s*(.*)$/);
  if (parenColonMatch) {
    const term = parenColonMatch[1].trim();
    const parens = parenColonMatch[2].trim();
    const rest = parenColonMatch[3];
    newContent = `**${term}** ${parens}: ${rest}`;
  } else {
    // Case 2: Term: Rest
    const colonMatch = content.match(/^([^:]+?)\s*:\s*(.*)$/);
    if (colonMatch) {
      const term = colonMatch[1].trim();
      const rest = colonMatch[2];
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

let totalUpdated = 0;

for (const filePath of files) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const lines = code.split('\n');
  let inKeyConcepts = false;
  let fileUpdated = 0;

  const newLines = lines.map((line) => {
    if (line.includes('keyConcepts: [')) {
      inKeyConcepts = true;
      return line;
    }
    if (inKeyConcepts && line.includes('],')) {
      inKeyConcepts = false;
      return line;
    }
    if (inKeyConcepts) {
      const transformed = transformKeyConcept(line);
      if (transformed !== line) {
        fileUpdated++;
        totalUpdated++;
      }
      return transformed;
    }
    return line;
  });

  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
  console.log(`Updated ${path.basename(filePath)} (${fileUpdated} concepts bolded)`);
}

console.log(`Total concepts bolded across curriculum: ${totalUpdated}`);
