#! /usr/bin/env node
import * as figlet from 'figlet'
import { generateImages } from './lib/image-gen'

function presentLogs() {
  console.log(`-------------------- 🔥 Welcome To 🔥 --------------------`)
  console.log(figlet.textSync(`NVPDEV`))
  console.log(`----------------------------------------------------------`)
}

presentLogs()

async function main() {
  const args = process.argv.slice(2)
  if (args && args[0] === '--help') {
    console.log(`
NvP image generator, useful for you to generate your website images metadata

Command: 
npx @nvp/image-gen <path/input/to/img.png> <path/output/dir>
    `)
    return
  }
  if (!args || !args[0] || !args[1]) {
    throw new Error(`
      🧨 Error: Input and Output file should be defined
      ------------------------------------------------
      npx @nvp/image-gen --help
    `)
  }

  await generateImages(args[0] as string, args[1] as string).then(() => {
    console.log(`
🚀 Successfully generated. Check your ${args[1]} folder
    `)
    process.exit(0)
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

main().catch(console.error)