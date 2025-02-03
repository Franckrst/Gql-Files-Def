# ⚛️ Gql Files Def

This npm Codegen plugin automatically generates TypeScript definition files (.d.ts) for GraphQL files (.gql), making it easier to integrate and ensure strict typing in TypeScript applications.

---

## Usage

- **Installation**
```shell
npm i -D gql-files-def
```

- **Configuration**: Add the plugin to your codegen config
```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  documents: ['src/**/*.gql', 'src/**/*.graphql'],
  schema: './schema.graphql',
  generates: {
    './src/__graphql__/graphql-operations.ts': {
      plugins: ['typescript', 'typescript-operations', './tools/gql-type-def.js']
    }
  }
};

export default config;
```

---

## Advice

###

### With [⚡ Vite](https://github.com/vitejs/vite)

Use the plugin [vite-plugin-graphql-loader](https://www.npmjs.com/package/vite-plugin-graphql-loader) for importing GraphQL files

### Typing schema

Use the plugin [Schema-ast](https://the-guild.dev/graphql/codegen/plugins/other/schema-ast) so that your tools (IDE) can offer you typing

```json
{
  "generates": {
    "./schema.graphql": {
      "plugins": [
        "schema-ast"
      ],
      "config": {
        "includeDirectives": true
      }
    }
  }
}
```

---

[MIT](./LICENSE) License © [Franck RST](https://github.com/Franckrst)
