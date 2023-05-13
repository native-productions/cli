#! /usr/bin/env node

import { program } from 'commander'
import * as figlet from 'figlet'
import { getName, getVersion } from './lib/utils'
import { constants } from './common/constants'
import * as readline from 'readline'
import { toEnc } from './lib/envcrypt'

function presentLogs() {
  console.log(`-------------------- 🔥 Welcome To 🔥 --------------------`)
  console.log(figlet.textSync(`NVPDEV`))
  console.log(`----------------------------------------------------------`)
}

presentLogs()

function main() {
  program
    .description(constants.commander.description)
    .name(getName())
    .version(getVersion())

  program
    .command('sync [input] [output] [options]')
    .description(constants.commander.syncDescription)
    .option('-k, --key <string>', 'encryption secret key')
    .option('-f, --file-name <string>', 'your output enc filename', 'out')
    .action((input, output, _, opts) => {
      if (!opts.key) {
        const ask = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
  
        ask.question('Enter your secret key: ', (key) => {
          toEnc(
            input, 
            {
              secretKey: key,
              disableWriteFile: false,
            },
            output
          )
          process.exit(0)
        })
      } else {
        toEnc(
          input, 
          {
            secretKey: opts.key,
            disableWriteFile: false,
            encFileName: `${opts.fileName}.enc`
          },
          output
        )
        process.exit(0)
      }
    })

  program.showHelpAfterError(true);
}

main()
program.parse(process.argv)

