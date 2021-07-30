import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
// import shebang from 'rollup-plugin-add-shebang'
import pkg from './package.json'

const external = (
  pkg && pkg.dependencies ? Object.keys(pkg.dependencies) : []
).concat([`path`])

const plugins = [
  json(),
  resolve({ preferBuiltins: true }),
  commonjs()
]

export default [
  {
    input: `src/index.js`,
    external,
    output: [
      { exports: 'auto', file: pkg.main, format: `cjs` },
      { exports: 'auto', file: 'easy-street.mjs', format: 'esm' }
    ],
    plugins
  },
  {
    input: 'src/index.js',
    external,
    output: [
      {
        name: 'easystreet',
        exports: 'auto',
        file: 'easy-street.umd.js',
        format: 'umd'
      }
    ],
    plugins
  }
]
