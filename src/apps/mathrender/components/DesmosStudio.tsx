import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Sliders, RefreshCw, ZoomIn, ZoomOut, Sun, Moon, Keyboard, Plus, Trash2, Layers } from 'lucide-react';

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

export interface DynamicParam {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  isAnimated: boolean;
  animTarget: number;
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
          Ajuste o <strong className="text-sky-300">centro da escala</strong> ou altere os limites ({spanPreview}).
        </p>

        {errorMsg && (
          <div className="text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40 font-mono">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-1.5 bg-sky-950/30 p-3 rounded-xl border border-sky-800/40">
          <label className="text-[11px] font-bold text-sky-300 uppercase flex items-center justify-between">
            <span>Centro da Escala:</span>
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

        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => applyPreset(-10, 10)} className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700">
            [-10, +10]
          </button>
          <button onClick={() => applyPreset(-1, 1)} className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700">
            [-1, +1]
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

// Smart Math Expression Parser (supports sin, sen, 2x, x^2, tg, ln, sqrt, and dynamic parameters)
export function parseMathExpression(rawInput: string, paramsMap: Record<string, number>): ParsedMath {
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

  // Replace parameter values dynamically in JS string
  for (const [pName, pVal] of Object.entries(paramsMap)) {
    const reg = new RegExp(`\\b${pName}\\b`, 'g');
    js = js.replace(reg, `(${pVal})`);
  }

  // 5. Build Python / NumPy expression
  let py = expr
    .replace(/sen⁻¹/g, 'arcsin')
    .replace(/cos⁻¹/g, 'arccos')
    .replace(/tg⁻¹/g, 'arctan')
    .replace(/sen/g, 'sin')
    .replace(/tg/g, 'tan')
    .replace(/√/g, 'np.sqrt')
    .replace(/π/g, 'np.pi')
    .replace(/÷/g, '/')
    .replace(/×/g, '*')
    .replace(/\^/g, '**');

  py = py.replace(/\b(sin|cos|tan|arcsin|arccos|arctan|exp|log|log10|abs)\b/g, 'np.$1');

  try {
    const testFn = new Function('x', `return ${js};`);
    testFn(1);
    return { jsExpr: js, pyExpr: py, rawInput: expr, isValid: true };
  } catch (err: any) {
    return { jsExpr: '0', pyExpr: '0', rawInput: expr, isValid: false, error: err.message };
  }
}

// Convert expression string to clean LaTeX formula for Manim MathTex(r"...")
export function formatExpressionToLatex(rawInput: string): string {
  if (!rawInput || !rawInput.trim()) return '0';

  let s = rawInput.trim();

  // Portuguese trig replacements
  s = s
    .replace(/sen⁻¹/g, '\\arcsin')
    .replace(/cos⁻¹/g, '\\arccos')
    .replace(/tg⁻¹/g, '\\arctan')
    .replace(/\bsen\b/g, '\\sin')
    .replace(/\btg\b/g, '\\tan')
    .replace(/\btan\b/g, '\\tan')
    .replace(/\bsin\b/g, '\\sin')
    .replace(/\bcos\b/g, '\\cos')
    .replace(/\bln\b/g, '\\ln')
    .replace(/\blog\b/g, '\\log')
    .replace(/√/g, '\\sqrt');

  // Replace exp(expr) -> e^{expr}
  s = s.replace(/\bexp\(([^)]+)\)/g, 'e^{\\left($1\\right)}');

  // Replace sqrt(expr) -> \sqrt{expr}
  s = s.replace(/\bsqrt\(([^)]+)\)/g, '\\sqrt{$1}');

  // Multiplication: replace '*' with '\cdot '
  s = s.replace(/\*/g, ' \\cdot ');

  // Exponents: x^2 or x^(2/a) -> x^{2/a}
  s = s.replace(/\^\(([^)]+)\)/g, '^{$1}');
  s = s.replace(/\^([a-zA-Z0-9_]+)/g, '^{$1}');

  return s.replace(/\s+/g, ' ').trim();
}

// Calculate nice grid steps (1, 2, 5, 10...) so both X and Y axes always match 1:1
export function getNiceGridStep(span: number, targetTicks: number = 7): number {
  if (span <= 0 || isNaN(span)) return 1;
  const rawStep = span / targetTicks;
  const exponent = Math.floor(Math.log10(rawStep));
  const fraction = rawStep / Math.pow(10, exponent);

  let niceFraction: number;
  if (fraction < 1.5) {
    niceFraction = 1;
  } else if (fraction < 3.5) {
    niceFraction = 2;
  } else if (fraction < 7.5) {
    niceFraction = 5;
  } else {
    niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}

const LOCAL_STORAGE_KEY = 'manim_geogebra_studio_config';

export const DesmosStudio: React.FC<DesmosStudioProps> = ({ onSendToManim }) => {
  // State 1: Function string input
  const [funcStr, setFuncStr] = useState<string>('sin(x) * cos(x / 2)');

  // State 2: Dynamic Parameters List
  const [params, setParams] = useState<DynamicParam[]>([
    { id: 'param_a', name: 'a', value: 2.0, min: -10, max: 10, isAnimated: true, animTarget: 4.0 },
    { id: 'param_b', name: 'b', value: 1.0, min: -10, max: 10, isAnimated: false, animTarget: 2.0 },
  ]);

  // State 3: Tangent line configuration
  const [showTangent, setShowTangent] = useState<boolean>(false);
  const [tangentX, setTangentX] = useState<number>(1.0);
  const [tangentXRange, setTangentXRange] = useState<[number, number]>([-10, 10]);

  // State 4: Definite Integral configuration
  const [showIntegral, setShowIntegral] = useState<boolean>(false);
  const [integralStart, setIntegralStart] = useState<number>(0.0);
  const [integralStartRange, setIntegralStartRange] = useState<[number, number]>([-10, 10]);
  const [integralEnd, setIntegralEnd] = useState<number>(Math.PI);
  const [integralEndRange, setIntegralEndRange] = useState<[number, number]>([-10, 10]);

  // State 5: Animation Configuration
  const [animMode, setAnimMode] = useState<'sequential' | 'parametric' | 'tangent' | 'riemann'>('sequential');
  const [animRunTime, setAnimRunTime] = useState<number>(3.0);
  const [animRunTimeRange, setAnimRunTimeRange] = useState<[number, number]>([0.5, 10]);
  const [animColor, setAnimColor] = useState<string>('TEAL');

  // State 6: GeoGebra Viewport Camera & Theme
  const [themeMode, setThemeMode] = useState<'geogebra-dark' | 'geogebra-light'>('geogebra-dark');
  const [xCenter, setXCenter] = useState<number>(0);
  const [yCenter, setYCenter] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  // UI Interactive States
  const [showKeypad, setShowKeypad] = useState<boolean>(false);
  const [keypadTab, setKeypadTab] = useState<'123' | 'fx' | 'abc'>('123');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  // Active Scale Modal State
  const [scaleModal, setScaleModal] = useState<{
    label: string;
    currentMin: number;
    currentMax: number;
    onConfirm: (newMin: number, newMax: number) => void;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Canvas Dimensions State
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 500 });

  // Compute 1:1 Isotropic Axis Extents based on container aspect ratio
  const aspect = canvasDimensions.height > 0 ? canvasDimensions.width / canvasDimensions.height : 1.6;
  const baseRangeY = 10 / zoomScale;
  const baseRangeX = baseRangeY * aspect;

  const xMin = xCenter - baseRangeX / 2;
  const xMax = xCenter + baseRangeX / 2;
  const yMin = yCenter - baseRangeY / 2;
  const yMax = yCenter + baseRangeY / 2;

  const xSpan = Math.abs(xMax - xMin);
  const ySpan = Math.abs(yMax - yMin);

  // Load saved graph settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.funcStr) setFuncStr(p.funcStr);
        if (p.params && Array.isArray(p.params)) setParams(p.params);
        if (p.showTangent !== undefined) setShowTangent(p.showTangent);
        if (p.tangentX !== undefined) setTangentX(p.tangentX);
        if (p.tangentXRange) setTangentXRange(p.tangentXRange);
        if (p.showIntegral !== undefined) setShowIntegral(p.showIntegral);
        if (p.integralStart !== undefined) setIntegralStart(p.integralStart);
        if (p.integralStartRange) setIntegralStartRange(p.integralStartRange);
        if (p.integralEnd !== undefined) setIntegralEnd(p.integralEnd);
        if (p.integralEndRange) setIntegralEndRange(p.integralEndRange);
        if (p.animMode) setAnimMode(p.animMode);
        if (p.animRunTime) setAnimRunTime(p.animRunTime);
        if (p.animColor) setAnimColor(p.animColor);
        if (p.xCenter !== undefined) setXCenter(p.xCenter);
        if (p.yCenter !== undefined) setYCenter(p.yCenter);
        if (p.zoomScale !== undefined) setZoomScale(p.zoomScale);
      }
    } catch {}
  }, []);

  // Save graph settings to localStorage whenever changed
  useEffect(() => {
    try {
      const config = {
        funcStr,
        params,
        showTangent,
        tangentX,
        tangentXRange,
        showIntegral,
        integralStart,
        integralStartRange,
        integralEnd,
        integralEndRange,
        animMode,
        animRunTime,
        animColor,
        xCenter,
        yCenter,
        zoomScale,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [funcStr, params, showTangent, tangentX, tangentXRange, showIntegral, integralStart, integralStartRange, integralEnd, integralEndRange, animMode, animRunTime, animColor, xCenter, yCenter, zoomScale]);

  // Build params map for evaluation
  const paramsMap: Record<string, number> = {};
  for (const p of params) {
    paramsMap[p.name] = p.value;
  }

  // Parse math expression
  const parsed = parseMathExpression(funcStr, paramsMap);

  // Format Helper
  const formatParamValue = (val: number): string => {
    if (isNaN(val)) return '0';
    const absVal = Math.abs(val);
    if (absVal === 0) return '0';
    if (absVal < 0.001 || absVal >= 10000) {
      return val.toExponential(3);
    }
    return Number(val.toFixed(4)).toString();
  };

  // Add new parameter
  const handleAddParam = () => {
    const availableNames = ['c', 'd', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'z'];
    const existingNames = params.map(p => p.name);
    const nextName = availableNames.find(n => !existingNames.includes(n)) || `p${params.length + 1}`;

    const newParam: DynamicParam = {
      id: `param_${Date.now()}`,
      name: nextName,
      value: 1.0,
      min: -10,
      max: 10,
      isAnimated: false,
      animTarget: 3.0,
    };
    setParams(prev => [...prev, newParam]);
  };

  // Update a single parameter field
  const updateParam = (id: string, updates: Partial<DynamicParam>) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Remove a parameter
  const removeParam = (id: string) => {
    if (params.length <= 1) return;
    setParams(prev => prev.filter(p => p.id !== id));
  };

  // Calculate definite integral approximation using Simpson's Rule
  const computeIntegralValue = (): number => {
    if (!parsed.isValid) return 0;
    try {
      const evalFn = new Function('x', `return ${parsed.jsExpr};`);
      const a = Math.min(integralStart, integralEnd);
      const b = Math.max(integralStart, integralEnd);
      const n = 200;
      const h = (b - a) / n;

      let sum = evalFn(a) + evalFn(b);
      for (let i = 1; i < n; i++) {
        const x = a + i * h;
        const val = evalFn(x);
        if (isNaN(val) || !isFinite(val)) continue;
        sum += (i % 2 === 0 ? 2 : 4) * val;
      }

      let area = (h / 3) * sum;
      if (integralStart > integralEnd) area = -area;
      return area;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const isLight = themeMode === 'geogebra-light';
    const bgColor = isLight ? '#f8fafc' : '#020617';
    const gridColor = isLight ? 'rgba(203, 213, 225, 0.6)' : 'rgba(30, 41, 59, 0.7)';
    const axisColor = isLight ? '#475569' : '#64748b';
    const textColor = isLight ? '#334155' : '#94a3b8';
    const curveColor = isLight ? '#0284c7' : '#38bdf8';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    const gridStep = getNiceGridStep(ySpan, 7);
    const xGridStep = gridStep;
    const yGridStep = gridStep;

    // Grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = gridColor;
    ctx.beginPath();
    const firstXGrid = Math.floor(xMin / xGridStep) * xGridStep;
    for (let x = firstXGrid; x <= xMax; x += xGridStep) {
      const sx = toScreenX(x);
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
    }
    const firstYGrid = Math.floor(yMin / yGridStep) * yGridStep;
    for (let y = firstYGrid; y <= yMax; y += yGridStep) {
      const sy = toScreenY(y);
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
    }
    ctx.stroke();

    // Axes
    const xAxisY = toScreenY(0);
    const yAxisX = toScreenX(0);

    ctx.lineWidth = 2;
    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    if (xAxisY >= 0 && xAxisY <= height) {
      ctx.moveTo(0, xAxisY);
      ctx.lineTo(width, xAxisY);
    }
    if (yAxisX >= 0 && yAxisX <= width) {
      ctx.moveTo(yAxisX, 0);
      ctx.lineTo(yAxisX, height);
    }
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = textColor;
    ctx.font = '11px monospace';
    for (let x = firstXGrid; x <= xMax; x += xGridStep) {
      if (Math.abs(x) < 1e-9) continue;
      const sx = toScreenX(x);
      const sy = Math.max(15, Math.min(height - 10, xAxisY + 15));
      ctx.fillText(formatParamValue(x), sx - 10, sy);
    }
    for (let y = firstYGrid; y <= yMax; y += yGridStep) {
      if (Math.abs(y) < 1e-9) continue;
      const sy = toScreenY(y);
      const sx = Math.max(10, Math.min(width - 25, yAxisX + 5));
      ctx.fillText(formatParamValue(y), sx, sy + 4);
    }

    if (!parsed.isValid) return;

    let evalFn: ((x: number) => number) | null = null;
    try {
      evalFn = new Function('x', `return ${parsed.jsExpr};`) as (x: number) => number;
    } catch {
      return;
    }

    // Integral area shading
    if (showIntegral && evalFn) {
      const a = Math.min(integralStart, integralEnd);
      const b = Math.max(integralStart, integralEnd);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      const startSx = toScreenX(a);
      ctx.moveTo(startSx, toScreenY(0));

      const samples = 150;
      for (let i = 0; i <= samples; i++) {
        const x = a + (i / samples) * (b - a);
        let y = 0;
        try {
          y = evalFn(x);
        } catch { y = 0; }
        if (isNaN(y) || !isFinite(y)) y = 0;
        ctx.lineTo(toScreenX(x), toScreenY(y));
      }

      const endSx = toScreenX(b);
      ctx.lineTo(endSx, toScreenY(0));
      ctx.closePath();
      ctx.fill();
    }

    // Function plot curve
    ctx.lineWidth = 3;
    ctx.strokeStyle = curveColor;
    ctx.beginPath();

    let isPlotting = false;
    const numPoints = width * 1.5;

    for (let i = 0; i <= numPoints; i++) {
      const sx = (i / numPoints) * width;
      const x = xMin + (i / numPoints) * (xMax - xMin);
      let y = 0;
      try {
        y = evalFn(x);
      } catch {
        isPlotting = false;
        continue;
      }

      if (isNaN(y) || !isFinite(y)) {
        isPlotting = false;
        continue;
      }

      const sy = toScreenY(y);
      if (!isPlotting) {
        ctx.moveTo(sx, sy);
        isPlotting = true;
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.stroke();

    // Tangent Line & Point
    if (showTangent && evalFn) {
      try {
        const x0 = tangentX;
        const y0 = evalFn(x0);

        if (!isNaN(y0) && isFinite(y0)) {
          const h = Math.max(Math.abs(x0) * 1e-7, 1e-8);
          const yPlus = evalFn(x0 + h);
          const yMinus = evalFn(x0 - h);
          const slope = (yPlus - yMinus) / (2 * h);

          const span = xSpan;
          const x1 = x0 - span;
          const y1 = y0 - slope * span;
          const x2 = x0 + span;
          const y2 = y0 + slope * span;

          ctx.lineWidth = 2;
          ctx.strokeStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(toScreenX(x1), toScreenY(y1));
          ctx.lineTo(toScreenX(x2), toScreenY(y2));
          ctx.stroke();

          // Point (x0, y0)
          const dotSx = toScreenX(x0);
          const dotSy = toScreenY(y0);
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(dotSx, dotSy, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      } catch {}
    }
  }, [canvasDimensions, parsed, paramsMap, xMin, xMax, yMin, yMax, themeMode, showTangent, tangentX, showIntegral, integralStart, integralEnd]);

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

  // Mouse Wheel Zoom Handler (Zoom Towards Cursor Position)
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Current math coordinates under mouse cursor before zoom
    const mathXUnderMouse = xMin + (mouseX / canvas.width) * (xMax - xMin);
    const mathYUnderMouse = yMax - (mouseY / canvas.height) * (yMax - yMin);

    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.83;
    const nextZoom = Math.max(1e-15, Math.min(1e15, zoomScale * zoomFactor));

    // New span dimensions under nextZoom
    const currentAspect = canvas.height > 0 ? canvas.width / canvas.height : 1.6;
    const newRangeY = 10 / nextZoom;
    const newRangeX = newRangeY * currentAspect;

    // Adjust center so (mathXUnderMouse, mathYUnderMouse) stays locked under the cursor
    const newXCenter = mathXUnderMouse + (0.5 - mouseX / canvas.width) * newRangeX;
    const newYCenter = mathYUnderMouse - (0.5 - mouseY / canvas.height) * newRangeY;

    setXCenter(newXCenter);
    setYCenter(newYCenter);
    setZoomScale(nextZoom);
  };

  // Touch Handlers for Mobile Panning & Pinch-to-Zoom (Towards Pinch Center)
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setTouchStartDist(null);
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStart.x;
      const dy = e.touches[0].clientY - dragStart.y;
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

      const mathDx = (dx / canvas.width) * (xMax - xMin);
      const mathDy = (dy / canvas.height) * (yMax - yMin);

      setXCenter((prev) => prev - mathDx);
      setYCenter((prev) => prev + mathDy);
    } else if (e.touches.length === 2 && touchStartDist !== null) {
      const rect = canvas.getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

      const mathXUnderPinch = xMin + (midX / canvas.width) * (xMax - xMin);
      const mathYUnderPinch = yMax - (midY / canvas.height) * (yMax - yMin);

      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      if (newDist > 0 && touchStartDist > 0) {
        const factor = newDist / touchStartDist;
        setTouchStartDist(newDist);

        const nextZoom = Math.max(1e-15, Math.min(1e15, zoomScale * factor));
        const currentAspect = canvas.height > 0 ? canvas.width / canvas.height : 1.6;
        const newRangeY = 10 / nextZoom;
        const newRangeX = newRangeY * currentAspect;

        const newXCenter = mathXUnderPinch + (0.5 - midX / canvas.width) * newRangeX;
        const newYCenter = mathYUnderPinch - (0.5 - midY / canvas.height) * newRangeY;

        setXCenter(newXCenter);
        setYCenter(newYCenter);
        setZoomScale(nextZoom);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStartDist(null);
  };

  const resetView = () => {
    setXCenter(0);
    setYCenter(0);
    setZoomScale(1.0);
  };

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

  // Generate Advanced Manim Python Code with LaTeX MathTex & Working Parametric Animations
  const generateManimCode = (): string => {
    const pyExpr = parsed.pyExpr;
    const latexExpr = formatExpressionToLatex(funcStr);
    const integralValStr = formatParamValue(computeIntegralValue());

    const formattedXMin = formatParamValue(xMin);
    const formattedXMax = formatParamValue(xMax);
    const formattedYMin = formatParamValue(yMin);
    const formattedYMax = formatParamValue(yMax);

    const manimGridStep = formatParamValue(getNiceGridStep(ySpan, 6));
    const xStepManim = manimGridStep;
    const yStepManim = manimGridStep;

    let animationBlock = '';

    if (animMode === 'riemann') {
      const stepWidth = formatParamValue(Math.abs(integralEnd - integralStart) / 10);
      animationBlock = `        # 3. Animação de Integral e Retângulos de Riemann
        area = axes.get_area(graph, x_range=[${formatParamValue(integralStart)}, ${formatParamValue(integralEnd)}], color=${animColor}, opacity=0.3)
        riemann = axes.get_riemann_rectangles(graph, x_range=[${formatParamValue(integralStart)}, ${formatParamValue(integralEnd)}], dx=${stepWidth}, stroke_width=0.5, color=BLUE_B)
        
        area_label = MathTex(r"\\int_{${formatParamValue(integralStart)}}^{${formatParamValue(integralEnd)}} f(x) dx \\approx ${integralValStr}", font_size=34, color=${animColor})
        area_label.to_corner(UR)

        self.play(Create(area), Write(area_label), run_time=1.5)
        self.play(Create(riemann), run_time=${formatParamValue(animRunTime)})
        self.wait(1)`;
    } else if (animMode === 'parametric') {
      // Build dynamic ValueTrackers for selected parameters
      const animatedParamsList = params.filter(p => p.isAnimated);
      const paramsToTrack = animatedParamsList.length > 0 ? animatedParamsList : [params[0]];

      const trackerInits = paramsToTrack.map(p => `        ${p.name}_tracker = ValueTracker(${formatParamValue(p.value)})`).join('\n');

      // Build python lambda with trackers
      let pyLambdaExpr = pyExpr;
      for (const p of paramsToTrack) {
        const reg = new RegExp(`\\b${p.name}\\b`, 'g');
        pyLambdaExpr = pyLambdaExpr.replace(reg, `${p.name}_tracker.get_value()`);
      }

      const animateCalls = paramsToTrack.map(p => `${p.name}_tracker.animate.set_value(${formatParamValue(p.animTarget)})`).join(',\n            ');

      // Build live parameter value label for upper right (UR) corner using bulletproof LaTeX separator
      const paramLatexParts = paramsToTrack.map(p => `${p.name} = {${p.name}_tracker.get_value():.2f}`).join(', \\ \\ ');

      animationBlock = `        # 3. Animação Paramétrica dos Parâmetros (${paramsToTrack.map(p => p.name).join(', ')})
${trackerInits}

        # Gráfico que se atualiza continuamente com a mudança dos parâmetros
        graph = always_redraw(lambda: axes.plot(
            lambda x: ${pyLambdaExpr},
            color=${animColor},
            x_range=[${formattedXMin}, ${formattedXMax}]
        ))

        # Rótulo em LaTeX da fórmula no canto superior esquerdo (UL)
        graph_label = MathTex(r"f(x) = ${latexExpr}", font_size=36, color=${animColor}).to_corner(UL)

        # Rótulo animado em tempo real com o valor dos parâmetros no canto superior direito (UR)
        param_label = always_redraw(lambda: MathTex(
            rf"${paramLatexParts}",
            font_size=36,
            color=${animColor}
        ).to_corner(UR))

        self.play(Create(axes), Write(axes_labels), run_time=1.5)
        self.play(Create(graph), Write(graph_label), Write(param_label), run_time=1.5)

        # Animação conjunta dos parâmetros selecionados
        self.play(
            ${animateCalls},
            run_time=${formatParamValue(animRunTime)},
            rate_func=there_and_back
        )
        self.wait(1)`;
    } else {
      // Standard / Tangent animation
      animationBlock = `        # 3. Animações Adicionais
${showIntegral ? `        # Preenchimento da Área da Integral Definida
        area = axes.get_area(graph, x_range=[${formatParamValue(integralStart)}, ${formatParamValue(integralEnd)}], color=${animColor}, opacity=0.3)
        area_label = MathTex(r"\\int_{${formatParamValue(integralStart)}}^{${formatParamValue(integralEnd)}} f(x) dx \\approx ${integralValStr}", font_size=34, color=${animColor})
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
        point_label = always_redraw(lambda: Text(f"x0 = {t_param.get_value():.3f}", font_size=32, color=RED).to_corner(UR))
        self.play(Create(dot), Create(tangent_line), Write(point_label))
        self.play(t_param.animate.set_value(${formattedXMax}), run_time=${formatParamValue(animRunTime)}, rate_func=there_and_back)` : ''}
        self.wait(1)`;
    }

    if (animMode !== 'parametric') {
      return `from manim import *
import numpy as np

class GeoGebraGraphScene(Scene):
    def construct(self):
        # 1. Plano Cartesiano e Grade
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

        # 2. Definição da Função f(x)
        func = lambda x: ${pyExpr}
        graph = axes.plot(func, color=${animColor}, x_range=[${formattedXMin}, ${formattedXMax}])
        
        # Rótulo em LaTeX elegante
        graph_label = MathTex(r"f(x) = ${latexExpr}", font_size=36, color=${animColor}).to_corner(UL)

        self.play(Create(axes), Write(axes_labels), run_time=1.5)
        self.play(Create(graph), Write(graph_label), run_time=1.5)
        self.wait(0.5)

${animationBlock}
`;
    }

    return `from manim import *
import numpy as np

class GeoGebraGraphScene(Scene):
    def construct(self):
        # 1. Plano Cartesiano e Grade
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

${animationBlock}
`;
  };

  const handleSendToStudio = () => {
    const code = generateManimCode();
    onSendToManim(code);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-2 sm:p-6 min-h-[calc(100vh-5rem)] relative">
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

      {/* Left Sidebar Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-4 sm:gap-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center font-bold text-sky-400 text-base font-serif">
              gG
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Gráfico Studio 2D</h2>
          </div>

          <button
            onClick={() => setThemeMode(themeMode === 'geogebra-light' ? 'geogebra-dark' : 'geogebra-light')}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all text-xs flex items-center gap-1.5 border border-slate-700"
            title="Alternar Tema do Canvas"
          >
            {themeMode === 'geogebra-light' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-sky-400" />}
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Crie e manipule funções com parâmetros dinâmicos, teclado matemático e animações Manim com fórmula em LaTeX.
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
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 font-mono"
            >
              sin(x)*cos(x/2)
            </button>
            <button
              onClick={() => setFuncStr('a * x^3 - b * x')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 font-mono"
            >
              Polinômio (x³)
            </button>
            <button
              onClick={() => setFuncStr('b * exp(-x^2 / a)')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 font-mono"
            >
              Gaussiana
            </button>
            <button
              onClick={() => setFuncStr('tg(x)')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 font-mono"
            >
              Tangente tg(x)
            </button>
          </div>
        </div>

        {/* Dynamic Parameters List with Scroll Region & Add Button */}
        <div className="flex flex-col gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sky-400" /> Parâmetros Dinâmicos ({params.length})
            </span>
            <button
              onClick={handleAddParam}
              className="text-[11px] bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> + Parâmetro
            </button>
          </div>

          {/* Dedicated Scroll Region for Parameters */}
          <div className="flex flex-col gap-3.5 max-h-[280px] sm:max-h-[320px] overflow-y-auto pr-1.5 custom-scrollbar">
            {params.map((p) => (
              <div key={p.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span>Parâmetro <strong className="text-sky-400 font-mono text-sm">{p.name}</strong>:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sky-400 font-bold">{formatParamValue(p.value)}</span>
                    <button
                      onClick={() => setScaleModal({
                        label: `Parâmetro ${p.name}`,
                        currentMin: p.min,
                        currentMax: p.max,
                        onConfirm: (min, max) => updateParam(p.id, { min, max })
                      })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-sky-500 hover:text-white text-sky-400 font-mono font-extrabold text-[10px] flex items-center justify-center border border-slate-700 transition-all cursor-pointer"
                      title={`Customizar Limites da Escala de ${p.name} [C]`}
                    >
                      C
                    </button>
                    {params.length > 1 && (
                      <button
                        onClick={() => removeParam(p.id)}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition-all cursor-pointer"
                        title={`Remover Parâmetro ${p.name}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  step="any"
                  value={p.value}
                  onChange={(e) => updateParam(p.id, { value: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>min: {formatParamValue(p.min)}</span>
                  <span>max: {formatParamValue(p.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tangent Line Controls */}
        <div className="flex flex-col gap-3 border-t border-slate-800 pt-4">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showTangent}
              onChange={(e) => setShowTangent(e.target.checked)}
              className="w-4 h-4 rounded accent-rose-500"
            />
            Reta Tangente no Ponto (x₀)
          </label>

          {showTangent && (
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Ponto Tangente (<strong className="text-rose-400 font-mono">x₀</strong>):</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-rose-400 font-bold">{formatParamValue(tangentX)}</span>
                  <button
                    onClick={() => setScaleModal({
                      label: 'Ponto Tangente (x₀)',
                      currentMin: tangentXRange[0],
                      currentMax: tangentXRange[1],
                      onConfirm: (min, max) => { setTangentXRange([min, max]); setTangentX(Math.max(min, Math.min(max, tangentX))); }
                    })}
                    className="w-5 h-5 rounded bg-slate-800 hover:bg-rose-500 hover:text-white text-rose-400 font-mono font-extrabold text-[10px] flex items-center justify-center border border-slate-700 transition-all cursor-pointer"
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
            </div>
          )}
        </div>

        {/* Definite Integral Controls */}
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
                  <span className="font-mono text-slate-200 font-bold">{formatParamValue(integralStart)}</span>
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
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Limite Superior (x₂):</span>
                  <span className="font-mono text-slate-200 font-bold">{formatParamValue(integralEnd)}</span>
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
              </div>
            </div>
          )}
        </div>

        {/* Manim Animation Options Panel */}
        <div className="flex flex-col gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-400" /> Modo de Animação Manim
            </span>
          </div>

          <select
            value={animMode}
            onChange={(e) => setAnimMode(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 text-sky-300 font-semibold text-xs p-2 rounded-xl focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="sequential">Animação Padrão (Plano + Curva)</option>
            <option value="parametric">Animação Paramétrica (Variação de Parâmetros)</option>
            <option value="riemann">Animação Retângulos de Riemann</option>
            <option value="tangent">Animação Reta Tangente Móvel</option>
          </select>

          {/* Parametric Specific Settings */}
          {animMode === 'parametric' && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2.5 text-xs">
              <span className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">
                Configuração da Variação dos Parâmetros:
              </span>
              {params.map(p => (
                <div key={p.id} className="flex flex-col gap-2 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-mono">
                      <input
                        type="checkbox"
                        checked={p.isAnimated}
                        onChange={(e) => updateParam(p.id, { isAnimated: e.target.checked })}
                        className="w-4 h-4 rounded accent-sky-500"
                      />
                      Parâmetro <strong className="text-sky-400">{p.name}</strong>
                    </label>
                    {p.isAnimated && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">
                          De <strong className="text-sky-300 font-mono">{formatParamValue(p.value)}</strong> até <strong className="text-sky-400 font-mono">{formatParamValue(p.animTarget)}</strong>
                        </span>
                        <button
                          onClick={() => setScaleModal({
                            label: `Alvo do Parâmetro ${p.name}`,
                            currentMin: Math.min(p.value, p.animTarget) - 5,
                            currentMax: Math.max(p.value, p.animTarget) + 5,
                            onConfirm: (min, max) => {
                              updateParam(p.id, { animTarget: (min + max) / 2 });
                            }
                          })}
                          className="w-5 h-5 rounded bg-slate-800 hover:bg-sky-500 hover:text-white text-sky-400 font-mono font-extrabold text-[10px] flex items-center justify-center border border-slate-700 transition-all cursor-pointer shadow-sm"
                          title={`Customizar Limites da Variação do Alvo [C]`}
                        >
                          C
                        </button>
                      </div>
                    )}
                  </div>

                  {p.isAnimated && (
                    <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Valor Alvo da Animação ({p.name}):</span>
                        <input
                          type="number"
                          step="any"
                          value={p.animTarget}
                          onChange={(e) => updateParam(p.id, { animTarget: parseFloat(e.target.value) || 0 })}
                          className="w-20 bg-slate-950 border border-slate-700 text-sky-300 font-mono text-xs px-1.5 py-0.5 rounded focus:outline-none focus:border-sky-500 text-right font-bold"
                        />
                      </div>
                      <input
                        type="range"
                        min={p.min}
                        max={p.max}
                        step="any"
                        value={p.animTarget}
                        onChange={(e) => updateParam(p.id, { animTarget: parseFloat(e.target.value) || 0 })}
                        className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-1">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Duração: {animRunTime}s</label>
              <input
                type="range"
                min={animRunTimeRange[0]}
                max={animRunTimeRange[1]}
                step="any"
                value={animRunTime}
                onChange={(e) => setAnimRunTime(parseFloat(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Cor do Gráfico:</label>
              <select
                value={animColor}
                onChange={(e) => setAnimColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 font-semibold text-xs p-1.5 rounded-xl focus:outline-none focus:border-sky-500"
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
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            Renderizar no Manim Studio
          </button>
        </div>
      </div>

      {/* Right Canvas Display & Keypad Panel */}
      <div className="flex-1 flex flex-col gap-3 sm:gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl backdrop-blur-md">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-sky-400 animate-pulse flex-shrink-0"></div>
            <span className="text-xs sm:text-sm font-bold text-slate-200 truncate">Plano Cartesiano 2D</span>
            {hoverCoords && (
              <span className="text-[10px] sm:text-xs bg-slate-800 text-sky-400 font-mono px-2 py-0.5 rounded-md border border-slate-700 hidden sm:inline">
                x: {hoverCoords.x.toFixed(2)}, y: {hoverCoords.y.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setZoomScale((prev) => prev * 1.25)}
              className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all border border-slate-700"
              title="Zoom In (Sem Limites)"
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setZoomScale((prev) => prev * 0.8)}
              className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all border border-slate-700"
              title="Zoom Out (Sem Limites)"
            >
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all border border-slate-700"
              title="Resetar Câmera & Zoom"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Canvas Viewport */}
        <div ref={containerRef} className="relative flex-1 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[260px] sm:min-h-[380px] lg:min-h-[440px]">
          <canvas
            ref={canvasRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
          />
        </div>

        {/* Virtual Keypad Component */}
        {showKeypad && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-inner flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setKeypadTab('123')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    keypadTab === '123' ? 'bg-sky-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  123
                </button>
                <button
                  onClick={() => setKeypadTab('fx')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    keypadTab === 'fx' ? 'bg-sky-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  f(x)
                </button>
                <button
                  onClick={() => setKeypadTab('abc')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    keypadTab === 'abc' ? 'bg-sky-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  abc
                </button>
              </div>
              <button
                onClick={() => setShowKeypad(false)}
                className="text-xs text-slate-400 hover:text-white font-bold px-2 py-0.5 rounded bg-slate-900"
              >
                ✕ Fechar
              </button>
            </div>

            {keypadTab === '123' && (
              <div className="grid grid-cols-6 gap-1.5">
                {['x', 'y', 'a', 'b', '^', 'sqrt('].map((k) => (
                  <button key={k} onClick={() => insertKey(k)} className="p-2 bg-slate-900 hover:bg-slate-800 text-sky-300 font-mono text-xs font-bold rounded-lg border border-slate-800">
                    {k}
                  </button>
                ))}
                {['7', '8', '9', '/', '*', '-'].map((k) => (
                  <button key={k} onClick={() => insertKey(k)} className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs font-bold rounded-lg border border-slate-800">
                    {k}
                  </button>
                ))}
                {['4', '5', '6', '+', '(', ')'].map((k) => (
                  <button key={k} onClick={() => insertKey(k)} className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs font-bold rounded-lg border border-slate-800">
                    {k}
                  </button>
                ))}
                {['1', '2', '3', '0', '.', '='].map((k) => (
                  <button key={k} onClick={() => insertKey(k)} className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs font-bold rounded-lg border border-slate-800">
                    {k}
                  </button>
                ))}
                <button onClick={() => insertKey('CLEAR')} className="col-span-3 p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-mono text-xs font-bold rounded-lg border border-rose-800/40">
                  LIMPAR
                </button>
                <button onClick={() => insertKey('BACKSPACE')} className="col-span-3 p-2 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 font-mono text-xs font-bold rounded-lg border border-amber-800/40">
                  ⌫ APAGAR
                </button>
              </div>
            )}

            {keypadTab === 'fx' && (
              <div className="grid grid-cols-4 gap-1.5">
                {['sin(', 'cos(', 'tg(', 'exp('].map((k) => (
                  <button key={k} onClick={() => insertKey(k)} className="p-2 bg-slate-900 hover:bg-slate-800 text-sky-300 font-mono text-xs font-bold rounded-lg border border-slate-800">
                    {k}
                  </button>
                ))}
                {['log(', 'ln(', 'abs(', 'pi'].map((k) => (
                  <button key={k} onClick={() => insertKey(k)} className="p-2 bg-slate-900 hover:bg-slate-800 text-sky-300 font-mono text-xs font-bold rounded-lg border border-slate-800">
                    {k}
                  </button>
                ))}
                {['sen⁻¹(', 'cos⁻¹(', 'tg⁻¹(', 'e'].map((k) => (
                  <button key={k} onClick={() => insertKey(k)} className="p-2 bg-slate-900 hover:bg-slate-800 text-sky-300 font-mono text-xs font-bold rounded-lg border border-slate-800">
                    {k}
                  </button>
                ))}
              </div>
            )}

            {keypadTab === 'abc' && (
              <div className="grid grid-cols-7 gap-1">
                {['a', 'b', 'c', 'd', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w'].map((k) => (
                  <button key={k} onClick={() => insertKey(k)} className="p-2 bg-slate-900 hover:bg-slate-800 text-sky-300 font-mono text-xs font-bold rounded-lg border border-slate-800">
                    {k}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
