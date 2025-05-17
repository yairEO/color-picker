export function CSStoHEX(hex: any): any;
export function CSStoRGBA(rgba: any): any;
export function CSStoHSLA(hsla: any): any;
export function HSLAtoCSS(hsla: any): string;
export function hex_rgba(hex: any): string;
export function any_to_hex(str: any): string | CanvasGradient | CanvasPattern;
export function rgba_hex(rgba: any): string;
export function rgba_hsla(rgba: any): {
    h: any;
    s: any;
    l: any;
    a: any;
};
export function hexToHsl(hex: any): {
    h: any;
    s: any;
    l: any;
    a: any;
};
export function changeColorFormat(color: string, format: string): string;
