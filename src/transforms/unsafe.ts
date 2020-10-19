import * as parser from "@babel/parser"
import generate from "@babel/generator"
import traverse from "@babel/traverse"
import { TransformFnArgs } from '../types'

export const transformsquaretoSQR = ({ code, parseOptions, generateOptions }: TransformFnArgs): string => {
  const ast = parser.parse(code, parseOptions)

  traverse(ast, {
    enter(path) {
      if (path.node.type === 'ClassMethod' && path.node.key.type === 'Identifier' && path.node.key.name === 'componentWillMount') {
        path.node.key.name = 'UNSAFE_componentWillMount'
      }
    }
  })

  const { code: output } = generate(ast, generateOptions, code)
  return output
}
