import parseHTML from './utils/parseHTML'
import DEFAULTS from './defaults'
import * as templates from './templates'
import { any_to_hex, hex_rgba, rgba_hsla, CSStoHSLA, HSLAtoCSS} from './utils/convertColors'

var raf = window.requestAnimationFrame || (cb => window.setTimeout(cb, 1000 / 60))

function ColorPicker(settings){
  this.settings = Object.assign({}, DEFAULTS, settings)
  this.DOM = {}
  this.setColor( this.getHSLA() )
  this.init()
}

ColorPicker.prototype = {
  templates,

  getColorFormat( color ){
    return color[0] == '#'
        ? 'hex'
        : !color.indexOf('hsl')
          ? 'hsla'
          : !color.indexOf('rgb')
            ? 'rgba'
            : ''
  },

  // normalizes any color to HSLA
  getHSLA( color = this.settings.color ){
    let result

    this.colorFormat = this.getColorFormat(color)

    if( !color.indexOf('hsla') ){
      result = CSStoHSLA(color)
      result = { h:result[0], s:result[1], l:result[2], a:result[3] }
    }

    else{
      color = any_to_hex(color)
      color = hex_rgba(color)
      result = rgba_hsla(color)
    }

    return result
  },

  onInput(e){
    const {name, value, type} = e.target

    if( type == 'range' ){
      this.updateCSSVar(name, value)

      e.target.parentNode.style.setProperty('--value',value);
      e.target.parentNode.style.setProperty('--text-value', JSON.stringify(value))
    }

    else if( name == 'value' ){
    }
  },

  onValueChange(e){
    this.setColor( this.getHSLA(e.target.value) )
    this.updateAllCSSVars()
    this.DOM.value.blur()
  },

  onButtonClick(e){
    const { name } = e.target

    if( name == 'format' ){
      this.swithFormat()
    }
  },

  swithFormat(){
    const _cf = this.colorFormat

    switch( _cf ){
      case '':
      case 'hex':
        this.colorFormat = 'rgba'
        break
      case 'rgba':
        this.colorFormat = 'hsla'
        break
      case 'hsla':
        this.colorFormat = 'hex'
        break
    }

    // get a new "this.CSSColor" after changing the format above
    this.setCSSColor()
    this.DOM.value.value = this.CSSColor
  },

  updateRangeSlider(name, value){
    const elm = this.DOM.scope.querySelector(`input[name="${name}"]`)

    if( !elm ) return

    elm.value = value
    elm.parentNode.style.setProperty('--value', value)
    elm.parentNode.style.setProperty('--text-value', JSON.stringify(""+value).slice(0,6))
  },

  /**
   * sets the CSS color text-value according to the current format
   */
  setCSSColor(){
    this.CSSColor = any_to_hex( HSLAtoCSS(this.color) )

    if( this.colorFormat == 'rgba' )
      this.CSSColor = hex_rgba(this.CSSColor)

    else if( this.colorFormat == 'hsla' )
      this.CSSColor = HSLAtoCSS(
        rgba_hsla(
          hex_rgba(this.CSSColor)
        )
      )

    this.DOM.scope && this.DOM.scope.setAttribute("data-color-format", this.colorFormat)
  },

  /**
   *
   * @param {Object} hsla {h,s,l,a}
   */
  setColor( hsla ){
    this.color = hsla
    this.setCSSColor()
  },

  setColorPart(name, value){
    this.setColor({...this.color, [name[0]]: +value})
    this.DOM.value.value = this.CSSColor
  },

  updateCSSVar(name, value){
    // this.DOM.value
    this.DOM.scope.style.setProperty(`--${name}`, value)
    this.setColorPart(name, value)
  },

  updateAllCSSVars(){
    const hsla = this.NamedHSLA(this.color)
    Object.entries(hsla).forEach(([k, v]) => {
      this.updateCSSVar(k, v)
      this.updateRangeSlider(k, v)
    })
  },

  NamedHSLA( hsla ){
    return {
      "hue"        : hsla.h,
      "saturation" : hsla.s,
      "lightness"  : hsla.l,
      "alpha"      : hsla.a
    }
  },

  bindEvents(){
    this.DOM.scope.addEventListener("input", this.onInput.bind(this))
    this.DOM.scope.addEventListener("click", this.onButtonClick.bind(this))
    this.DOM.value.addEventListener("change", this.onValueChange.bind(this))
    name="format"
  },

  init(){
    const template = this.templates.scope.call(this)
    this.DOM.scope = parseHTML(template)
    this.DOM.value = this.DOM.scope.querySelector('input[name="value"]')

    this.updateAllCSSVars()
    this.bindEvents()
  }
}

export default ColorPicker