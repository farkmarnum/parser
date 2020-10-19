import * as parser from "@babel/parser"
import * as generate from "@babel/generator"
import transformsList from './transforms'
import { RefactorArgs } from './types'

const parseOptions = {
  sourceType: 'unambiguous',
  ranges: true,
  plugins: [
    'jsx',
  ],
} as parser.ParserOptions

const generateOptions = {
  retainLines: true,
  retainFunctionParens: true,
} as generate.GeneratorOptions

export const refactor = ({ code, transforms }: RefactorArgs): string =>
  transforms.reduce((acc, fn) =>
    fn({ code: acc, parseOptions, generateOptions }), code)

/* ************************************************************************************************ */

const code = `
import React from 'react'

class a extends React.Component {
  componentWillMount(n) {
    console.log(1)
    return n * n
    // test
  }

  render() {
    return (
      <div>
        {this.props.name}
      </div>
    )
  }
}
`

const refactored = refactor({ code, transforms: transformsList })
console.log(refactored)
