import chalk from 'chalk';
import figures from 'figures';
import Path from 'path';
import express from 'express';
import jscodeshift from 'jscodeshift/dist/Runner.js';
const argv = require('yargs-parser')(process.argv.slice(2));

const app = express();

const verbose = argv.verbose || false;

// Let config;
// config = configPath
//   ? resolveConfig(require(resolve(configPath)))
//   : resolveConfig({});

// app.get('/config', async (request, res) => {
//   res.send(config);
// });

// App.post('/source', async (req, res) => {
//   const { path, lineNumber } = req.body;
//   if (!path) {
//     res.send("nothing");

//   }
// });

app.post('/', async (request, res) => {
  const {path, lineNumber, className} = request.body;
  if (!path) {
    res.send('nothing');
    return;
  }

  const transform = Path.join(__dirname, 'transform.js');

  // Fire and forget
  const response = await jscodeshift.run(transform, [path], {
    lineNumber: Number.parseInt(lineNumber, 10),
    className,
    silent: true,
    runInBand: true,
    verbose,
    parser: 'tsx'
  });

  const prettyPath = Path.relative(process.cwd(), path) + ':' + lineNumber;

  if (response.ok) {
    console.log(
      chalk.green(figures.tick),
      prettyPath,
      'in',
      response.timeElapsed + 's'
    );
  } else if (response.nochange) {
    console.log(chalk.yellow(figures.line), 'did not change', prettyPath);
  } else if (response.error) {
    console.log(chalk.red(figures.cross), 'error changing', prettyPath);
  }

  res.send(response);
});
