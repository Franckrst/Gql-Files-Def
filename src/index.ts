import type { PluginFunction } from '@graphql-codegen/plugin-helpers'
import type { OperationDefinitionNode } from 'graphql/language/ast'
import { writeFileSync } from 'node:fs'
import { relative } from 'node:path'
import * as process from 'node:process'

interface DocRsult { location: string, path: string, def: { key: string, name: string }[] }

export const plugin: PluginFunction = (schema, documents, config, info) => {
  if (!info?.outputFile) {
    throw new Error('Need output file')
  }
  const docResult = documents.reduce((acc, doc) => {
    return [
      ...acc,
      {
        location: doc.location || '',
        path: relative(process.cwd(), doc.location || ''),
        def: (doc.document?.definitions as OperationDefinitionNode[])
          .filter(d => !!d?.name?.value)
          .map(d => d?.name?.value || '')
          .reduce((subAcc, name) => {
            return [
              ...subAcc,
              {
                key: name,
                name: String(name).charAt(0).toUpperCase() + String(name).slice(1),
              },
            ]
          }, [] as { key: string, name: string }[]) || [],
      },
    ]
  }, [] as DocRsult[])

  for (const doc of docResult) {
    const inportPath = relative(doc.location.split('/').slice(0, -1).join('/'), info.outputFile)
    writeFileSync(`${doc.location}.d.ts`, `
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type {${doc.def.map(({ name }) => `${name}Query, ${name}QueryVariables`).join(', ')}} from "${inportPath}";
${doc.def.map(({ name, key }) => `export const ${key}: TypedDocumentNode<${name}Query, ${name}QueryVariables>;`).join('\n')}
`)
  }

  return `// All type declarations are next to your query files 
// Helper
type NonUndefined<T> = T extends undefined ? never : T;
export type GqlVariableOf<T extends { __apiType ?:(...args: any) => any}> = Parameters<NonUndefined<T['__apiType']>>[0];
export type GqlResponseOf<T extends { __apiType ?:(...args: any) => any}> = ReturnType<NonUndefined<T['__apiType']>>;
`
}
