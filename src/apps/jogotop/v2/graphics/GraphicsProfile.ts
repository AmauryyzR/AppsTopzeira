import { GraphicsProfileConfig, GraphicsProfileType } from '../types';

export const PROFILE_CONFIGS: Record<GraphicsProfileType, GraphicsProfileConfig> = {
  'mobile-low': {
    name: 'mobile-low',
    maxDpr: 1.0,
    flowerCount: 80,
    tuftCount: 120,
    butterflyCount: 0,
    targetFps: 30,
    maxDrawCalls: 120,
    maxTriangles: 180000,
  },
  mobile: {
    name: 'mobile',
    maxDpr: 1.25,
    flowerCount: 140,
    tuftCount: 200,
    butterflyCount: 4,
    targetFps: 30,
    maxDrawCalls: 120,
    maxTriangles: 180000,
  },
  desktop: {
    name: 'desktop',
    maxDpr: 1.5,
    flowerCount: 260,
    tuftCount: 360,
    butterflyCount: 7,
    targetFps: 55,
    maxDrawCalls: 180,
    maxTriangles: 300000,
  },
};

export function resolveGraphicsProfile(): GraphicsProfileConfig {
  if (typeof window === 'undefined') {
    return PROFILE_CONFIGS.desktop;
  }

  // 1. Check URL override query parameter: ?quality=mobile-low|mobile|desktop
  const params = new URLSearchParams(window.location.search);
  const override = params.get('quality') as GraphicsProfileType | null;
  if (override && PROFILE_CONFIGS[override]) {
    return PROFILE_CONFIGS[override];
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const isTouchDevice =
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(hover: none)').matches;

  // Check for constrained device memory / logical cores
  const nav = typeof navigator !== 'undefined' ? (navigator as unknown as { deviceMemory?: number; hardwareConcurrency?: number }) : {};
  const isLowEnd =
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4);

  if (isTouchDevice || w <= 768 || Math.min(w, h) < 600) {
    if (isLowEnd || Math.min(w, h) < 400) {
      return PROFILE_CONFIGS['mobile-low'];
    }
    return PROFILE_CONFIGS.mobile;
  }

  return PROFILE_CONFIGS.desktop;
}
