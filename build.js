import {build} from 'estrella';
build({
  entry: 'packages/vite-plugin-react-jsx/index.ts',
  outfile: 'packages/vite-plugin-react-jsx/dist/index.cjs.js',
  format: 'cjs',
  platform: 'node',
  tslint: false,
  bundle: true
  // Run: ["tsc packages/vite-plugin-react-jsx/src/index.ts --skipLibCheck --emitDeclarationOnly --declaration --declarationDir packages/vite-plugin-react-jsx/dist/types"]
  // pass any options to esbuild here...
});

build({
  entry: 'packages/vite-plugin-elders/index.ts',
  outfile: 'packages/vite-plugin-elders/dist/index.cjs.js',
  format: 'cjs',
  platform: 'node',
  tslint: false,

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
