export default ColorPicker;
import { any_to_hex } from './utils/convertColors';
import { hex_rgba } from './utils/convertColors';
import { rgba_hsla } from './utils/convertColors';
import { CSStoHSLA } from './utils/convertColors';
import { HSLAtoCSS } from './utils/convertColors';
import { changeColorFormat } from './utils/convertColors';
declare function ColorPicker(settings: any): void;
declare class ColorPicker {
    constructor(settings: any);
    settings: any;
    DOM: {};
    sharedSwatches: any;
    initialSwatches: any;
    swatches: any;
    color: string;
    history: any;
    templates: typeof templates;
    getColorFormat(color: any): "" | "hex" | "rgba" | "hsla";
    /**
     * normalizes any color to HSLA-Object
     * @param {String} color
     */
    getHSLA(color: string): string | import("./types").HSLAColor;
    colorFormat: string;
    switchFormat(): void;
    updateRangeSlider(name: any, value: any): void;
    /**
     * sets the CSS color text-value according to the current format
     */
    setCSSColor(): void;
    CSSColor: any;
    /**
     *
     * @param {Object} hsla {h,s,l,a}
     */
    setColor(value: any): void;
    updateCSSVar(name: any, value: any): void;
    updateAllCSSVars(): void;
    NamedHSLA(hsla: any): {
        hue: any;
        saturation: any;
        lightness: any;
        alpha: any;
    };
    build(): void;
    init(): void;
}
import * as templates from './templates';
export { any_to_hex, hex_rgba, rgba_hsla, CSStoHSLA, HSLAtoCSS, changeColorFormat };
