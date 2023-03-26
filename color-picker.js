/**
  * @yaireo/color-picker - Lightweight javascript color picker
  *
  * @version v0.12.0
  * @homepage https://yaireo.github.io/color-picker
  */

/**
  * @yaireo/color-picker - Lightweight javascript color picker
  *
  * @version v0.11.0
  * @homepage https://yaireo.github.io/color-picker
  */

/**
  * @yaireo/color-picker - Lightweight javascript color picker
  *
  * @version v0.10.3
  * @homepage https://yaireo.github.io/color-picker
  */

/**
  * @yaireo/color-picker - Lightweight javascript color picker
  *
  * @version v0.10.2
  * @homepage https://yaireo.github.io/color-picker
  */

/**
  * @yaireo/color-picker - Lightweight javascript color picker
  *
  * @version v0.10.1
  * @homepage https://yaireo.github.io/color-picker
  */


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
    return { h:h * 360, s:s * 100, l:l * 100, a }
  };

  function scope() {
    const {h,s,l,a} = this.color;
    return `
    <div class='color-picker'>
      ${slider({ name:"hue"       , value:h, max:"360"  })}
      ${slider({ name:"saturation", value:s             })}
      ${slider({ name:"lightness" , value:l, max:50     })}
      ${slider({ name:"alpha"     , value:a             })}
      <output></output>
      ${value(this.color)}
    </div>
  `
  }
  function slider({ name, min, max, value }){
    return `<div class="range color-picker__${name}" title="${name}">
            <input type="range" name="${name}" value="${value}" min="${min||0}" max="${max||100}">
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
    this.color = this.getHSLA() || { h:0, s:0, l:0, a:1 };
    this.DOM = {};
    this.init();
  }
  ColorPicker.prototype = {
    templates,
    getHSLA(color = this.settings.color ){
      color = any_to_hex(color);
      color = hex_rgba(color);
      return rgba_hsla(color)
    },
    onInput(e){
      const {name, value, type} = e.target;
      type == 'range' && this.updateColor(name, value);
    },
    updateColor(name, value){
      this.DOM.scope.style.setProperty(`--${name}`, value);
    },
    bindEvents(){
      this.DOM.scope.addEventListener("input", this.onInput.bind(this));
    },
    init(){
      const template = this.templates.scope.call(this);
      this.DOM.scope = parseHTML(template);
      this.bindEvents();
    }
  };

  return ColorPicker;

})));
