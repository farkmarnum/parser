import * as assert from 'assert'
import * as t from '@babel/types'
// import template from "@babel/template"
import { Node as BabelNode } from '@babel/types'
import traverse from '@babel/traverse'

export const debug = (ast: BabelNode): void => {
  traverse(ast, {
    enter(path) {
      const isClassExtendingComponent =
        t.isClassDeclaration(path.node) &&
        t.isIdentifier(path.node.superClass) &&
        path.node.superClass.name === 'Component'

      const isClassExtendingReactComponent =
        t.isClassDeclaration(path.node) &&
        t.isMemberExpression(path.node.superClass) &&
        t.isIdentifier(path.node.superClass.object) &&
        t.isIdentifier(path.node.superClass.property) &&
        path.node.superClass.object.name === 'React' &&
        path.node.superClass.property.name === 'Component'

      const isReactClassComponent =
        isClassExtendingComponent || isClassExtendingReactComponent

      if (isReactClassComponent) {
        assert(path.node.type === 'ClassDeclaration')
        assert(path.node.id.type === 'Identifier')

        const name = path.node.id.name

        let constructor
        let propTypes
        let defaultProps
        const methods = []

        let level = ''
        path.traverse({
          enter(p) {
            const n = t.isIdentifier(p.node) ? p.node.name : ''
            console.log(level + p.node.type, n)
            level += '  '

            if (t.isClassMethod(p.node)) {
              if (p.node.kind === 'method') {
                methods.push(p.node)
              } else if (p.node.kind === 'constructor') {
                constructor = p.node
              }
            } else if (t.isClassProperty(p.node)) {
              if (t.isIdentifier(p.node.key)) {
                if (p.node.key.name === 'propTypes') {
                  propTypes = p.node
                } else if (p.node.key.name === 'defaultProps') {
                  defaultProps = p.node
                }
              }
            }
          },
          exit() {
            level = level.slice(2) || ''
          },
        }),

        console.log(constructor, propTypes, defaultProps)

        path.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(name),
              t.arrowFunctionExpression(
                [t.identifier('props')],
                t.blockStatement([
                  t.ifStatement(
                    t.binaryExpression(
                      '===',
                      t.memberExpression(
                        t.identifier('props'),
                        t.identifier('arg0'),
                      ),
                      t.memberExpression(
                        t.identifier('props'),
                        t.identifier('arg1'),
                      ),
                    ),
                    t.blockStatement([t.returnStatement()]),
                  ),
                ]),
              ),
            ),
          ]),
        )
      }
    },
  })
}
