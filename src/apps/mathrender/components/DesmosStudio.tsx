import React, { useState, useEffect, useRef } from 'react';
import { Play, Code, Sparkles, Sliders, RefreshCw, ZoomIn, ZoomOut, Sun, Moon, Keyboard, MousePointer, Activity, Palette, Clock, Settings } from 'lucide-react';

interface DesmosStudioProps {
  onSendToManim: (code: string) => void;
}

export interface ParsedMath {
  jsExpr: string;
  pyExpr: string;
  rawInput: string;
  isValid: boolean;
  error?: string;
}

// Modal popup component for scale min/max customization via [ C ] button
interface CustomScaleModalProps {
  label: string;
  currentMin: number;
  currentMax: number;
  onConfirm: (newMin: number, newMax: number) => void;
  onClose: () => void;
}

const CustomScaleModal: React.FC<CustomScaleModalProps> = ({ label, currentMin, currentMax, onConfirm, onClose }) => {
  const [minStr, setMinStr] = useState<string>(currentMin.toString());
  const [maxStr, setMaxStr] = useState<string>(currentMax.toString());
  const [centerStr, setCenterStr] = useState<string>(((currentMin + currentMax) / 2).toString());
  const [errorMsg, setErrorMsg] = useState<string>('');

  const formatModalScaleValue = (val: number): string => {
    if (isNaN(val)) return '--';
    const absVal = Math.abs(val);
    if (absVal === 0) return '0';
    if (absVal < 0.01 || absVal >= 100000) {
      return val.toExponential(4);
    }
    return Number(val.toPrecision(6)).toString();
  };

  // When min or max is edited directly, sync centerStr
  const handleMinChange = (val: string) => {
    setMinStr(val);
    setErrorMsg('');
    const minVal = parseFloat(val);
    const maxVal = parseFloat(maxStr);
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      setCenterStr(((minVal + maxVal) / 2).toString());
    }
  };

  const handleMaxChange = (val: string) => {
    setMaxStr(val);
    setErrorMsg('');
    const minVal = parseFloat(minStr);
    const maxVal = parseFloat(val);
    if (!isNaN(minVal) && !isNaN(maxVal)) {
      setCenterStr(((minVal + maxVal) / 2).toString());
    }
  };

  // When center is edited, shift min and max maintaining amplitude (span)
  const handleCenterChange = (val: string) => {
    setCenterStr(val);
    setErrorMsg('');
    const newCenter = parseFloat(val);
    const minVal = parseFloat(minStr);
    const maxVal = parseFloat(maxStr);

    if (!isNaN(newCenter) && !isNaN(minVal) && !isNaN(maxVal) && minVal < maxVal) {
      const halfSpan = (maxVal - minVal) / 2;
      const newMin = newCenter - halfSpan;
      const newMax = newCenter + halfSpan;
      setMinStr(newMin.toString());
      setMaxStr(newMax.toString());
    }
  };

  const applyPreset = (presetMin: number, presetMax: number) => {
    setMinStr(presetMin.toString());
    setMaxStr(presetMax.toString());
    setCenterStr(((presetMin + presetMax) / 2).toString());
    setErrorMsg('');
  };

  const handleApply = () => {
    const minVal = parseFloat(minStr);
    const maxVal = parseFloat(maxStr);

    if (isNaN(minVal) || isNaN(maxVal)) {
      setErrorMsg('Por favor digite valores numéricos válidos.');
      return;
    }

    if (minVal >= maxVal) {
      setErrorMsg('O limite inferior (mínimo) deve ser menor que o limite superior (máximo).');
      return;
    }

    onConfirm(minVal, maxVal);
    onClose();
  };

  const minNum = parseFloat(minStr);
  const maxNum = parseFloat(maxStr);
  const centerNum = parseFloat(centerStr);
  const spanPreview = !isNaN(minNum) && !isNaN(maxNum) && minNum < maxNum
    ? formatModalScaleValue(maxNum - minNum)
    : '--';

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl w-full max-w-sm flex flex-col gap-4 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 font-mono text-xs flex items-center justify-center font-extrabold border border-sky-500/30">
              C
            </span>
            Customização da Escala: {label}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold p-1">✕</button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Ajuste o <strong className="text-sky-300">centro da escala</strong> ou altere os limites. Ao mudar o centro, os limites se deslocam automaticamente mantendo a amplitude ({spanPreview}).
        </p>

        {errorMsg && (
          <div className="text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40 font-mono">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Dynamic Center of Scale Input */}
        <div className="flex flex-col gap-1.5 bg-sky-950/30 p-3 rounded-xl border border-sky-800/40">
          <label className="text-[11px] font-bold text-sky-300 uppercase flex items-center justify-between">
            <span>Centro da Escala (Ponto Médio):</span>
            <span className="text-[10px] text-slate-400 font-normal normal-case">Desloca Limites</span>
          </label>
          <input
            type="number"
            step="any"
            value={centerStr}
            onChange={(e) => handleCenterChange(e.target.value)}
            className="w-full bg-slate-950 border border-sky-600/60 text-sky-300 font-mono text-sm p-2.5 rounded-xl focus:outline-none focus:border-sky-400 font-bold"
            placeholder="Digite o novo centro..."
          />
        </div>

        {/* Min and Max Limits */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-300 uppercase">Limite Inferior (Mínimo):</label>
            <input
              type="number"
              step="any"
              value={minStr}
              onChange={(e) => handleMinChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono text-sm p-2.5 rounded-xl focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-300 uppercase">Limite Superior (Máximo):</label>
            <input
              type="number"
              step="any"
              value={maxStr}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-mono text-sm p-2.5 rounded-xl focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
          <span>Amplitude da Escala (Span):</span>
          <span className="text-sky-400 font-bold">{spanPreview}</span>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => applyPreset(-10, 10)} className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700">
            [-10, +10]
          </button>
          <button onClick={() => applyPreset(-1, 1)} className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700">
            [-1, +1]
          </button>
          <button onClick={() => applyPreset(-0.001, 0.001)} className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700">
            [-0.001, +0.001]
          </button>
          <button onClick={() => applyPreset(0, 100)} className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700">
            [0, 100]
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2.5 rounded-xl border border-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-sky-500/20"
          >
            Aplicar Escala
          </button>
        </div>
      </div>
    </div>
  );
};

// Smart Math Expression Parser (supports sin, sen, 2x, x^2, tg, ln, sqrt, etc.)
export function parseMathExpression(rawInput: string, aVal: number, bVal: number): ParsedMath {
  if (!rawInput || !rawInput.trim()) {
    return { jsExpr: '0', pyExpr: '0', rawInput: '0', isValid: true };
  }

  let expr = rawInput.trim();

  // 1. Convert Portuguese & shortcut math notation
  let js = expr
    .replace(/sen⁻¹/g, 'asin')
    .replace(/cos⁻¹/g, 'acos')
    .replace(/tg⁻¹/g, 'atan')
    .replace(/sen/g, 'sin')
    .replace(/tg/g, 'tan')
    .replace(/√/g, 'sqrt')
    .replace(/π/g, 'pi')
    .replace(/÷/g, '/')
    .replace(/×/g, '*');

  // 2. Implicit multiplication (e.g. 2x -> 2*x, 3sin -> 3*sin, (x+1)(x-1) -> (x+1)*(x-1))
  js = js.replace(/(\d)\s*([a-zA-Z\(π√])/g, '$1*$2');
  js = js.replace(/(\))\s*([\w\(])/g, '$1*$2');
  js = js.replace(/\b(x|a|b)\s*(sin|cos|tan|asin|acos|atan|sqrt|log|exp|abs)\b/g, '$1*$2');

  // 3. Exponents x^y -> Math.pow(x, y)
  js = js.replace(/([\w\.\)]+)\s*\^\s*([\w\.\)]+)/g, 'Math.pow($1, $2)');

  // 4. Map math functions for JavaScript evaluation
  const mathFns = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'log', 'log10', 'exp', 'abs'];
  for (const fn of mathFns) {
    const reg = new RegExp(`\\b${fn}\\b`, 'g');
    js = js.replace(reg, `Math.${fn}`);
  }
  js = js.replace(/\bpi\b/g, 'Math.PI');
  js = js.replace(/\be\b/g, 'Math.E');

  // Replace parameter values a and b for JS rendering
  js = js.replace(/\ba\b/g, `(${aVal})`).replace(/\bb\b/g, `(${bVal})`);

  // 5. Build Python / NumPy expression
  let py = expr
    .replace(/sen⁻¹/g, 'arcsin')
    .replace(/cos⁻¹/g, 'arccos')
    .replace(/tg⁻¹/g, 'arctan')
    .replace(/sen/g, 'sin')
    .replace(/tg/g, 'tan')
    .replace(/√/g, 'sqrt')
    .replace(/π/g, 'pi')
    .replace(/÷/g, '/')
    .replace(/×/g, '*');

  py = py.replace(/(\d)\s*([a-zA-Z\(π√])/g, '$1*$2');
  py = py.replace(/(\))\s*([\w\(])/g, '$1*$2');
  py = py.replace(/\b(x|a|b)\s*(sin|cos|tan|arcsin|arccos|arctan|sqrt|log|exp|abs)\b/g, '$1*$2');
  py = py.replace(/\^/g, '**');

  for (const fn of mathFns) {
    const pyFn = fn === 'asin' ? 'arcsin' : fn === 'acos' ? 'arccos' : fn === 'atan' ? 'arctan' : fn;
    const reg = new RegExp(`\\b${fn}\\b`, 'g');
    py = py.replace(reg, `np.${pyFn}`);
  }
  py = py.replace(/\bpi\b/g, 'np.pi');
  py = py.replace(/\be\b/g, 'np.e');

  // Replace parameters in Python code
  py = py.replace(/\ba\b/g, `(${aVal})`).replace(/\bb\b/g, `(${bVal})`);

  // Validate evaluation in JS
  try {
    const testFn = new Function('x', `return ${js};`);
    const val = testFn(1.0);
    const isValid = typeof val === 'number' && !isNaN(val);
    return {
      jsExpr: js,
      pyExpr: py,
      rawInput,
      isValid,
    };
  } catch (err: any) {
    return {
      jsExpr: js,
      pyExpr: py,
      rawInput,
      isValid: false,
      error: err.message,
    };
  }
}

export const DesmosStudio: React.FC<DesmosStudioProps> = ({ onSendToManim }) => {
  const [funcStr, setFuncStr] = useState<string>('sin(x) * cos(x / 2)');
  
  // Dynamic Ranges & Values for Parameters a, b, Tangent, Integral, and Animation Time
  const [paramARange, setParamARange] = useState<[number, number]>([-5, 5]);
  const [paramA, setParamA] = useState<number>(0); // Default centered

  const [paramBRange, setParamBRange] = useState<[number, number]>([-5, 5]);
  const [paramB, setParamB] = useState<number>(0); // Default centered

  const [tangentXRange, setTangentXRange] = useState<[number, number]>([-5, 5]);
  const [tangentX, setTangentX] = useState<number>(0);
  const [showTangent, setShowTangent] = useState<boolean>(true);

  const [showIntegral, setShowIntegral] = useState<boolean>(false);
  const [integralStartRange, setIntegralStartRange] = useState<[number, number]>([-5, 5]);
  const [integralStart, setIntegralStart] = useState<number>(-2.0);

  const [integralEndRange, setIntegralEndRange] = useState<[number, number]>([-5, 5]);
  const [integralEnd, setIntegralEnd] = useState<number>(2.0);

  const [animRunTimeRange, setAnimRunTimeRange] = useState<[number, number]>([1, 10]);
  const [animRunTime, setAnimRunTime] = useState<number>(5.5);

  const [animMode, setAnimMode] = useState<'sequential' | 'riemann' | 'parametric' | 'tangent'>('sequential');
  const [animColor, setAnimColor] = useState<string>('TEAL');

  // Scale Customization Modal State [ C ]
  const [scaleModal, setScaleModal] = useState<{
    label: string;
    currentMin: number;
    currentMax: number;
    onConfirm: (newMin: number, newMax: number) => void;
  } | null>(null);

  // GeoGebra Canvas view bounds state
  const [xCenter, setXCenter] = useState<number>(0);
  const [yCenter, setYCenter] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [themeMode, setThemeMode] = useState<'geogebra-light' | 'geogebra-dark'>('geogebra-light');

  // Virtual Keypad state
  const [showKeypad, setShowKeypad] = useState<boolean>(true);
  const [keypadTab, setKeypadTab] = useState<'123' | 'fx' | 'ABC' | 'symbols'>('123');

  // Dragging / Pan state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({ width: 960, height: 520 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ResizeObserver to automatically expand canvas 100% border-to-border (removes dark side margins)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setCanvasDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(container);

    return () => ro.disconnect();
  }, []);

  // Compute calculated bounds based on dynamic canvas aspect ratio (1:1 square grid units)
  const aspect = canvasDimensions.width / (canvasDimensions.height || 1);
  const ySpan = 6 / zoomScale;
  const xSpan = ySpan * aspect;
  const xMin = xCenter - xSpan / 2;
  const xMax = xCenter + xSpan / 2;
  const yMin = yCenter - ySpan / 2;
  const yMax = yCenter + ySpan / 2;

  // Helper to format values dynamically for small/large ranges
  const formatParamValue = (val: number): string => {
    if (isNaN(val)) return '0';
    const absVal = Math.abs(val);
    if (absVal === 0) return '0';
    if (absVal < 0.01 || absVal >= 10000) {
      return val.toExponential(3);
    }
    return Number(val.toPrecision(5)).toString();
  };

  // Helper to format grid axis ticks with dynamic precision at ANY zoom level (fixes 0 repeated bug on close zoom)
  const formatAxisTickLabel = (val: number, step: number): string => {
    if (Math.abs(val) < step * 0.0001) return '0';

    const stepLog = Math.log10(step);
    if (stepLog < 0) {
      const decimals = Math.min(Math.ceil(Math.abs(stepLog)) + 1, 10);
      return Number(val.toFixed(decimals)).toString();
    } else if (stepLog >= 5 || Math.abs(val) >= 100000) {
      return val.toExponential(2);
    } else {
      return Number(val.toFixed(2)).toString();
    }
  };

  // Helper to apply new scale range and center parameter value
  const applyNewScale = (
    newMin: number,
    newMax: number,
    setRange: (r: [number, number]) => void,
    setValue: (v: number) => void
  ) => {
    setRange([newMin, newMax]);
    const center = (newMin + newMax) / 2;
    setValue(center);
  };

  // Parsed Math expression
  const parsed = parseMathExpression(funcStr, paramA, paramB);

  // Evaluate math function safely
  const evaluateFunc = (x: number): number => {
    if (!parsed.isValid) return 0;
    try {
      const fn = new Function('x', `return ${parsed.jsExpr};`);
      const val = fn(x);
      return isNaN(val) || !isFinite(val) ? 0 : val;
    } catch {
      return 0;
    }
  };

  // Numerical Derivative (Adaptive step size for high precision at any zoom level)
  const evaluateDerivative = (x: number): number => {
    const h = Math.max(Math.abs(x) * 1e-7, 1e-8);
    return (evaluateFunc(x + h) - evaluateFunc(x - h)) / (2 * h);
  };

  // Compute Real-time Definite Integral (Simpson's Rule)
  const computeIntegralValue = (): number => {
    if (!parsed.isValid) return 0;
    const start = Math.min(integralStart, integralEnd);
    const end = Math.max(integralStart, integralEnd);
    const steps = 200;
    const dx = (end - start) / steps;
    let sum = 0;

    for (let i = 0; i < steps; i++) {
      const xi = start + (i + 0.5) * dx;
      sum += evaluateFunc(xi);
    }
    const result = sum * dx;
    return isNaN(result) || !isFinite(result) ? 0 : (integralStart > integralEnd ? -result : result);
  };

  // ATTACH NATIVE WHEEL LISTENER TO CANVAS ({ passive: false })
  // Fixes: Prevents browser page scrolling when wheeling inside canvas & allows infinite zoom!
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      setZoomScale((prev) => prev * zoomFactor); // Infinite unlimited zoom!
    };

    canvas.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const isLight = themeMode === 'geogebra-light';

    // Theme Colors
    const bgColor = isLight ? '#ffffff' : '#0f172a';
    const gridMajorColor = isLight ? '#cbd5e1' : '#1e293b';
    const gridMinorColor = isLight ? '#f1f5f9' : '#0f172a';
    const axisColor = isLight ? '#334155' : '#64748b';
    const textColor = isLight ? '#475569' : '#94a3b8';
    const curveColor = isLight ? '#2563eb' : '#38bdf8';
    const tangentColor = isLight ? '#dc2626' : '#f43f5e';

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Map math coords to screen coords
    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    // Grid step calculation
    const xStep = Math.pow(10, Math.floor(Math.log10(xSpan / 5)));
    const yStep = Math.pow(10, Math.floor(Math.log10(ySpan / 5)));

    // Minor Gridlines
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = gridMinorColor;

    const startXMinor = Math.floor(xMin / (xStep / 5)) * (xStep / 5);
    for (let x = startXMinor, count = 0; x <= xMax && count < 150; x += xStep / 5, count++) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }

    const startYMinor = Math.floor(yMin / (yStep / 5)) * (yStep / 5);
    for (let y = startYMinor, count = 0; y <= yMax && count < 150; y += yStep / 5, count++) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }

    // Major Gridlines & Dynamic Precision Labels
    ctx.lineWidth = 1;
    ctx.strokeStyle = gridMajorColor;
    ctx.fillStyle = textColor;
    ctx.font = '11px Inter, sans-serif';

    const startXMajor = Math.floor(xMin / xStep) * xStep;
    for (let x = startXMajor, count = 0; x <= xMax + xStep * 0.1 && count < 100; x += xStep, count++) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      const label = formatAxisTickLabel(x, xStep);
      if (Math.abs(x) >= xStep * 0.0001) {
        ctx.fillText(label, sx + 3, Math.min(Math.max(toScreenY(0) + 14, 14), height - 6));
      }
    }

    const startYMajor = Math.floor(yMin / yStep) * yStep;
    for (let y = startYMajor, count = 0; y <= yMax + yStep * 0.1 && count < 100; y += yStep, count++) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      const label = formatAxisTickLabel(y, yStep);
      if (Math.abs(y) >= yStep * 0.0001) {
        ctx.fillText(label, Math.min(Math.max(toScreenX(0) + 4, 4), width - 30), sy - 4);
      }
    }

    // Main Axes with Arrow Tips (GeoGebra style)
    ctx.lineWidth = 2;
    ctx.strokeStyle = axisColor;

    // X Axis
    const originY = toScreenY(0);
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // X Arrow
    ctx.beginPath();
    ctx.moveTo(width - 8, originY - 4);
    ctx.lineTo(width, originY);
    ctx.lineTo(width - 8, originY + 4);
    ctx.stroke();

    // Y Axis
    const originX = toScreenX(0);
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Y Arrow
    ctx.beginPath();
    ctx.moveTo(originX - 4, 8);
    ctx.lineTo(originX, 0);
    ctx.lineTo(originX + 4, 8);
    ctx.stroke();

    // Draw Definite Integral Area between [integralStart, integralEnd]
    if (showIntegral && parsed.isValid) {
      const iStart = Math.min(integralStart, integralEnd);
      const iEnd = Math.max(integralStart, integralEnd);

      ctx.fillStyle = isLight ? 'rgba(37, 99, 235, 0.25)' : 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.moveTo(toScreenX(iStart), toScreenY(0));
      const steps = 150;
      for (let i = 0; i <= steps; i++) {
        const x = iStart + (i / steps) * (iEnd - iStart);
        const y = evaluateFunc(x);
        ctx.lineTo(toScreenX(x), toScreenY(y));
      }
      ctx.lineTo(toScreenX(iEnd), toScreenY(0));
      ctx.closePath();
      ctx.fill();

      // Boundary vertical dashed lines
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isLight ? '#2563eb' : '#38bdf8';
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(toScreenX(iStart), toScreenY(0));
      ctx.lineTo(toScreenX(iStart), toScreenY(evaluateFunc(iStart)));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toScreenX(iEnd), toScreenY(0));
      ctx.lineTo(toScreenX(iEnd), toScreenY(evaluateFunc(iEnd)));
      ctx.stroke();

      ctx.setLineDash([]);
    }

    // Draw Main Function Curve
    if (parsed.isValid) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = curveColor;
      ctx.beginPath();

      let started = false;
      const numPoints = 800;
      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + (i / numPoints) * (xMax - xMin);
        const y = evaluateFunc(x);
        const sx = toScreenX(x);
        const sy = toScreenY(y);

        if (sy >= -200 && sy <= height + 200) {
          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // Draw Tangent Line & Dot if enabled
    if (showTangent && parsed.isValid) {
      const y0 = evaluateFunc(tangentX);
      const slope = evaluateDerivative(tangentX);

      // Calculate infinite tangent line across the current viewport span
      const spanX = xMax - xMin;
      const tanX1 = xMin - spanX;
      const tanX2 = xMax + spanX;
      const tanY1 = slope * (tanX1 - tangentX) + y0;
      const tanY2 = slope * (tanX2 - tangentX) + y0;

      ctx.lineWidth = 2;
      ctx.strokeStyle = tangentColor;
      ctx.beginPath();
      ctx.moveTo(toScreenX(tanX1), toScreenY(tanY1));
      ctx.lineTo(toScreenX(tanX2), toScreenY(tanY2));
      ctx.stroke();

      // Tangent Point Dot
      ctx.fillStyle = tangentColor;
      ctx.beginPath();
      ctx.arc(toScreenX(tangentX), toScreenY(y0), 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [funcStr, paramA, paramB, tangentX, showTangent, showIntegral, integralStart, integralEnd, xMin, xMax, yMin, yMax, themeMode, parsed.isValid, parsed.jsExpr]);

  // Mouse Panning & Mouse Position Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const mathX = xMin + (mouseX / canvas.width) * (xMax - xMin);
    const mathY = yMax - (mouseY / canvas.height) * (yMax - yMin);
    setHoverCoords({ x: mathX, y: mathY });

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setDragStart({ x: e.clientX, y: e.clientY });

      const mathDx = (dx / canvas.width) * (xMax - xMin);
      const mathDy = (dy / canvas.height) * (yMax - yMin);

      setXCenter((prev) => prev - mathDx);
      setYCenter((prev) => prev + mathDy);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setXCenter(0);
    setYCenter(0);
    setZoomScale(1.0);
  };

  // Virtual Keypad Insert Handler
  const insertKey = (text: string) => {
    if (text === 'BACKSPACE') {
      setFuncStr((prev) => prev.slice(0, -1));
    } else if (text === 'CLEAR') {
      setFuncStr('');
    } else {
      setFuncStr((prev) => prev + text);
    }
    inputRef.current?.focus();
  };

  // Generate Advanced Manim Python Code (Coherently updated in real-time with full GeoGebra Grid)
  const generateManimCode = (): string => {
    const pyExpr = parsed.pyExpr;
    const cleanLabel = funcStr.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const integralValStr = formatParamValue(computeIntegralValue());

    const formattedXMin = formatParamValue(xMin);
    const formattedXMax = formatParamValue(xMax);
    const formattedYMin = formatParamValue(yMin);
    const formattedYMax = formatParamValue(yMax);

    const xStepManim = formatParamValue(Math.pow(10, Math.floor(Math.log10(xSpan / 5))));
    const yStepManim = formatParamValue(Math.pow(10, Math.floor(Math.log10(ySpan / 5))));

    let animationBlock = '';

    if (animMode === 'riemann') {
      const stepWidth = formatParamValue(Math.abs(integralEnd - integralStart) / 10);
      animationBlock = `        # 3. Animação de Integral e Retângulos de Riemann
        area = axes.get_area(graph, x_range=[${formatParamValue(integralStart)}, ${formatParamValue(integralEnd)}], color=${animColor}, opacity=0.3)
        riemann = axes.get_riemann_rectangles(graph, x_range=[${formatParamValue(integralStart)}, ${formatParamValue(integralEnd)}], dx=${stepWidth}, stroke_width=0.5, color=BLUE_B)
        
        area_label = MathTex(r"\\int_{${formatParamValue(integralStart)}}^{${formatParamValue(integralEnd)}} f(x) dx \\approx ${integralValStr}", font_size=26, color=${animColor})
        area_label.to_corner(UR)

        self.play(Create(area), Write(area_label), run_time=1.5)
        self.play(Create(riemann), run_time=${formatParamValue(animRunTime)})
        self.wait(1)`;
    } else if (animMode === 'parametric') {
      animationBlock = `        # 3. Animação Paramétrica do Parâmetro a
        a_tracker = ValueTracker(${formatParamValue(paramA)})
        
        a_label = always_redraw(lambda: Text(f"a = {a_tracker.get_value():.3f}", font_size=22, color=${animColor}).to_corner(UR))

        self.play(Write(a_label))
        self.play(a_tracker.animate.set_value(${formatParamValue(paramA * 2 + 1)}), run_time=${formatParamValue(animRunTime)}, rate_func=there_and_back)
        self.wait(1)`;
    } else if (animMode === 'tangent' || (animMode === 'sequential' && showTangent && !showIntegral)) {
      animationBlock = `        # 3. Animação do Ponto e Reta Tangente Móvel
        t_param = ValueTracker(${formatParamValue(tangentX)})
        
        dot = always_redraw(lambda: Dot(
            axes.c2p(t_param.get_value(), func(t_param.get_value())),
            color=RED,
            radius=0.1
        ))

        def get_tangent():
            x0 = t_param.get_value()
            y0 = func(x0)
            h = max(abs(x0) * 1e-7, 1e-8)
            slope = (func(x0 + h) - func(x0 - h)) / (2 * h)
            span_x = ${formatParamValue(xSpan)}
            p1 = axes.c2p(x0 - span_x, y0 - slope * span_x)
            p2 = axes.c2p(x0 + span_x, y0 + slope * span_x)
            return Line(p1, p2, color=RED_A, stroke_width=3)

        tangent_line = always_redraw(get_tangent)

        point_label = always_redraw(lambda: Text(
            f"x0 = {t_param.get_value():.3f}",
            font_size=22,
            color=RED
        ).to_corner(UR))

        self.play(Create(dot), Create(tangent_line), Write(point_label))
        self.play(t_param.animate.set_value(${formattedXMax}), run_time=${formatParamValue(animRunTime)}, rate_func=there_and_back)
        self.wait(1)`;
    } else {
      // Sequential Mode with Integral and/or Tangent
      animationBlock = `        # 3. Animações Adicionais Selecionadas
${showIntegral ? `        # Preenchimento da Área da Integral Definida
        area = axes.get_area(graph, x_range=[${formatParamValue(integralStart)}, ${formatParamValue(integralEnd)}], color=${animColor}, opacity=0.3)
        area_label = MathTex(r"\\int_{${formatParamValue(integralStart)}}^{${formatParamValue(integralEnd)}} f(x) dx \\approx ${integralValStr}", font_size=26, color=${animColor})
        area_label.to_corner(UR)
        self.play(Create(area), Write(area_label), run_time=2)` : ''}

${showTangent ? `        # Reta Tangente no Ponto x0
        t_param = ValueTracker(${formatParamValue(tangentX)})
        dot = always_redraw(lambda: Dot(axes.c2p(t_param.get_value(), func(t_param.get_value())), color=RED, radius=0.1))
        def get_tangent():
            x0 = t_param.get_value()
            y0 = func(x0)
            h = max(abs(x0) * 1e-7, 1e-8)
            slope = (func(x0 + h) - func(x0 - h)) / (2 * h)
            span_x = ${formatParamValue(xSpan)}
            p1 = axes.c2p(x0 - span_x, y0 - slope * span_x)
            p2 = axes.c2p(x0 + span_x, y0 + slope * span_x)
            return Line(p1, p2, color=RED_A, stroke_width=3)
        tangent_line = always_redraw(get_tangent)
        point_label = always_redraw(lambda: Text(f"x0 = {t_param.get_value():.3f}", font_size=22, color=RED).to_corner(UR))
        self.play(Create(dot), Create(tangent_line), Write(point_label))
        self.play(t_param.animate.set_value(${formattedXMax}), run_time=${formatParamValue(animRunTime)}, rate_func=there_and_back)` : ''}
        self.wait(1)`;
    }

    return `from manim import *
import numpy as np

class GeoGebraGraphScene(Scene):
    def construct(self):
        # 1. Plano Cartesiano e Grade Estilo GeoGebra (NumberPlane)
        axes = NumberPlane(
            x_range=[${formattedXMin}, ${formattedXMax}, ${xStepManim}],
            y_range=[${formattedYMin}, ${formattedYMax}, ${yStepManim}],
            x_length=10,
            y_length=6,
            background_line_style={
                "stroke_color": BLUE_D,
                "stroke_width": 1,
                "stroke_opacity": 0.45
            },
            axis_config={
                "color": BLUE_B,
                "include_numbers": True,
                "stroke_width": 2
            }
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="y")

        # 2. Definição e Animação da Função f(x)
        func = lambda x: ${pyExpr}
        graph = axes.plot(func, color=${animColor}, x_range=[${formattedXMin}, ${formattedXMax}])
        
        graph_label = Text("f(x) = ${cleanLabel}", font_size=24, color=${animColor})
        graph_label.to_corner(UL)

        # Animar Plano Cartesiano e Curva da Função
        self.play(Create(axes), Write(axes_labels), run_time=1.5)
        self.play(Create(graph), Write(graph_label), run_time=1.5)
        self.wait(0.5)

${animationBlock}
`;
  };

  const handleSendToStudio = () => {
    const code = generateManimCode();
    onSendToManim(code);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[calc(100vh-5rem)] relative">
      {/* Render Custom Scale Range Modal [ C ] if active */}
      {scaleModal && (
        <CustomScaleModal
          label={scaleModal.label}
          currentMin={scaleModal.currentMin}
          currentMax={scaleModal.currentMax}
          onConfirm={scaleModal.onConfirm}
          onClose={() => setScaleModal(null)}
        />
      )}

      {/* Left GeoGebra Sidebar Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center font-bold text-sky-400 text-base font-serif">
              gG
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">GeoGebra Studio 2D</h2>
          </div>

          <button
            onClick={() => setThemeMode(themeMode === 'geogebra-light' ? 'geogebra-dark' : 'geogebra-light')}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all text-xs flex items-center gap-1.5 border border-slate-700"
            title="Alternar Tema do Canvas GeoGebra"
          >
            {themeMode === 'geogebra-light' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-sky-400" />}
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Crie e manipule funções no estilo GeoGebra com teclado matemático virtual, sliders e zoom interativo.
        </p>

        {/* Function Input Field */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Função Entrada f(x)
            </label>
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className={`text-xs px-2 py-0.5 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
                showKeypad
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              Teclado Virtual
            </button>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-3 text-sky-400 font-bold font-mono text-sm">f(x) =</span>
            <input
              ref={inputRef}
              type="text"
              value={funcStr}
              onChange={(e) => setFuncStr(e.target.value)}
              className={`w-full bg-slate-950 border font-mono text-sm pl-16 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                parsed.isValid
                  ? 'border-slate-700 text-sky-300 focus:border-sky-500 focus:ring-sky-500/20'
                  : 'border-rose-500 text-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              }`}
              placeholder="ex: sin(x) * cos(x / 2)"
            />
          </div>

          {!parsed.isValid && (
            <p className="text-[11px] text-rose-400 font-mono mt-0.5">
              ⚠️ Expressão inválida: {parsed.error || 'Verifique parênteses ou sintaxe.'}
            </p>
          )}

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            <button
              onClick={() => setFuncStr('sin(x) * cos(x / 2)')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
            >
              sin(x)*cos(x/2)
            </button>
            <button
              onClick={() => setFuncStr('a * x^3 - b * x')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
            >
              Polinômio (x³)
            </button>
            <button
              onClick={() => setFuncStr('exp(-x^2 / a)')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
            >
              Gaussiana
            </button>
            <button
              onClick={() => setFuncStr('tg(x)')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
            >
              Tangente tg(x)
            </button>
          </div>
        </div>

        {/* Explicit Sliders for Parameters a & b + Scale Customization [ C ] */}
        <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sky-400" /> Parâmetros da Função (a & b)
            </span>
          </div>

          {/* Parameter a */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Parâmetro <strong className="text-sky-400 font-mono">a</strong> (Amplitude):</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sky-400 font-bold">{formatParamValue(paramA)}</span>
                <button
                  onClick={() => setScaleModal({
                    label: 'Parâmetro a',
                    currentMin: paramARange[0],
                    currentMax: paramARange[1],
                    onConfirm: (min, max) => applyNewScale(min, max, setParamARange, setParamA)
                  })}
                  className="w-5 h-5 rounded bg-slate-800 hover:bg-sky-500 hover:text-white text-sky-400 font-mono font-extrabold text-[10px] flex items-center justify-center border border-slate-700 transition-all shadow-sm cursor-pointer"
                  title="Customizar Limites da Escala de a [C]"
                >
                  C
                </button>
              </div>
            </div>
            <input
              type="range"
              min={paramARange[0]}
              max={paramARange[1]}
              step="any"
              value={paramA}
              onChange={(e) => setParamA(parseFloat(e.target.value))}
              className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>min: {formatParamValue(paramARange[0])}</span>
              <span>max: {formatParamValue(paramARange[1])}</span>
            </div>
          </div>

          {/* Parameter b */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Parâmetro <strong className="text-sky-400 font-mono">b</strong> (Frequência):</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sky-400 font-bold">{formatParamValue(paramB)}</span>
                <button
                  onClick={() => setScaleModal({
                    label: 'Parâmetro b',
                    currentMin: paramBRange[0],
                    currentMax: paramBRange[1],
                    onConfirm: (min, max) => applyNewScale(min, max, setParamBRange, setParamB)
                  })}
                  className="w-5 h-5 rounded bg-slate-800 hover:bg-sky-500 hover:text-white text-sky-400 font-mono font-extrabold text-[10px] flex items-center justify-center border border-slate-700 transition-all shadow-sm cursor-pointer"
                  title="Customizar Limites da Escala de b [C]"
                >
                  C
                </button>
              </div>
            </div>
            <input
              type="range"
              min={paramBRange[0]}
              max={paramBRange[1]}
              step="any"
              value={paramB}
              onChange={(e) => setParamB(parseFloat(e.target.value))}
              className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>min: {formatParamValue(paramBRange[0])}</span>
              <span>max: {formatParamValue(paramBRange[1])}</span>
            </div>
          </div>

          {/* Tangent Point x0 */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Ponto Tangente (<strong className="text-rose-400 font-mono">x₀</strong>):</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-rose-400 font-bold">{formatParamValue(tangentX)}</span>
                <button
                  onClick={() => setScaleModal({
                    label: 'Ponto Tangente (x₀)',
                    currentMin: tangentXRange[0],
                    currentMax: tangentXRange[1],
                    onConfirm: (min, max) => applyNewScale(min, max, setTangentXRange, setTangentX)
                  })}
                  className="w-5 h-5 rounded bg-slate-800 hover:bg-rose-500 hover:text-white text-rose-400 font-mono font-extrabold text-[10px] flex items-center justify-center border border-slate-700 transition-all shadow-sm cursor-pointer"
                  title="Customizar Limites da Escala de x₀ [C]"
                >
                  C
                </button>
              </div>
            </div>
            <input
              type="range"
              min={tangentXRange[0]}
              max={tangentXRange[1]}
              step="any"
              value={tangentX}
              onChange={(e) => setTangentX(parseFloat(e.target.value))}
              className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>min: {formatParamValue(tangentXRange[0])}</span>
              <span>max: {formatParamValue(tangentXRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Definite Integral Interval Controls [x1, x2] + Scale Customization [ C ] */}
        <div className="flex flex-col gap-3 border-t border-slate-800 pt-4">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showIntegral}
              onChange={(e) => setShowIntegral(e.target.checked)}
              className="w-4 h-4 rounded accent-sky-500"
            />
            Área Sob a Curva (Integral Definida)
          </label>

          {showIntegral && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between font-mono bg-sky-950/40 p-2 rounded-lg border border-sky-800/40 text-sky-300">
                <span>∫[{formatParamValue(integralStart)}, {formatParamValue(integralEnd)}] f(x) dx =</span>
                <span className="font-bold text-sky-400 text-sm">{formatParamValue(computeIntegralValue())}</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Limite Inferior (x₁):</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-200 font-bold">{formatParamValue(integralStart)}</span>
                    <button
                      onClick={() => setScaleModal({
                        label: 'Limite Inferior (x₁)',
                        currentMin: integralStartRange[0],
                        currentMax: integralStartRange[1],
                        onConfirm: (min, max) => applyNewScale(min, max, setIntegralStartRange, setIntegralStart)
                      })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-sky-500 hover:text-white text-sky-400 font-mono font-extrabold text-[10px] flex items-center justify-center border border-slate-700 transition-all shadow-sm cursor-pointer"
                      title="Customizar Limites da Escala de x₁ [C]"
                    >
                      C
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={integralStartRange[0]}
                  max={integralStartRange[1]}
                  step="any"
                  value={integralStart}
                  onChange={(e) => setIntegralStart(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>min: {formatParamValue(integralStartRange[0])}</span>
                  <span>max: {formatParamValue(integralStartRange[1])}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Limite Superior (x₂):</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-200 font-bold">{formatParamValue(integralEnd)}</span>
                    <button
                      onClick={() => setScaleModal({
                        label: 'Limite Superior (x₂)',
                        currentMin: integralEndRange[0],
                        currentMax: integralEndRange[1],
                        onConfirm: (min, max) => applyNewScale(min, max, setIntegralEndRange, setIntegralEnd)
                      })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-sky-500 hover:text-white text-sky-400 font-mono font-extrabold text-[10px] flex items-center justify-center border border-slate-700 transition-all shadow-sm cursor-pointer"
                      title="Customizar Limites da Escala de x₂ [C]"
                    >
                      C
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={integralEndRange[0]}
                  max={integralEndRange[1]}
                  step="any"
                  value={integralEnd}
                  onChange={(e) => setIntegralEnd(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>min: {formatParamValue(integralEndRange[0])}</span>
                  <span>max: {formatParamValue(integralEndRange[1])}</span>
                </div>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showTangent}
              onChange={(e) => setShowTangent(e.target.checked)}
              className="w-4 h-4 rounded accent-rose-500"
            />
            Linha Tangente & Ponto de Derivada
          </label>
        </div>

        {/* Advanced Manim Animation Controls + Scale Customization [ C ] for Run Time */}
        <div className="flex flex-col gap-3 border-t border-slate-800 pt-4">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-400" /> Controles da Animação Manim
          </span>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Modo / Estilo da Animação:</label>
            <select
              value={animMode}
              onChange={(e) => setAnimMode(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-semibold text-xs p-2 rounded-xl focus:outline-none focus:border-sky-500"
            >
              <option value="sequential">Criação Sequencial Completa</option>
              <option value="riemann">Retângulos de Riemann (Integral)</option>
              <option value="parametric">Animação Paramétrica do Parâmetro a</option>
              <option value="tangent">Movimento da Reta Tangente</option>
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-sky-400" /> Duração:</span>
                <div className="flex items-center gap-1">
                  <span className="text-sky-300 font-mono font-bold">{formatParamValue(animRunTime)}s</span>
                  <button
                    onClick={() => setScaleModal({
                      label: 'Duração da Animação',
                      currentMin: animRunTimeRange[0],
                      currentMax: animRunTimeRange[1],
                      onConfirm: (min, max) => applyNewScale(min, max, setAnimRunTimeRange, setAnimRunTime)
                    })}
                    className="w-4 h-4 rounded bg-slate-800 hover:bg-sky-500 hover:text-white text-sky-400 font-mono font-extrabold text-[9px] flex items-center justify-center border border-slate-700 transition-all shadow-sm cursor-pointer"
                    title="Customizar Limites de Tempo de Execução [C]"
                  >
                    C
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={animRunTimeRange[0]}
                max={animRunTimeRange[1]}
                step="any"
                value={animRunTime}
                onChange={(e) => setAnimRunTime(parseFloat(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>min: {animRunTimeRange[0]}s</span>
                <span>max: {animRunTimeRange[1]}s</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-teal-400" /> Cor:
              </label>
              <select
                value={animColor}
                onChange={(e) => setAnimColor(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 font-semibold text-xs p-1.5 rounded-xl focus:outline-none focus:border-sky-500"
              >
                <option value="TEAL">Teal (Ciano)</option>
                <option value="BLUE">Blue (Azul)</option>
                <option value="GREEN">Green (Verde)</option>
                <option value="PURPLE">Purple (Roxo)</option>
                <option value="RED">Red (Vermelho)</option>
                <option value="GOLD">Gold (Dourado)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Send to Manim Studio CTA */}
        <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-2">
          <button
            onClick={handleSendToStudio}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-5 h-5 fill-current" />
            Renderizar no Manim Studio
          </button>
        </div>
      </div>

      {/* Right Canvas Display & Keypad Panel */}
      <div className="flex-1 flex flex-col gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse"></div>
            <span className="text-sm font-bold text-slate-200">Plano Cartesiano GeoGebra</span>
            {hoverCoords && (
              <span className="text-xs bg-slate-800 text-sky-400 font-mono px-2 py-0.5 rounded-md border border-slate-700">
                x: {hoverCoords.x.toFixed(2)}, y: {hoverCoords.y.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomScale((prev) => prev * 1.25)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all border border-slate-700"
              title="Zoom In (Sem Limites)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomScale((prev) => prev * 0.8)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all border border-slate-700"
              title="Zoom Out (Sem Limites)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all border border-slate-700"
              title="Resetar Câmera & Zoom"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive GeoGebra Canvas Viewport */}
        <div ref={containerRef} className="relative flex-1 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[420px]">
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full block cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* GeoGebra Virtual Keypad (Integrated Interactive Keyboard) */}
        {showKeypad && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-inner flex flex-col gap-2">
            {/* Keypad Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setKeypadTab('123')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    keypadTab === '123'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  123
                </button>
                <button
                  onClick={() => setKeypadTab('fx')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    keypadTab === 'fx'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  f(x)
                </button>
                <button
                  onClick={() => setKeypadTab('ABC')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    keypadTab === 'ABC'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  ABC
                </button>
                <button
                  onClick={() => setKeypadTab('symbols')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    keypadTab === 'symbols'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  #&¬
                </button>
              </div>

              <button
                onClick={() => insertKey('CLEAR')}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 text-rose-400 px-2 py-1 rounded-lg border border-slate-800 font-semibold"
              >
                Limpar
              </button>
            </div>

            {/* Keypad Grid Content */}
            {keypadTab === '123' && (
              <div className="grid grid-cols-9 gap-1.5 text-xs font-semibold">
                <button onClick={() => insertKey('x')} className="key-btn font-mono">x</button>
                <button onClick={() => insertKey('y')} className="key-btn font-mono">y</button>
                <button onClick={() => insertKey('z')} className="key-btn font-mono">z</button>
                <button onClick={() => insertKey('π')} className="key-btn">π</button>
                <button onClick={() => insertKey('7')} className="key-btn font-bold text-white">7</button>
                <button onClick={() => insertKey('8')} className="key-btn font-bold text-white">8</button>
                <button onClick={() => insertKey('9')} className="key-btn font-bold text-white">9</button>
                <button onClick={() => insertKey(' * ')} className="key-op">×</button>
                <button onClick={() => insertKey(' / ')} className="key-op">÷</button>

                <button onClick={() => insertKey('^2')} className="key-btn">x²</button>
                <button onClick={() => insertKey('^')} className="key-btn">x^□</button>
                <button onClick={() => insertKey('√(')} className="key-btn">√</button>
                <button onClick={() => insertKey('e')} className="key-btn font-mono">e</button>
                <button onClick={() => insertKey('4')} className="key-btn font-bold text-white">4</button>
                <button onClick={() => insertKey('5')} className="key-btn font-bold text-white">5</button>
                <button onClick={() => insertKey('6')} className="key-btn font-bold text-white">6</button>
                <button onClick={() => insertKey(' + ')} className="key-op">+</button>
                <button onClick={() => insertKey(' - ')} className="key-op">-</button>

                <button onClick={() => insertKey('<')} className="key-btn">&lt;</button>
                <button onClick={() => insertKey('>')} className="key-btn">&gt;</button>
                <button onClick={() => insertKey('<=')} className="key-btn">≤</button>
                <button onClick={() => insertKey('>=')} className="key-btn">≥</button>
                <button onClick={() => insertKey('1')} className="key-btn font-bold text-white">1</button>
                <button onClick={() => insertKey('2')} className="key-btn font-bold text-white">2</button>
                <button onClick={() => insertKey('3')} className="key-btn font-bold text-white">3</button>
                <button onClick={() => insertKey('=')} className="key-op">=</button>
                <button onClick={() => insertKey('BACKSPACE')} className="key-op bg-rose-500/20 text-rose-300">⌫</button>

                <button onClick={() => insertKey('(')} className="key-btn">(</button>
                <button onClick={() => insertKey(')')} className="key-btn">)</button>
                <button onClick={() => insertKey('abs(')} className="key-btn">|x|</button>
                <button onClick={() => insertKey(',')} className="key-btn">,</button>
                <button onClick={() => insertKey('0')} className="key-btn font-bold text-white col-span-2">0</button>
                <button onClick={() => insertKey('.')} className="key-btn font-bold text-white">.</button>
                <button onClick={() => insertKey(' ')} className="key-btn col-span-2 font-semibold text-slate-400">Espaço</button>
              </div>
            )}

            {keypadTab === 'fx' && (
              <div className="grid grid-cols-7 gap-1.5 text-xs font-semibold">
                <button onClick={() => insertKey('sen(')} className="key-btn font-mono">sen</button>
                <button onClick={() => insertKey('cos(')} className="key-btn font-mono">cos</button>
                <button onClick={() => insertKey('tg(')} className="key-btn font-mono">tg</button>
                <button onClick={() => insertKey('%')} className="key-btn">%</button>
                <button onClick={() => insertKey('!')} className="key-btn">!</button>
                <button onClick={() => insertKey('$')} className="key-btn">$</button>
                <button onClick={() => insertKey('°')} className="key-btn">°</button>

                <button onClick={() => insertKey('sen⁻¹(')} className="key-btn font-mono">sen⁻¹</button>
                <button onClick={() => insertKey('cos⁻¹(')} className="key-btn font-mono">cos⁻¹</button>
                <button onClick={() => insertKey('tg⁻¹(')} className="key-btn font-mono">tg⁻¹</button>
                <button onClick={() => insertKey('{')} className="key-btn">{'{'}</button>
                <button onClick={() => insertKey('}')} className="key-btn">{'}'}</button>
                <button onClick={() => insertKey('<=')} className="key-btn">≤</button>
                <button onClick={() => insertKey('>=')} className="key-btn">≥</button>

                <button onClick={() => insertKey('ln(')} className="key-btn font-mono">ln</button>
                <button onClick={() => insertKey('log10(')} className="key-btn font-mono">log₁₀</button>
                <button onClick={() => insertKey('log(')} className="key-btn font-mono">log</button>
                <button onClick={() => insertKey('d/dx(')} className="key-btn">d/dx</button>
                <button onClick={() => insertKey('∫(')} className="key-btn">∫</button>
                <button onClick={() => insertKey('i')} className="key-btn font-serif italic">i</button>
                <button onClick={() => insertKey('BACKSPACE')} className="key-op bg-rose-500/20 text-rose-300">⌫</button>

                <button onClick={() => insertKey('exp(')} className="key-btn">e^□</button>
                <button onClick={() => insertKey('10^')} className="key-btn">10^□</button>
                <button onClick={() => insertKey('√(')} className="key-btn">ⁿ√</button>
                <button onClick={() => insertKey('(')} className="key-btn">(</button>
                <button onClick={() => insertKey(')')} className="key-btn">)</button>
                <button onClick={() => insertKey(' ')} className="key-btn col-span-2 text-slate-400">Espaço</button>
              </div>
            )}

            {keypadTab === 'ABC' && (
              <div className="grid grid-cols-10 gap-1 text-xs font-mono">
                {['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'].map((char) => (
                  <button key={char} onClick={() => insertKey(char)} className="key-btn py-2">
                    {char}
                  </button>
                ))}
                <button onClick={() => insertKey('BACKSPACE')} className="key-op col-span-4 bg-rose-500/20 text-rose-300 py-2">⌫</button>
              </div>
            )}

            {keypadTab === 'symbols' && (
              <div className="grid grid-cols-8 gap-1.5 text-xs">
                {['∞', 'θ', 'α', 'β', 'γ', 'δ', 'λ', 'μ', 'σ', 'Ω', '∩', '∪', '∈', '∉', '⊂', '⇒'].map((sym) => (
                  <button key={sym} onClick={() => insertKey(sym)} className="key-btn py-2 font-mono text-sky-300">
                    {sym}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Live Code Preview */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-sky-400" /> Código Manim Python Gerado
            </span>
            <button
              onClick={handleSendToStudio}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              Copiar & Enviar para o Estúdio →
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-300 max-h-32 overflow-y-auto bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 scrollbar-thin">
            {generateManimCode()}
          </pre>
        </div>
      </div>

      {/* Styled Utility CSS for Keypad */}
      <style>{`
        .key-btn {
          background-color: #1e293b;
          color: #cbd5e1;
          border: 1px solid #334155;
          padding: 6px 0;
          border-radius: 8px;
          text-align: center;
          transition: all 0.1s;
        }
        .key-btn:hover {
          background-color: #334155;
          color: #ffffff;
        }
        .key-op {
          background-color: #0284c7;
          color: #ffffff;
          border: 1px solid #0369a1;
          padding: 6px 0;
          border-radius: 8px;
          text-align: center;
          transition: all 0.1s;
          font-weight: bold;
        }
        .key-op:hover {
          background-color: #38bdf8;
        }
      `}</style>
    </div>
  );
};
