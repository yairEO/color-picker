import { HSLAColor } from './types';

interface SliderOptions {
  name: string;
  min?: number;
  max?: number;
  value: number;
}

export function scope(this: import('./color-picker').default): string;
export function slider(options: SliderOptions): string;
export function value(this: import('./color-picker').default, color: HSLAColor): string;
export function swatches(this: import('./color-picker').default, swatches: string[], initialSwatches: string[]): string;
export function swatch(color: string, isLocked: boolean): string;