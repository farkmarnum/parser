import { Node as BabelNode } from '@babel/types'
import traverse from "@babel/traverse"

export const transformsquaretoSQR = (ast: BabelNode): void => {
  traverse(ast, {
    enter(path) {
      if (path.node.type === 'ClassMethod' && path.node.key.type === 'Identifier' && path.node.key.name === 'componentWillMount') {
        path.node.key.name = 'UNSAFE_componentWillMount'
      }
    }
  })
}
