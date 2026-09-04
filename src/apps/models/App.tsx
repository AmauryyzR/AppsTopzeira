import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ModelStudioEngine } from './engine/ModelStudioEngine';
import { ModelStats, ShadingMode } from './engine/types';
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID } from './models';
import { StudioHeader } from './components/StudioHeader';
import { ModelInspector } from './components/ModelInspector';
import { StudioHelpModal } from './components/StudioHelpModal';
import { exportToGLB } from './toolkit/GLTFExportHelper';

export default function ModelsApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ModelStudioEngine | null>(null);

  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [shadingMode, setShadingMode] = useState<ShadingMode>('material');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showShadows, setShowShadows] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [stats, setStats] = useState<ModelStats | null>(null);

  const activeModel = AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  // Initialize 3D Engine
  useEffect(() => {
    const prevTitle = document.title;
    document.title = '3D Model Studio · Blender Viewport';

    if (containerRef.current) {
      const engine = new ModelStudioEngine(containerRef.current, (newStats) => {
        setStats(newStats);
      });
      engineRef.current = engine;

      // Load initial model (Tree)
      const initialModelDef = AVAILABLE_MODELS.find((m) => m.id === DEFAULT_MODEL_ID) || AVAILABLE_MODELS[0];
      const modelObj = initialModelDef.create();
      engine.setModel(modelObj, true);
    }

    // Keyboard shortcut [F] to Frame / Reset Camera
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'f' || e.key === 'F') {
        engineRef.current?.frameModel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      engineRef.current?.dispose();
      engineRef.current = null;
      document.title = prevTitle;
    };
  }, []);

  // Handle Model Change
  const handleSelectModel = useCallback((modelId: string) => {
    setSelectedModelId(modelId);
    const modelDef = AVAILABLE_MODELS.find((m) => m.id === modelId);
    if (modelDef && engineRef.current) {
      const obj = modelDef.create();
      engineRef.current.setModel(obj, true);
    }
  }, []);

  // Shading Mode Change
  const handleSelectShadingMode = useCallback((mode: ShadingMode) => {
    setShadingMode(mode);
    engineRef.current?.setShadingMode(mode);
  }, []);

  // Toggle Grid
  const handleToggleGrid = useCallback(() => {
    setShowGrid((prev) => {
      const next = !prev;
      engineRef.current?.setGridVisible(next);
      return next;
    });
  }, []);

  // Toggle Shadows
  const handleToggleShadows = useCallback(() => {
    setShowShadows((prev) => {
      const next = !prev;
      engineRef.current?.setShadowsVisible(next);
      return next;
    });
  }, []);

  // Toggle Auto Rotate
  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => {
      const next = !prev;
      engineRef.current?.setAutoRotate(next);
      return next;
    });
  }, []);

  // Reset Camera
  const handleResetCamera = useCallback(() => {
    engineRef.current?.frameModel();
  }, []);

  // Export to .GLB
  const handleExportGLB = useCallback(async () => {
    if (!engineRef.current) return;
    setIsExporting(true);
    try {
      const modelGroup = engineRef.current.getModelGroup();
      await exportToGLB(modelGroup, `${activeModel.id}.glb`);
    } catch (err) {
      console.error('Failed to export GLB:', err);
    } finally {
      setIsExporting(false);
    }
  }, [activeModel.id]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#353942] select-none touch-none font-sans text-slate-100">
      <style>{`
        canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          touch-action: none !important;
        }
      `}</style>

      {/* 3D WebGL Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Top Floating Studio Header */}
      <StudioHeader
        models={AVAILABLE_MODELS}
        selectedModelId={selectedModelId}
        onSelectModel={handleSelectModel}
        shadingMode={shadingMode}
        onSelectShadingMode={handleSelectShadingMode}
        showGrid={showGrid}
        onToggleGrid={handleToggleGrid}
        showShadows={showShadows}
        onToggleShadows={handleToggleShadows}
        autoRotate={autoRotate}
        onToggleAutoRotate={handleToggleAutoRotate}
        onResetCamera={handleResetCamera}
        onOpenHelp={() => setIsHelpOpen(true)}
        onExportGLB={handleExportGLB}
        isExporting={isExporting}
      />

      {/* Bottom-Left Model Inspector */}
      <ModelInspector model={activeModel} stats={stats} />

      {/* Help Modal */}
      <StudioHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
