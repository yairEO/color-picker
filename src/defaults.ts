export interface ColorPickerSettings {
  /**
   * Initial color value
   * Accepted formats: HEX(A), RGB(A), HSL(A), X11 color name
   * @default 'white'
   */
  color?: string;

  /**
   * Default rendered textual represention format
   * @default 'hex'
   */
  defaultFormat?: 'hex' | 'rgba' | 'hsla';

  /**
   * Initial class name for the component's wrapper element
   * @default ''
   */
  className?: string;

  /**
   * Color swatches array
   * Set to false to disable swatches
   * @default []
   */
  swatches?: string[] | false;

  /**
   * Save colors to localStorage for persistence across picker instances
   * @default false
   */
  swatchesLocalStorage?: boolean;

  /**
   * Buttons text & icon configuration
   */
  buttons?: {
    undo: { icon: string; title: string };
    format: { icon: string; title: string };
    add: { icon: string; title: string };
  };

  /**
   * Fired rapidly, on every range slider movement or any color change
   * @param color - The current color value in the active format
   */
  onInput?: (color: string) => void;

  /**
   * Like "onInput", but not fired while a range slider is moved
   * @param color - The current color value in the active format
   */
  onChange?: (color: string) => void;

  /**
   * Helpful when the component is used as a popup
   * @param e - The click event object
   */
  onClickOutside?: (e: MouseEvent | KeyboardEvent) => void;
}

const defaults: Partial<ColorPickerSettings> = {
  color: 'white',
  onInput: (_: string) => _,
  onChange: (_: string) => _,
  buttons: {
    undo: {
      icon: '&curvearrowleft;',
      title: 'Undo'
    },
    format: {
      icon: '&leftrightarrows;',
      title: 'Switch Color Format'
    },
    add: {
      icon: '+',
      title: 'Add to Swatches'
    }
  }
};

export default defaults;