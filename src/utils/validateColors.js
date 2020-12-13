export const isValidHex = hex => /^#[a-fA-F0-9]{6}$/.test(hex) || /^#[a-fA-F0-9]{8}$/.test(hex)

export const isValidRGBA = rgba => {
  let [r, g, b, a = 1] = rgba.slice(!rgba.indexOf("rgba") ? 5 : 4, -1).split(',')
  return [r,g,b].every(v => inRange(v, 255)) && a >= 0
}

export const inRange = (n, upperLimit) => +n >= 0 && +n <= upperLimit