import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexRendererProps {
  content: string;
  className?: string;
}

interface MathFormulaProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  latex,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return `<span class="text-red-500 font-mono text-xs">[Erro de LaTeX: ${latex}]</span>`;
    }
  }, [latex, displayMode]);

  if (displayMode) {
    return (
      <div
        className={`my-3 overflow-x-auto py-2 text-neutral-900 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-middle px-1 text-neutral-900 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const LatexRenderer: React.FC<LatexRendererProps> = ({ content, className = '' }) => {
  // Parse text that may contain $$ ... $$ (display) and $ ... $ (inline)
  const elements = useMemo(() => {
    if (!content) return null;

    // First split by $$ ... $$ for display blocks
    const blockRegex = /\$\$([\s\S]+?)\$\$/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(content)) !== null) {
      const textBefore = content.slice(lastIndex, match.index);
      if (textBefore) {
        parts.push(renderInlineMath(textBefore, `part-${lastIndex}`));
      }
      const formula = match[1];
      parts.push(
        <div key={`block-${match.index}`} className="my-2.5 overflow-x-auto rounded border border-neutral-200 bg-neutral-50/80 p-3 text-center">
          <MathFormula latex={formula} displayMode={true} />
        </div>
      );
      lastIndex = match.index + match[0].length;
    }

    const remainingText = content.slice(lastIndex);
    if (remainingText) {
      parts.push(renderInlineMath(remainingText, `part-${lastIndex}`));
    }

    return parts;
  }, [content]);

  return <div className={`leading-relaxed text-neutral-700 ${className}`}>{elements}</div>;
};

// Helper for inline $ ... $
function renderInlineMath(text: string, keyPrefix: string): React.ReactNode {
  const inlineRegex = /\$([^\$]+?)\$/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    const rawText = text.slice(lastIndex, match.index);
    if (rawText) {
      parts.push(<span key={`${keyPrefix}-txt-${lastIndex}`}>{rawText}</span>);
    }
    const math = match[1];
    parts.push(
      <MathFormula
        key={`${keyPrefix}-math-${match.index}`}
        latex={math}
        displayMode={false}
      />
    );
    lastIndex = match.index + match[0].length;
  }

  const remainder = text.slice(lastIndex);
  if (remainder) {
    parts.push(<span key={`${keyPrefix}-txt-end`}>{remainder}</span>);
  }

  return <React.Fragment key={keyPrefix}>{parts}</React.Fragment>;
}
