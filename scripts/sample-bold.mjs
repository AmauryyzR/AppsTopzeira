import fs from 'fs';

const filePath = 'd:/IDEwork/SiteTopzeira/src/apps/enem/data/areas/matematica.ts';
const code = fs.readFileSync(filePath, 'utf-8');
const lines = code.split('\n');
let inKeyConcepts = false;
let samples = 0;

function transformKeyConcept(line) {
  const match = line.match(/^(\s*)(['"`])(.*)(['"`],?)$/);
  if (!match) return line;
  const [_, indent, quoteOpen, content, quoteClose] = match;
  if (content.trim().startsWith('**')) return line;

  let newContent = content;
  const parenColonMatch = content.match(/^([^:(]+?)\s*(\([^)]+\))\s*:\s*(.*)$/);
  if (parenColonMatch) {
    const term = parenColonMatch[1].trim();
    const parens = parenColonMatch[2].trim();
    const rest = parenColonMatch[3];
    newContent = `**${term}** ${parens}: ${rest}`;
  } else {
    const colonMatch = content.match(/^([^:]+?)\s*:\s*(.*)$/);
    if (colonMatch) {
      const term = colonMatch[1].trim();
      const rest = colonMatch[2];
      if (term.length > 0 && term.length < 80) {
        newContent = `**${term}**: ${rest}`;
      }
    }
  }
  return `${indent}${quoteOpen}${newContent}${quoteClose}`;
}

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
    if (newLine !== line && samples < 8) {
      console.log('BEFORE:', line.trim());
      console.log('AFTER: ', newLine.trim());
      console.log('---');
      samples++;
    }
  }
}
