/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFile } from 'fs/promises'
import * as fs from 'fs'
import * as sharp from 'sharp';
import * as path from 'path';
import { sizes } from '../common/constants';

function joinCwd(...p: string[]): string {
  return path.join.apply(null, [process.cwd(), ...p]);
}

function isDir(p: string): boolean {
  try {
    const stat = fs.lstatSync(p);
    return stat.isDirectory()
  } catch (e) {
    return false;
  }
}

const isSlash = (p: string) => p.endsWith('/')

export const generateImages = async (inputPath: string, outputPath: string) => {
  const iPath = joinCwd(`./`, inputPath)
  const oPath = joinCwd(`./`, outputPath)

  const img = await readFile(iPath)
  const isOutDir = isDir(oPath);

  if (!isOutDir) {
    throw new Error(`${oPath} is not directory`)
  }
  if (!img) {
    throw new Error(`File does not exist`)
  }

  for (const size of sizes) {
    const fName = size.height === 32 ? `${size.name}${size.ext}` : `${size.name}-${size.width}-${size.height}${size.ext}`
    sharp(iPath)
      .resize({
        width: size.width,
        height: size.height,
        withoutEnlargement: true,
        fit: sharp.fit.inside
      })
      .toFile(`${oPath}${isSlash(oPath) ? fName : `/${fName}`}`, (err: any) => {
        if (err) {
          throw new Error(err)
        }
        console.log(`
🚀 Generating ${fName}
        `)
      })
  }
}
