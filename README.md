<p align="center">
  <a href='https://yaireo.github.io/color-picker/'>
    <img src="./demo.apng?sanitize=true" alt="color picker demo video"/>
  </a>
<p>


<p align="center">
  <a href='https://www.npmjs.com/package/@yaireo/color-picker'>
      <img src="https://badgen.net/npm/v/@yaireo/color-picker?color=red" />
  </a>
  <img src="https://badgen.net/bundlephobia/minzip/@yaireo/color-picker?color=green" />
  <img src="https://badgen.net/npm/dw/@yaireo/color-picker?color=blue" />
</p>

<h1 align="center">
  Minimal, 5KB Color-Picker in Vanila-js
</h1>


**⚠️ Supported only in modern browsers**

* Carefully crafted as lightweight as possible
* Mousewheel-suppored *range silders*
* Minimal UX for smallest screen footprint
* Supported color formats: [`x11 color codes`](https://en.wikipedia.org/wiki/X11_color_names),
`hexa`, `rgba`, `hsla`
* Positioning-engine **not included**. Use your own, or one suggested below
* Optional color swatches:
  * pre-determined values (un-removable)
  * custom color add/remove swatch
  * optional global sync with *localstorage* between picker instances

<br>

---
<br>

This color-picker component is based on my previous work with highly customizable range input (slider) component: [UI-Range](https://github.com/yairEO/ui-range)
and the power of HSLA color format infused into custom CSS properties (variables) to allow as lightweight solution as possible.

I have hand-crafted the color transformation functions to be as lightweight as possible, and kept the UI to
the minimum necessary to provide the user with a better, unified, color-picking experience which I believe is better
than the default `<input type='color'>` which looks different across browsers and OS, and does ***not*** allow modifications to a color's *alpha* (opacity) channel.

Since this component is ***only*** a color-picker, and does not transforms or interacts with any `<input type='color'>` elements on the page,
it is up to developers, if they wish, to connect it to an input and have the color-picker positioned next to it in a popup-manner.
Such behavior can be seen seen in the demo page and below, on the last section.

I advise using a `type='text'` input which can offer support for any color format (as a string) because `type='text'` cannot work with named colors such as `value='red'`.

<br>

## Install

    npm i @yaireo/color-picker

## Use

The codebase is bundled into 2 formats:

`iife` (to be used as standalone script):

```html
<script src='@yaireo/color-picker/color-picker.iife.js'></script>
<script>
  const { default:ColorPicker, any_to_hex, changeColorFormat } = window.colorPicker
</script>
```

`es` (to be used via `import` command in your bundle or moduled sciprt).<br>
This is the default ("main") the package serves:
```html
<script src='@yaireo/color-picker'></script>
<script>
  const { default:ColorPicker, any_to_hex, changeColorFormat } = window.colorPicker
</script>
```


```js
const cPicker = new ColorPicker({
  // accepted formats: HEX(A), RGB(A), HSL(A), X11 color name
  color: 'red',

  // default rendered textual represention format
  // default: 'hex'
  defaultFormat: 'hex',

  // initial class name for the component's wrapper element
  // default: ''
  className: 'hidden',

  // to disable, set "false" instead of an Array
  // default: []
  swatches: ['red', '#666', 'rgba(10,20,30,.5)'],

  // saves colors for persistance and cross-usage between picker instances
  // default: false
  swatchesLocalStorage: true,

  // buttons text & icon
  buttons: {
    undo   : { icon: '&curvearrowleft;', title: 'Undo' },
    format : { icon: '&leftrightarrows;', title: 'Switch Color Format' },
    add    : { icon: '+', title: 'Add to Swatches' }
  },

  // fired rapidly, on every range slider movement or any color change
  onInput(color){},

  // like "onInput", but not fired while a range slider is moved
  onChange(color){},

  // helpful when the component is used as a popup
  onClickOutside(e){}
})
```

## Example

In the below example the color picker is used as a *popup*, so when an input of type `color` is clicked, the popup
is shown in a way which doesn't affect the flow of the page.

Since this component was designed as bare-minimum, it has no internal positioning-system
and can be pluged with one, for example, [my own](https://github.com/yairEO/position).

In the below example, the color-picker is being bound to an input element, so when the color-picker
is being changes, so will the other input.

```html
<script src="https://unpkg.com/@yaireo/position"></script>
<input class='myColor' value='gold' style='--color:gold' />
```

```js
// because "@yaireo/position" is used (in this demo) as a script file and not an node module (ES export)
position = position.default;

const cPicker = new ColorPicker({
  color: myColor.value, // use the input element's value

  className: 'hidden', // optional class name which will be added to the color-picker component

  swatches: ['white', '#000', 'rgba(255,0,0,.3)'],

  // when clicking anywhere that is not within the color picker.
  // use special logic if clicked on the color-input which is
  // assosiacated with this specific picker
  onClickOutside(e){
    let action = 'add',
        isTargetColorInput = e.target == myColor

    if( isTargetColorInput ) action = 'toggle'
    if( e.key == 'Escape' ) action = 'add'

    cPicker.DOM.scope.classList[action]('hidden')

    isTargetColorInput && observerCallback()
  },

  onInput(color){
    myColor.value = color;
    myColor.style.setProperty('--color', color)
  },
})

// add the color picker to the DOM
document.body.appendChild(cPicker.DOM.scope)


const observerCallback = (entries) => {
  !cPicker.DOM.scope.classList.contains('hidden') &&
  position({ target:cPicker.DOM.scope, ref:myColor });
}

const resizeObserver = new ResizeObserver(observerCallback)
const intersectionObserver = new IntersectionObserver(observerCallback, {root:document, threshold:1});


// position the color picker next to the input element
resizeObserver.observe(document.body)
intersectionObserver.observe(cPicker.DOM.scope)
observerCallback()

// re-position on window resize
resizeObserver.observe(document.body)
```

### Listen to input external `value` changes

If your <input> element's value property might change by means other than this color picker component,
then it is advisable to periodically check and match the color picker's internal value to the input's value.

```js
import ColorPicker, {any_to_hex} from '@yaireo/color-picker'

const colorInput = document.querySelector('input')
const cPicker = new ColorPicker(...)
const VALUE_CHANGE_SAMPLING_DURATION = 1000

setInterval(() => {
  const inputValue = any_to_hex(colorInput.value)
  const pickerValue = any_to_hex(cPicker.CSSColor)

  if(pickerValue != inputValue)
    cPicker.setColor(inputValue)
}, VALUE_CHANGE_SAMPLING_DURATION);
```

### Helper methods exported alongside the *default* `ColorPicker`


| Name                | Parameters                      | Info                                                                                                               |
|---------------------|---------------------------------|-------------------------------------------------------------------------------------|
| `any_to_hex`        | `String`                        | Converts any color string to `hex` format
| `hex_rgba`          | `String`                        | Converts `Hex` to `RGBA` format
| `rgba_hsla`         | `String`                        | Converts `RGBA` to `HSLA` format
| `CSStoHSLA`         | `String`                        | Converts CSS-string `HSLA` to an `HSLA` javascript Object
| `HSLAtoCSS`         | `String`                        | Converts `HSLA` Object to CSS-string
| `changeColorFormat` | color `string`, format `string` | Converts any color string to another color format string


### Methods (`ColorPicker` instance)

| Name             | Parameters                                                                                                                                                                                                                                                                                                  | Info                                                                                                               |
|------------------|-----------------------|-------------------------------------------------------------------------------|
| `setColor`       | `String`              | Sets the instance color
| `getColorFormat` | `String`              | Gets the format of a color string: `hex`, `rgba` or `hsla`
