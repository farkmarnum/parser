import { Node as BabelNode } from '@babel/types'
import { parse, ParserOptions } from '@babel/parser'
import generate, { GeneratorOptions } from '@babel/generator'
import * as prettier from 'prettier'
import transformsList from './transforms'
import { TransformFn } from './types'

const parseOptions = {
  sourceType: 'unambiguous',
  plugins: ['jsx', 'classProperties'],
} as ParserOptions

const generateOptions = {
  retainLines: true,
  retainFunctionParens: true,
} as GeneratorOptions

export const doTransformations = (
  ast: BabelNode,
  transforms: TransformFn[],
): void => transforms.forEach((fn) => fn(ast))

/* ************************************************************************************************ */

const code = `
import React from 'react'
import PropTypes from 'prop-types'

class a extends React.Component {
  componentWillMount(n) {
    console.log(1)
    return n * n
    // test
  }

  constructor(props) {
    super(props)

    this.state = {
      loading: 'yes',
    }
  }

  static propTypes = {
    name: PropTypes.string,
  }

  static defaultProps = {
    name: '(no name)',
  }

  componentWillMount() {
    this.setState({ loading: 'maybe' })
  }

  render() {
    return (
    <div>
      <button onClick={() => this.setState({ loading: 'no' })}>
        {this.props.name}
      </button>
      {this.state.loading === 'yes' && <p>yes</p>}
      {this.state.loading === 'maybe' && <p>maybe</p>}
      {this.state.loading === 'no' && <p>no</p>}
    </div>
    )
  }
}
`

const ast = parse(code, parseOptions)
doTransformations(ast, transformsList)

const { code: transformed } = generate(ast, generateOptions, code)

const formatted = prettier.format(transformed, { semi: false, parser: 'babel' })

console.log(formatted)
