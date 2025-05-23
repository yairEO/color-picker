import { HSLAColor } from '../types.ts';

/**
 * Converts CSS HEX color to array of hex values
 * @param hex Hex color string
 * @returns Array of hex values
 */
export function CSStoHEX(hex: string): string[];

/**
 * Converts CSS RGBA color to array of numeric values
 * @param rgba RGBA color string
 * @returns Array of numeric values [r, g, b, a]
 */
export function CSStoRGBA(rgba: string): number[];

/**
 * Converts CSS HSLA color to array of numeric values
 * @param hsla HSLA color string
 * @returns Array of numeric values [h, s, l, a]
 */
export function CSStoHSLA(hsla: string): number[];

/**
 * Converts HSLA object to CSS HSLA string
 * @param hsla HSLA color object
 * @returns HSLA color string
 */
export function HSLAtoCSS(hsla: HSLAColor): string;

/**
 * Converts hex color to RGBA string
 * @param hex Hex color string
 * @returns RGBA color string
 */
export function hex_rgba(hex: string): string;

/**
 * Converts any color format to hex
 * @param str Color string in any format
 * @returns Hex color string
 */
export function any_to_hex(str: string): string;

/**
 * Converts RGBA string to hex
 * @param rgba RGBA color string
 * @returns Hex color string
 */
export function rgba_hex(rgba: string): string;

/**
 * Converts RGBA string to HSLA object
 * @param rgba RGBA color string
 * @returns HSLA color object
 */
export function rgba_hsla(rgba: string): HSLAColor;

/**
 * Converts hex to HSL
 * @param hex Hex color string
 * @returns HSLA color object
 */
export function hexToHsl(hex: string): HSLAColor;

/**
 * Converts any color format to another
 * @param color Color in any format
 * @param format Target format ('hex', 'rgba', 'hsla')
 * @returns Color string in the target format
 */
export function changeColorFormat(color: string, format: string): string;