import { HSLAColor } from './types';

export interface ColorHistory {
  _value: HSLAColor[];
  readonly pop: HSLAColor;
  readonly previous: HSLAColor;
  last: HSLAColor;
  undo(): HSLAColor | undefined;
}

export default function history(this: import('./color-picker').default): ColorHistory;