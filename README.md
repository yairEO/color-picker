<p align="center">
  <a href='https://yaireo.github.io/color-picker/'>
    <img src="./demo.gif?sanitize=true" alt="color picker demo gif"/>
  </a>
<p>

<h1 align="center">
  Minimal, 5KB Color-Picker in Vanila-js
</h1>

**⚠️ Supported only in modern browsers**

## What is this:

This color-picker component is basesd on my previous work with highly customizable range input (slider) component: [UI-Range](https://github.com/yairEO/ui-range) and the power of HSLA color format infused into custom CSS properties (variables) to allow as lightweight solution as possible.

I have hand-crafted the color transformation functions to be as lightweight as possible, and kept the UI to
the minimum necessary to provide the user with a better, unified, color-picking experience which I believe is better
than the default `<input type=color>` which looks different across browsers and OS, and does ***not*** alow modifications to a color's *alpha* (opacity) channel.

Since this component is ***only*** the color picker itself, it is up to developers to connect it to a position script,
if they wish to use it as a *popup* when some other thing is clicked on the page. An example of such can be
seen in the demo page and below, on the last section.

## Install

    npm i @yaireo/color-picker

## Use

```js
const cPicker = new ColorPicker({
  color: 'red', // accepted formats: HEX(A), RGB(A), HSL(A), X11 color name

  defaultFormat: 'hex', // default rendered textual represention format

  className: 'hidden', // initial class name for the component's wrapper element

  swatches: ['red', '#666', 'rgba(10,20,30,.5)'], // to disable, set "false" instead of an Array

  swatchesLocalStorage, // saves colors for persistance and cross-usage between picker instances

  onInput(color){}, // fired rapidly, on every range slider movement or any color change

  onChnage(color){}, // like "onInput", but not fired while a range slider is moved

  onClickOutside(e){}  // helpful when the component is used as a popup
})
```

## Example

In the below example the color picker is used as a popup.
Since this component was designed as bare-minimum, it has no internal positioning-system
and can be pluged with one, for example, the excellent, lightweight [nanopop](https://github.com/Simonwep/nanopop).

In the below example, the color-picker is being bound to an input element, so when the color-picker
is being changes, so will the other input.

```html
<script src="https://unpkg.com/nanopop"></script>
<input class='myColor' value='gold' style='--color:gold' />
```

```js
const resizeObserver = new ResizeObserver(entries => {
  // only re-position the color picker if its not hidden
  if( !cPicker.DOM.scope.classList.contains('hidden') )
    NanoPop.reposition( myColor, cPicker.DOM.scope )
})

const cPicker = new ColorPicker({
  color: myColor.value, // use the input element's value

  className: 'hidden', // start as hidden

  onClickOutside(e){
    let action = 'add'

    // if clicked on the input element, toggle picker's visibility
    if( e.target == myColor ){
      NanoPop.reposition( myColor, cPicker.DOM.scope )
      action = 'toggle'
    }

    // if "escape" key was pressed, add the "hidden" class
    if( e.key == 'Escape' )
      action = 'add'

    cPicker.DOM.scope.classList[action]('hidden')
  },

  onInput(color){
    myColor.value = color;
    myColor.style.setProperty('--color', color)
  },
})

// add the color picker to the DOM
document.body.appendChild(cPicker.DOM.scope)

// position the color picker next to the input element
NanoPop.reposition( myColor, cPicker.DOM.scope )

// re-position on window resize
resizeObserver.observe(document.body)
```

