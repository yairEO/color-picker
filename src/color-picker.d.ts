import { ColorPickerSettings } from './defaults';
import { HSLAColor, NamedHSLAColor } from './types';

declare class ColorPicker {
  /**
   * Current color settings
   */
  settings: ColorPickerSettings;

  /**
   * DOM elements used by the color picker
   */
  DOM: {
    scope?: HTMLElement;
    value?: HTMLInputElement;
    swatches?: HTMLElement;
    [key: string]: HTMLElement | undefined;
  };

  /**
   * Current color in HSLA format
   */
  color: HSLAColor;

  /**
   * Current color format ('hex', 'rgba', or 'hsla')
   */
  colorFormat: string;

  /**
   * Current color in CSS string format
   */
  CSSColor: string;

  /**
   * Shared swatches across instances
   */
  sharedSwatches: string[];

  /**
   * Initial swatches provided in settings
   */
  initialSwatches: string[];

  /**
   * Combined swatches (shared + initial)
   */
  swatches: string[];

  /**
   * Color history for undo functionality
   */
  history: any;

  /**
   * Creates a new ColorPicker instance
   * @param settings Configuration options
   */
  constructor(settings: Partial<ColorPickerSettings>);

  /**
   * Gets the format of a color string
   * @param color Color string to check
   * @returns Format of the color ('hex', 'hsla', 'rgba', or '')
   */
  getColorFormat(color: string): string;

  /**
   * Normalizes any color to HSLA object
   * @param color Color in any supported format
   * @returns HSLA object representation of the color
   */
  getHSLA(color: string | HSLAColor): HSLAColor;

  /**
   * Switches between color formats (hex -> rgba -> hsla -> hex)
   */
  switchFormat(): void;

  /**
   * Updates a range slider with a new value
   * @param name Name of the slider
   * @param value New value
   */
  updateRangeSlider(name: string, value: number): void;

  /**
   * Sets the CSS color text-value according to the current format
   */
  setCSSColor(): void;

  /**
   * Sets a new color
   * @param value New color value in any supported format
   */
  setColor(value: string | HSLAColor): void;

  /**
   * Updates a CSS variable
   * @param name Variable name
   * @param value New value
   */
  updateCSSVar(name: string, value: number | string): void;

  /**
   * Updates all CSS variables based on current color
   */
  updateAllCSSVars(): void;

  /**
   * Converts HSLA object to named HSLA object
   * @param hsla HSLA color object
   * @returns Named HSLA object with hue, saturation, lightness, alpha properties
   */
  NamedHSLA(hsla: HSLAColor): NamedHSLAColor;

  /**
   * Builds the DOM structure
   */
  build(): void;

  /**
   * Initializes the color picker
   */
  init(): void;
}

export default ColorPicker;