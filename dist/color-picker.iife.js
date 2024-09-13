
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var colorPicker = (function (exports) {
  'use strict';

  var parseHTML = (str) => {
    var parser = new DOMParser(),
        node   = parser.parseFromString(str.trim(), "text/html");
    return node.body.firstElementChild
  };

  var DEFAULTS = {
    color: 'white',
    onInput: _=>_,
    onChange: _=>_,
    buttons: {
      undo: {
        icon: '↶',
        title: 'Undo'
      },
      format: {
        icon: '⇆',
        title: 'Switch Color Format'
      },
      add: {
        icon: '+',
        title: 'Add to Swatches'
      }
    }
  };

  const CSStoHEX = hex => hex.match(/\w\w/g);
  const CSStoRGBA = rgba => rgba.match(/\((.*)\)/)[1].split(',').map(Number);
  const CSStoHSLA = hsla => Object.assign([0,0,0,1], hsla.match(/\((.*)\)/)[1].split(',').map((v,i) => i != 3 ? parseFloat(v) : v.includes('%') ? parseFloat(v) : parseFloat(v)*100 ));
  const HSLAtoCSS = hsla => `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a}%)`;
  const roundNumber = number => number.toFixed(1).replace('.0', '');
  const hex_rgba = hex => {
    const [rr, gg, bb, aa] = CSStoHEX(hex),
          [r,g,b] = [rr,gg,bb].map(v => parseInt(v, 16)),
          alpha = aa ? (parseInt(aa, 16) / 255).toFixed(2) : 1;
    return `rgba(${r},${g},${b},${alpha})`
  };
  const any_to_hex = str => {
    var ctx = document.createElement("canvas").getContext("2d"),
        output;
  	ctx.fillStyle = str;
  	output = ctx.fillStyle;
    return output[0] == '#' ? output : rgba_hex(output)
  };
  const rgba_hex = rgba => {
    const [r,g,b,a] = CSStoRGBA(rgba),
          hex = "#" + [r,g,b].map(v => v.toString(16).padStart(2, '0')).join('');
    return rgba.length == 3 ? hex : hex + Math.round(a * 255).toString(16).padStart(2, '0')
  };
  const rgba_hsla = rgba => {
    let [r,g,b,a] = CSStoRGBA(rgba);
    r = r / 255;
    g = g / 255;
    b = b / 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min,
        h = 0,
        s = 0,
        l = ((max + min) / 2).toPrecision(5);
    if (d){
      s = l > 0.5
        ? d / (2 - max - min)
        : d / (max + min);
      h = max == r
        ? (g - b) / d + (g < b ? 6 : 0)
        : max == g
          ? h = (b - r) / d + 2
          : h = (r - g) / d + 4;
      h /= 6;
    }
    return {
      h: roundNumber(h * 360),
      s: roundNumber(s * 100),
      l: roundNumber(l * 100),
      a: roundNumber(a * 100)
    }
  };
  const changeColorFormat = (color, format) => {
    format = (format+"").toLowerCase();
    color = any_to_hex(color);
    return format == 'hex'
        ? color
        : format.startsWith('hsl')
          ? HSLAtoCSS( rgba_hsla( hex_rgba(color) ) )
          : format.startsWith('rgb')
            ? hex_rgba(color)
            : color
  };

  function scope() {
    const {h,s,l,a} = this.color;
    const className = `color-picker ${this.settings.className||''}`.trim();
    return `
    <div class='${className}'>
      ${slider({ name:"hue", value:h, max:"360" })}
      ${slider({ name:"saturation", value:s })}
      ${slider({ name:"lightness", value:l })}
      ${slider({ name:"alpha", value:a })}
      <output></output>
      ${value.call(this, this.color)}
      ${this.swatches ? swatches$1.call(this, this.swatches, this.initialSwatches) : ''}
    </div>
  `
  }
  function slider({ name, min = 0, max = 100, value }){
    return `<div class="range color-picker__${name}" title="${name}" style="--min:${min}; --max:${max};">
            <input type="range" name="${name}" value="${value}" min="${min}" max="${max}">
            <output></output>
            <div class='range__progress'></div>
          </div>`
  }
  function value( color ){
    const { buttons:{undo, format} } = this.settings;
    return `
    <div class='color-picker__value cp-checkboard'>
      <input name='value' inputmode='decimal' placeholder='CSS Color' value='${any_to_hex(HSLAtoCSS(color))}'>
      <button title='${undo.title}' name="undo">${undo.icon}</button>
      <button title='${format.title}' name='format'>${format.icon}</button>
      <div></div>
    </div>
  `
  }
  function swatches$1(swatches, initialSwatches){
    const { buttons:{add} } = this.settings;
    return `
    <div class='color-picker__swatches' style='--initial-len:${initialSwatches.length}'>
      <button name='addSwatch' title='${add.title}'>${add.icon}</button>
      ${swatches.map(color => swatch(color, initialSwatches.includes(color))).join('')}
    </div>
  `
  }
  function swatch(color, isLocked){
    return `<div class="cp-checkboard color-picker__swatch" title="${color}" style="--c:${color}">${isLocked ? '' : '<button name="removeSwatch">&times;</button>'}</div>`
  }

  var templates = /*#__PURE__*/Object.freeze({
    __proto__: null,
    scope: scope,
    slider: slider,
    swatch: swatch,
    swatches: swatches$1,
    value: value
  });

  function bindEvents(){
    [
      ['scope', 'input' , onInput],
      ['scope', 'change', onRangeChange],
      ['scope', 'click' , onButtonClick],
      ['scope', 'wheel' , onWheelMove],
      ['value', 'change', onValueChange],
    ].forEach(([elm, event, cb]) =>
      this.DOM[elm].addEventListener(event,  cb.bind(this), {pasive:false})
    );
    window.addEventListener('storage', onStorage.bind(this));
    if( this.settings.onClickOutside ){
      document.body.addEventListener('click', onClickOutside.bind(this));
      window.addEventListener('keydown', onkeydown.bind(this));
    }
  }
  function onStorage(){
    this.syncGlobalSwatchesWithLocal();
  }
  function onWheelMove(e){
    e.preventDefault();
    const { value, max } = e.target,
          delta = Math.sign(e.deltaY) * -1;
    if( value && max ){
      e.target.value = Math.min(Math.max(+value + delta, 0), +max);
      onInput.call(this, e);
    }
  }
  function onkeydown(e){
    if( e.key == 'Escape' )
      this.settings.onClickOutside(e);
  }
  function onClickOutside(e){
    if( !this.DOM.scope.contains(e.target) )
      this.settings.onClickOutside(e);
  }
  function onInput(e){
    const {name, value, type} = e.target;
    if( type == 'range' ){
      this.setColor({...this.color, [name[0]]: +value});
    }
  }
  function onRangeChange(e){
    const { type } = e.target;
    if( type == 'range' || type == 'text' ){
      this.history.last = this.color;
    }
  }
  function onValueChange(e){
    this.setColor( this.getHSLA(e.target.value) );
    this.DOM.value.blur();
  }
  function onButtonClick(e){
    const { name, parentNode:pNode, classList, title } = e.target;
    if( name == 'format' )
      this.swithFormat();
    else if( name == 'undo' )
      this.history.undo();
    else if( name == 'addSwatch' )
      this.addSwatch();
    else if( name == 'removeSwatch' )
      this.removeSwatch(pNode, pNode.title);
    else if( classList.contains('color-picker__swatch') && title ){
      this.history.last = this.color;
      this.setColor( this.getHSLA(title) );
    }
  }

  var events = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bindEvents: bindEvents
  });

  function history(){
    const historyChange = () => this.settings.onChange(this.CSSColor);
    const setColor = this.setColor.bind(this);
    return {
      _value: [this.color],
      get pop(){
        return this._value.pop()
      },
      get previous(){
        return this._value[this._value.length - 2]
      },
      set last( item ){
        this._value.push(item);
        historyChange();
      },
      undo(){
        if( this._value.length > 1 ){
          this.pop;
          let last = this._value[this._value.length - 1];
          setColor(last);
          historyChange();
          return last
        }
      }
    }
  }

  const swatchesIncludes = (swatches, color) => swatches.some(swatch => any_to_hex(swatch) == any_to_hex(color));
  const storeKey = '@yaireo/color-picker/swatches';
  function getSetGlobalSwatches(data){
    const _store = this.settings.swatchesLocalStorage,
          customKey = typeof _store == 'string' ? _store : '';
    if ( _store && data ){
      localStorage.setItem(storeKey + customKey, data.join(';'));
      dispatchEvent( new Event('storage') );
    }
    return localStorage[storeKey + customKey]?.split(';').filter(String) || []
  }
  function syncGlobalSwatchesWithLocal(){
    this.sharedSwatches = this.getSetGlobalSwatches();
    this.swatches = this.sharedSwatches.concat(this.initialSwatches);
    this.DOM.swatches && setTimeout(()=>{
      const template = parseHTML(this.templates.swatches.call(this, this.swatches, this.initialSwatches));
      this.DOM.swatches.replaceWith(template);
      this.DOM.swatches = template;
    }, 500);
  }
  function addSwatch( color = this.CSSColor ){
    if( swatchesIncludes(this.swatches, color) ) return
    const swatchElm = parseHTML( this.templates.swatch(color) );
    swatchElm.classList.add('cp_remove');
    this.DOM.swatches.prepend(swatchElm);
    setTimeout(() => swatchElm.classList.remove('cp_remove'), 0);
    this.swatches.unshift(color);
    this.sharedSwatches.unshift(color);
    this.getSetGlobalSwatches(this.sharedSwatches);
  }
  function removeSwatch( swatchElm, color ){
    swatchElm.classList.add('cp_remove');
    setTimeout(() => swatchElm.remove(), 200);
    const notColor = swatch => swatch != color;
    this.swatches = this.swatches.filter(notColor);
    this.sharedSwatches = this.sharedSwatches.filter(notColor);
    this.getSetGlobalSwatches(this.sharedSwatches);
  }

  var swatches = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addSwatch: addSwatch,
    getSetGlobalSwatches: getSetGlobalSwatches,
    removeSwatch: removeSwatch,
    syncGlobalSwatchesWithLocal: syncGlobalSwatchesWithLocal
  });

  function isObject(obj) {
    return (obj+"") === "[object Object]"
  }

  function ColorPicker(settings){
    this.settings = Object.assign({}, DEFAULTS, settings);
    const {color, defaultFormat, swatches} = this.settings;
    this.DOM = {};
    this.sharedSwatches = this.getSetGlobalSwatches();
    this.initialSwatches = swatches || [];
    this.swatches = swatches && this.sharedSwatches.concat(this.initialSwatches);
    this.color = changeColorFormat(color, defaultFormat);
    this.history = history.call(this);
    this.init();
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
    getHSLA( color ){
      let result;
      if( !color ) return
      if( isObject(color) && Object.keys(color).join('').startsWith('hsl'))
        return color
      this.colorFormat = this.getColorFormat(color);
      if( !color.indexOf('hsla') ){
        result = CSStoHSLA(color);
        result = { h:result[0], s:result[1], l:result[2], a:result[3] };
      }
      else {
        color = any_to_hex(color);
        color = hex_rgba(color);
        result = rgba_hsla(color);
      }
      return result
    },
    swithFormat(){
      const _cf = this.colorFormat;
      switch( _cf ){
        case '':
        case 'hex':
          this.colorFormat = 'rgba';
          break
        case 'rgba':
          this.colorFormat = 'hsla';
          break
        case 'hsla':
          this.colorFormat = 'hex';
          break
      }
      this.setCSSColor();
      this.DOM.value.value = this.CSSColor;
    },
    updateRangeSlider(name, value){
      const elm = this.DOM.scope.querySelector(`input[name="${name}"]`);
      if( !elm ) return
      elm.value = value;
      elm.parentNode.style.setProperty('--value', value);
      elm.parentNode.style.setProperty('--text-value', JSON.stringify(""+Math.round(value)));
      this.updateCSSVar(name, value);
    },
    setCSSColor(){
      this.CSSColor = any_to_hex( HSLAtoCSS(this.color) );
      if( this.colorFormat == 'rgba' )
        this.CSSColor = hex_rgba(this.CSSColor);
      else if( this.colorFormat == 'hsla' )
        this.CSSColor = HSLAtoCSS(this.color);
      this.DOM.scope && this.DOM.scope.setAttribute("data-color-format", this.colorFormat);
      this.settings.onInput(this.CSSColor);
    },
    setColor( value ){
      if( !value ) return
      value = this.getHSLA(value);
      this.color = value;
      this.setCSSColor();
      this.DOM.scope && this.updateAllCSSVars();
      if( this.DOM.value  )
        this.DOM.value.value = this.CSSColor;
    },
    updateCSSVar(name, value){
      this.DOM.scope.style.setProperty(`--${name}`, value);
    },
    updateAllCSSVars(){
      const hsla = this.NamedHSLA(this.color);
      Object.entries(hsla).forEach(([k, v]) => {
        this.updateRangeSlider(k, v);
      });
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
      const template = this.templates.scope.call(this);
      this.DOM.scope = parseHTML(template);
      this.DOM.value = this.DOM.scope.querySelector('input[name="value"]');
      this.DOM.swatches = this.DOM.scope.querySelector('.color-picker__swatches');
    },
    init(){
      this.build();
      this.setColor(this.color);
      this.bindEvents();
    }
  };

  exports.CSStoHSLA = CSStoHSLA;
  exports.HSLAtoCSS = HSLAtoCSS;
  exports.any_to_hex = any_to_hex;
  exports.changeColorFormat = changeColorFormat;
  exports.default = ColorPicker;
  exports.hex_rgba = hex_rgba;
  exports.rgba_hsla = rgba_hsla;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
//# sourceMappingURL=color-picker.iife.js.map
