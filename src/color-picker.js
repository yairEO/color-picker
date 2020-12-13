import parseHTML from './utils/parseHTML'
import DEFAULTS from './defaults'
import * as templates from './templates'
import { any_to_hex, hex_rgba, rgba_hsla, CSStoHSLA} from './utils/convertColors'

function ColorPicker(settings){
  this.settings = Object.assign({}, DEFAULTS, settings)
  this.color = this.getHSLA() || { h:0, s:0, l:0, a:100 }
  this.DOM = {}
  this.init()
}

ColorPicker.prototype = {
  templates,

  // normalizes any color to HSLA
  getHSLA(color = this.settings.color ){
    let result

    console.log(color)

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
      this.updateColor(name, value)

      e.target.parentNode.style.setProperty('--value',value);
      e.target.parentNode.style.setProperty('--text-value', JSON.stringify(value))
    }
  },

  updateColor(name, value){
    this.DOM.scope.style.setProperty(`--${name}`, value)
  },

  bindEvents(){
    this.DOM.scope.addEventListener("input", this.onInput.bind(this))
  },

  /**
   * manually run the "input" callback for all color inputs range sliders
   */
  initialUpdate(){
    this.DOM.scope.querySelectorAll('input[type="range"]').forEach((elm) => this.updateColor(elm.name, elm.value))
  },

  init(){
    const template = this.templates.scope.call(this)
    this.DOM.scope = parseHTML(template)

    this.initialUpdate()
    this.bindEvents()
  }
}

export default ColorPicker