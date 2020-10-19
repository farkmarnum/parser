import * as parser from "@babel/parser"
import * as generate from "@babel/generator"

export interface TransformFnArgs {
  code: string
  parseOptions: parser.ParserOptions
  generateOptions: generate.GeneratorOptions
}

export type transformFn = ({code, parseOptions, generateOptions }: TransformFnArgs) => string

export interface RefactorArgs {
  code: string
  transforms: transformFn[]
}
