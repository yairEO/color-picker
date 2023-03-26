import parseHTML from './utils/parseHTML'
import { any_to_hex } from './utils/convertColors'

const swatchesIncludes = (swatches, color) => swatches.some(swatch => any_to_hex(swatch) == any_to_hex(color))

const storeKey = '@yaireo/color-picker/swatches'

export function getSetGlobalSwatches(data){
  // if "swatchesLocalStorage" is "false", do not save to localstorage
  const _store = this.settings.swatchesLocalStorage,
        customKey = typeof _store == 'string' ? _store : '';

  if ( _store && data ){
    localStorage.setItem(storeKey + customKey, data.join(';'))
    dispatchEvent( new Event('storage') )
  }

  // "filter(String)" clean up any empty strings
  return localStorage[storeKey + customKey]?.split(';').filter(String) || []
}

// sync instance swatches with global ones. skip duplicates
export function syncGlobalSwatchesWithLocal(){
  this.sharedSwatches = this.getSetGlobalSwatches()
  this.swatches = this.sharedSwatches.concat(this.initialSwatches)

  // reflect swatches change in the DOM (add/remove)
  // a delay is needed becasue the whole "swatches" element is replaced completely
  // if if done immediately, there will be no time for animations (add/remove) and also
  // a "click outside" event will be registered
  this.DOM.swatches && setTimeout(()=>{
    const template = parseHTML(this.templates.swatches.call(this, this.swatches, this.initialSwatches))
    this.DOM.swatches.replaceWith(template)
    this.DOM.swatches = template
  }, 500)
}

export function addSwatch( color = this.CSSColor ){
  // if already exist, abort
  if( swatchesIncludes(this.swatches, color) ) return

  // add DOM swatch node
  const swatchElm = parseHTML( this.templates.swatch(color) )
  swatchElm.classList.add('cp_remove')
  this.DOM.swatches.prepend(swatchElm)
  setTimeout(() => swatchElm.classList.remove('cp_remove'), 0)

  // save swatch to instance state
  this.swatches.unshift(color)
  this.sharedSwatches.unshift(color)

  // sync localstorage
  this.getSetGlobalSwatches(this.sharedSwatches)
}

export function removeSwatch( swatchElm, color ){
  swatchElm.classList.add('cp_remove')
  setTimeout(() => swatchElm.remove(), 200)

  const notColor = swatch => swatch != color

  this.swatches = this.swatches.filter(notColor)
  this.sharedSwatches = this.sharedSwatches.filter(notColor)

  // sync localstorage
  this.getSetGlobalSwatches(this.sharedSwatches)
}
