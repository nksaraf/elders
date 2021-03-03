import { kush } from "kush-cli";

kush`
new-package:
  in ${"packages/elders"} {
    $ yarn init
  }

watch:
  $ node -r esbuild-runner/register ./build.js -watch

p:
  $ yarn --cwd ./packages/${$ => $.input[0]} ${$ => $.input.slice(1).join(' ')}

e:
  $ yarn --cwd ./examples/${$ => $.input[0]} ${$ => $.input.slice(1).join(' ')}
`();
