import parseHTML from './utils/parseHTML'
import DEFAULTS from './defaults'
import * as templates from './templates'
import * as events from './events'
import history from './history'
import * as swatches from './swatches'
import isObject from './utils/isObject'
import {any_to_hex, hex_rgba, rgba_hsla, CSStoHSLA, HSLAtoCSS, changeColorFormat} from './utils/convertColors'

var raf = window.requestAnimationFrame || (cb => window.setTimeout(cb, 1000 / 60))

function ColorPicker(settings){
  this.settings = Object.assign({}, DEFAULTS, settings)

  const {color, defaultFormat, swatches} = this.settings

  this.DOM = {}

  this.sharedSwatches = this.getSetGlobalSwatches() // only this gets syncs with the localstorage (if chosen to)
  this.initialSwatches = swatches || []
  this.swatches = swatches && this.sharedSwatches.concat(this.initialSwatches) // global (shared) via localstorage
  this.color = changeColorFormat(color, defaultFormat)
  this.history = history.call(this)
  this.init()
}

ColorPicker.prototype = {
  templates,
  ...swatches,
  ...events,

  getColorFormat( color ){
    return color[0] == '#'
        ? 'hex'
        : !color.indexOf('hsl')
          ? 'hsla'
          : !color.indexOf('rgb')
            ? 'rgba'
            : ''
  },

  /**
   * normalizes any color to HSLA-Object
   * @param {String} color
   */
  getHSLA( color ){
    let result

    if( !color ) return

    // if color argument is already an HSLA object, return it as-is
    if( isObject(color) && Object.keys(color).join('').startsWith('hsl'))
      return color

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
    elm.parentNode.style.setProperty('--text-value', JSON.stringify(""+Math.round(value)))

    this.updateCSSVar(name, value)
  },

  /**
   * sets the CSS color text-value according to the current format
   */
  setCSSColor(){
    this.CSSColor = any_to_hex( HSLAtoCSS(this.color) )

    if( this.colorFormat == 'rgba' )
      this.CSSColor = hex_rgba(this.CSSColor)

    else if( this.colorFormat == 'hsla' )
      this.CSSColor = HSLAtoCSS(this.color)

    this.DOM.scope && this.DOM.scope.setAttribute("data-color-format", this.colorFormat)
    this.settings.onInput(this.CSSColor)
  },

  /**
   *
   * @param {Object} hsla {h,s,l,a}
   */
  setColor( value ){
    if( !value ) return

    value = this.getHSLA(value)

    this.color = value
    this.setCSSColor()
    this.DOM.scope && this.updateAllCSSVars()

    if( this.DOM.value  )
      this.DOM.value.value = this.CSSColor
  },

  updateCSSVar(name, value){
    // this.DOM.value
    this.DOM.scope.style.setProperty(`--${name}`, value)
  },

  updateAllCSSVars(){
    const hsla = this.NamedHSLA(this.color)
    Object.entries(hsla).forEach(([k, v]) => {
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

  build(){
    const template = this.templates.scope.call(this)
    this.DOM.scope = parseHTML(template)
    this.DOM.value = this.DOM.scope.querySelector('input[name="value"]')
    this.DOM.swatches = this.DOM.scope.querySelector('.color-picker__swatches')
  },

  init(){
    this.build()
    this.setColor(this.color)
    // this.updateAllCSSVars()
    this.bindEvents()
  }
}

export { any_to_hex, hex_rgba, rgba_hsla, CSStoHSLA, HSLAtoCSS, changeColorFormat }

export default ColorPicker