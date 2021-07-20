import estrella from 'estrella';

estrella.build({
  entry: 'ext-src/extension.ts',
  format: 'cjs',
  external: ['vscode'],
  platform: 'node',
  sourcemap: true,
  minify: false,
  outfile: 'dist/extension.js',
bundle: true

})