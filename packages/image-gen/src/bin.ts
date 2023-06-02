#! /usr/bin/env node
import * as figlet from 'figlet';
import { generateImages } from './lib/image-gen';
import { Command, program } from 'commander';
import * as packageJson from '../package.json'
import { GenImgOpts } from './common/interfaces';

function presentLogs() {
  console.log(`-------------------- 🔥 Welcome To 🔥 --------------------`);
  console.log(figlet.textSync(`NVPDEV`));
  console.log(`----------------------------------------------------------`);
}

function errorColor(str: string) {
  // Add ANSI escape codes to display text in red.
  return `\x1b[31m${str}\x1b[0m`;
}

presentLogs();

async function main() {
  program
    .description(`Generate your public logo images`)
    .name(packageJson.name)
    .version(packageJson.version)

  program
    .command('gen [input] [output]')
    .description(`Generate images logos`)
    .option('-n, --name <string>', 'folder name (default "generated")')
    .option('-c, --config <string>', 'use custom filename using custom config')
    .action(async (input, output, opt, opts: GenImgOpts) => {
      if (!input || !output) {
        if (opts.config) {
          await generateImages(undefined, undefined, program, opts instanceof Command ? opt : opts)
            .catch((err) => {
              if (err.message) {
                program.error(err.message as string)
              } else {
                program.error(err)
              }
            });
          return
        }
        program.error(`Input or ouput cannot be empty`, { code: 'empty', exitCode: 2 })
      }
      await generateImages(input as string, output as string, program, opts instanceof Command ? opt : opts)
        .catch((err) => {
          if (err.message) {
            program.error(err.message as string)
          } else {
            program.error(err)
          }
        });
    })

  program.showHelpAfterError(true)
  program.configureOutput({
    // Visibly override write routines as example!
    writeOut: (str) => process.stdout.write(`[OUT] -> ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] -> ${str}`),
    // Highlight errors in color.
    outputError: (str, write) => write(errorColor(str))
  })
}

main().catch(console.error);
program.parse(process.argv)
