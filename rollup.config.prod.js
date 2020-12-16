import babel           from '@rollup/plugin-babel'
import { terser }      from 'rollup-plugin-terser'
import cleanup         from 'rollup-plugin-cleanup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs        from '@rollup/plugin-commonjs'
import pkg             from './package.json'

const banner = `/*! Color-Picker ${pkg.version} MIT | https://github.com/yairEO/color-picker */`;

export default [
  {
    input: 'src/color-picker.js',
    output: {
      banner,
      file: pkg.main,
      format: 'umd',
      name: 'ColorPicker',
    },
    plugins: [
      terser(),
      babel({ babelHelpers: 'bundled' }),
      cleanup(),
      nodeResolve(),
      commonjs()
    ]
  }
]

