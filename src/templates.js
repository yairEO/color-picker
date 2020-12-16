import { any_to_hex, HSLAtoCSS } from './utils/convertColors'

export function scope() {
  const {h,s,l,a} = this.color

  return `
    <div class='color-picker'>
      ${slider({ name:"hue", value:h, max:"360" })}
      ${slider({ name:"saturation", value:s })}
      ${slider({ name:"lightness", value:l })}
      ${slider({ name:"alpha", value:a })}
      <output></output>
      ${value(this.color)}
    </div>
  `
}

export function slider({ name, min = 0, max = 100, value }){
  return `<div class="range color-picker__${name}" title="${name}" style="--min:${min}; --max:${max}; --value:${value}; --text-value:'${value}'">
            <input type="range" name="${name}" value="${value}" min="${min}" max="${max}">
            <output></output>
            <div class='range__progress'></div>
          </div>`
}

export function value( color ){
  return `
    <div class='color-picker__value'>
      <input name='value' placeholder='CSS Color' value='${any_to_hex(HSLAtoCSS(color))}'>
      <button title='Undo' name="undo">↩</button>
      <button title='Switch color format' name='format'>⭤&nbsp;</button>
      <div></div>
    </div>
  `
}