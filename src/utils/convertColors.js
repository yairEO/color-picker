// Based on:
// https://github.com/kohrongying/hex-to-rgba/blob/master/src/helpers.js

export const CSStoHEX = hex => hex.match(/\w\w/g)
export const CSStoRGBA = rgba => rgba.match(/\((.*)\)/)[1].split(',').map(Number)
export const CSStoHSLA = hsla => Object.assign([0,0,0,1], hsla.match(/\((.*)\)/)[1].split(',').map((v,i) => i != 3 ? parseFloat(v) : v.includes('%') ? parseFloat(v) : parseFloat(v)*100 ))
export const HSLAtoCSS = hsla => `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a}%)`

const roundNumber = number => number.toFixed(1).replace('.0', '')

export const hex_rgba = hex => {
  const [rr, gg, bb, aa] = CSStoHEX(hex),
        [r,g,b] = [rr,gg,bb].map(v => parseInt(v, 16)),
        alpha = aa ? (parseInt(aa, 16) / 255).toFixed(2) : 1
  return `rgba(${r},${g},${b},${alpha})`
}

export const any_to_hex = str => {
  var ctx = document.createElement("canvas").getContext("2d"),
      output;

	ctx.fillStyle = str
	output = ctx.fillStyle

  return output[0] == '#' ? output : rgba_hex(output)
}

export const rgba_hex = rgba => {
  const [r,g,b,a] = CSStoRGBA(rgba),
        hex = "#" + [r,g,b].map(v => v.toString(16).padStart(2, '0')).join('')
  return rgba.length == 3 ? hex : hex + Math.round(a * 255).toString(16).padStart(2, '0')
}

export const rgba_hsla = rgba => {
  let [r,g,b,a] = CSStoRGBA(rgba)

  r = r / 255
  g = g / 255
  b = b / 255

  let max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      d = max - min,

      h = 0,
      s = 0,
      l = ((max + min) / 2).toPrecision(5)

  if (d){
    s = l > 0.5
      ? d / (2 - max - min)
      : d / (max + min)

    h = max == r
      ? (g - b) / d + (g < b ? 6 : 0)
      : max == g
        ? h = (b - r) / d + 2
        : h = (r - g) / d + 4

    h /= 6
  }

  return {
    h: roundNumber(h * 360),
    s: roundNumber(s * 100),
    l: roundNumber(l * 100),
    a: roundNumber(a * 100)
  }
}

export const hexToHsl = hex => rgba_hsla( hex_rgba(hex) )

/**
 * converts any color format to anoter
 * @param {String} color
 * @param {String} format ['hex', 'rgba', 'hsla']
 * @returns a color in another format
 */
export const changeColorFormat = (color, format) => {
  format = (format+"").toLowerCase()
  color = any_to_hex(color)

  return format == 'hex'
      ? color
      : format.startsWith('hsl')
        ? HSLAtoCSS( rgba_hsla( hex_rgba(color) ) )
        : format.startsWith('rgb')
          ? hex_rgba(color)
          : color
}
