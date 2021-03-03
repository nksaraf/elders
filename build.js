import {build} from 'estrella';
build({
  entry: 'packages/vite-plugin-react-jsx/src/index.ts',
  outfile: 'packages/vite-plugin-react-jsx/dist/vite-plugin-react-jsx.cjs.js',
  format: 'cjs',
  platform: 'node',
  bundle: true
  // Run: ["tsc packages/vite-plugin-react-jsx/src/index.ts --skipLibCheck --emitDeclarationOnly --declaration --declarationDir packages/vite-plugin-react-jsx/dist/types"]
  // pass any options to esbuild here...
});

// Build({
//   entry: "packages/vite-plugin-react-jsx/src/index.ts",
//   outfile: "packages/vite-plugin-react-jsx/dist/vite-plugin-react-jsx.es.js",
//   tslint: false
//   // pass any options to esbuild here...
// })
