export function scope(): string;
export function slider({ name, min, max, value }: {
    name: any;
    min?: number;
    max?: number;
    value: any;
}): string;
export function value(color: any): string;
export function swatches(swatches: any, initialSwatches: any): string;
export function swatch(color: any, isLocked: any): string;
