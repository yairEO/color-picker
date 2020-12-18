import { any_to_hex, HSLAtoCSS } from './utils/convertColors'

export function scope() {
  const {h,s,l,a} = this.color
  const className = `color-picker ${this.settings.className||''}`.trim()

  return `
    <div class='${className}'>
      ${slider({ name:"hue", value:h, max:"360" })}
      ${slider({ name:"saturation", value:s })}
      ${slider({ name:"lightness", value:l })}
      ${slider({ name:"alpha", value:a })}
      <output></output>
      ${value.call(this, this.color)}
      ${this.swatches ? swatches.call(this, this.swatches, this.initialSwatches) : ''}
    </div>
  `
}

export function slider({ name, min = 0, max = 100, value }){
  return `<div class="range color-picker__${name}" title="${name}" style="--min:${min}; --max:${max};">
            <input type="range" name="${name}" value="${value}" min="${min}" max="${max}">
            <output></output>
            <div class='range__progress'></div>
          </div>`
}

export function value( color ){
  const { buttons:{undo, format} } = this.settings

  return `
    <div class='color-picker__value cp-checkboard'>
      <input name='value' inputmode='decimal' placeholder='CSS Color' value='${any_to_hex(HSLAtoCSS(color))}'>
      <button title='${undo.title}' name="undo">${undo.icon}</button>
      <button title='${format.title}' name='format'>${format.icon}</button>
      <div></div>
    </div>
  `
}

export function swatches(swatches, initialSwatches){
  const { buttons:{add} } = this.settings

  return `
    <div class='color-picker__swatches' style='--initial-len:${initialSwatches.length}'>
      <button name='addSwatch' title='${add.title}'>${add.icon}</button>
      ${swatches.map(color => swatch(color, initialSwatches.includes(color))).join('')}
    </div>
  `
}

export function swatch(color, isLocked){
  return `<div class="cp-checkboard color-picker__swatch" title="${color}" style="--c:${color}">${isLocked ? '' : '<button name="removeSwatch">&times;</button>'}</div>`
}

