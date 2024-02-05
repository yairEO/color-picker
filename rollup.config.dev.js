import cleanup         from 'rollup-plugin-cleanup'
import serve           from 'rollup-plugin-serve'
import livereload      from 'rollup-plugin-livereload'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs        from '@rollup/plugin-commonjs'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

export default [
  {
    input: 'src/color-picker.js',
    output: [
      {
        file: pkg.main,
        format: 'es',
        exports: 'named',
        name: 'ColorPicker',
        sourcemap: true,
      },
      {
        file: pkg.main.replace('.es.', '.iife.'),
        format: 'iife',
        exports: 'named',
        name: 'colorPicker',
        sourcemap: true,
      }
    ],
    plugins: [
      serve({port: 10011}), // index.html should be in root of project
      livereload({ watch:'src', delay:1000, exts: [ 'html', 'js', 'scss', 'css' ] }),
      cleanup(),
      nodeResolve(),
      commonjs()
    ]
  },
]

