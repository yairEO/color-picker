import babel           from '@rollup/plugin-babel'
import terser          from '@rollup/plugin-terser'
import cleanup         from 'rollup-plugin-cleanup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs        from '@rollup/plugin-commonjs'
import typescript      from '@rollup/plugin-typescript'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const banner = `/*! Color-Picker ${pkg.version} MIT | https://github.com/yairEO/color-picker */`

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        banner,
        file: pkg.main,
        format: 'es',
        name: 'ColorPicker',
        exports: 'named',
        sourcemap: true,
      },
      {
        banner,
        file: pkg.main.replace('.es.', '.iife.'),
        format: 'iife',
        name: 'colorPicker',
        exports: 'named',
        sourcemap: true,
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: false,
      }),
      terser(),
      babel({ babelHelpers: 'bundled' }),
      cleanup(),
      nodeResolve(),
      commonjs()
    ]
  }
]

