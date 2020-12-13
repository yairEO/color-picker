<h1 align="center">
  Simple lightweight pretty color picker
</h1>


## What is this:

After searching far and wide for a truely lightweight color-picker component, without any luck
finding such, I had no choice but to make my own *color picker* component.

**⚠️ Supported only in modern browsers**

This color-picker component is basesd on my previous work with highly customizable range input (slider) component: [UI-Range](https://github.com/yairEO/ui-range) and the power of HSLA color format infused into custom CSS properties (variables) to allow as lightweight solution as possible.

I have hand-crafted the color transformation functions to be as lightweight as possible, and kept the UI to
the minimum necessary to provide the user with a better, unified, color-picking experience which I believe is better
than the default `<input type=color>` which is different across browsers and OS, and does ***not*** alow modifications to a color's *alpha* (opacity) channel.



## Install

    npm i @yaireo/color-picker

## Use

```js
const cPicker = new ColorPicker({
  color: '#FF0000'  // accepted formats: HEX(A), RGB(A), HSL(A), X11 color name
})
```
