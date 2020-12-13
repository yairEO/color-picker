import scss from 'rollup-plugin-scss'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/color-picker.js',
    output: {
      file: './dist/color-picker.min.js',
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
  },
  {
    input: 'src/color-picker.js',
    output: {
      file: './dist/color-picker.js',
      format: 'umd',
      name: 'ColorPicker',
    },
    plugins: [
      serve(), // index.html should be in root of project
      livereload({ watch:'src', delay:1000, exts: [ 'html', 'js', 'scss', 'css' ] }),
      cleanup(),
      nodeResolve(),
      commonjs()
    ]
  },
]

