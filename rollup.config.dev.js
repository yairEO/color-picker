import cleanup         from 'rollup-plugin-cleanup'
import serve           from 'rollup-plugin-serve'
import livereload      from 'rollup-plugin-livereload'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs        from '@rollup/plugin-commonjs'
import pkg             from './package.json'

export default [
  {
    input: 'src/color-picker.js',
    output: {
      file: pkg.main,
      format: 'umd',
      exports: 'named',
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

