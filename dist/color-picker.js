
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ColorPicker = factory());
}(this, (function () { 'use strict';

  var parseHTML = (str) => {
    var parser = new DOMParser(),
        node   = parser.parseFromString(str.trim(), "text/html");
    return node.body.firstElementChild
  };

  var DEFAULTS = {
    color: 'white'
  };

  const CSStoHEX = hex => hex.match(/\w\w/g);
  const CSStoRGBA = rgba => rgba.match(/\((.*)\)/)[1].split(',').map(Number);
  const CSStoHSLA = hsla => Object.assign([0,0,0,1], hsla.match(/\((.*)\)/)[1].split(',').map((v,i) => i != 3 ? parseFloat(v) : v.includes('%') ? parseFloat(v) : parseFloat(v)*100 ));
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
        l = ((max + min) / 2).toPrecision(2);
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
    return { h:h * 360, s:s * 100, l:l * 100, a:a * 100 }
  };

  function scope() {
    const {h,s,l,a} = this.color;
    return `
    <div class='color-picker'>
      ${slider({ name:"hue"       , value:h, max:"360"  })}
      ${slider({ name:"saturation", value:s             })}
      ${slider({ name:"lightness" , value:l             })}
      ${slider({ name:"alpha"     , value:a             })}
      <output></output>
      ${value(this.color)}
    </div>
  `
  }
  function slider({ name, min = 0, max = 100, value }){
    return `<div class="range color-picker__${name}" title="${name}" style="--min:${min}; --max:${max}; --value:${value}; --text-value:'${value}'">
            <input type="range" name="${name}" value="${value}" min="${min}" max="${max}">
            <output></output>
            <div class='range__progress'></div>
          </div>`
  }
  function value(color){
    return `
    <div class='color-picker__value'>
      <input name='value' value='${any_to_hex(color)}'>
    </div>
  `
  }

  var templates = /*#__PURE__*/Object.freeze({
    __proto__: null,
    scope: scope,
    slider: slider,
    value: value
  });

  function ColorPicker(settings){
    this.settings = Object.assign({}, DEFAULTS, settings);
    this.color = this.getHSLA() || { h:0, s:0, l:0, a:100 };
    this.DOM = {};
    this.init();
  }
  ColorPicker.prototype = {
    templates,
    getHSLA(color = this.settings.color ){
      let result;
      console.log(color);
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
    onInput(e){
      const {name, value, type} = e.target;
      if( type == 'range' ){
        this.updateColor(name, value);
        e.target.parentNode.style.setProperty('--value',value);
        e.target.parentNode.style.setProperty('--text-value', JSON.stringify(value));
      }
    },
    updateColor(name, value){
      this.DOM.scope.style.setProperty(`--${name}`, value);
    },
    bindEvents(){
      this.DOM.scope.addEventListener("input", this.onInput.bind(this));
    },
    initialUpdate(){
      this.DOM.scope.querySelectorAll('input[type="range"]').forEach((elm) => this.updateColor(elm.name, elm.value));
    },
    init(){
      const template = this.templates.scope.call(this);
      this.DOM.scope = parseHTML(template);
      this.initialUpdate();
      this.bindEvents();
    }
  };

  return ColorPicker;

})));
