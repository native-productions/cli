/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs'
import * as path from 'path'
import { version, name } from '../../package.json'

export function getVersion(): string {
  return version;
};

export function getName(): string {
  return name;
}

export function isDir(p: string): boolean {
  try {
    const stat = fs.lstatSync(joinCwd(p));
    return stat.isDirectory() || stat.isFile();
  } catch (e) {
    return false;
  }
}

export function joinCwd(p: string): string {
  return path.join(process.cwd(), p)
}

export const safeWriteFileAsync = (path: string, data: string, name?: string): Promise<boolean> => new Promise((resolve, reject) => {
  try {
    if (fs.existsSync(joinCwd(path))) {
      console.log('sini?')
      if (!name) {
        fs.writeFileSync(joinCwd(`${path}`), data, 'utf8')  
        resolve(true)
      }
      if (path.endsWith('/')) {
        fs.writeFileSync(joinCwd(`${path}${name}`), data, 'utf8')
      } else {
        fs.writeFileSync(joinCwd(`${path}/${name}`), data, 'utf8')
      }
      console.log(`Successfully created ${path}${name} file`)
      resolve(true)
    } else {
      fs.promises.mkdir(path, { recursive: true })
        .then(() => {
          if (!name) {
            fs.writeFileSync(joinCwd(`${path}`), data, 'utf8')  
            resolve(true)
          }
          if (path.endsWith('/')) {
            fs.writeFileSync(joinCwd(`${path}${name}`), data, 'utf8')
          } else {
            fs.writeFileSync(joinCwd(`${path}/${name}`), data, 'utf8')
          }
          console.log(`Successfully created ${path}${name} file`)
          resolve(true)
        })
    }
  } catch (error: any) {
    reject(new Error(error))
  }
})

export function isCalledFromConsole(): boolean {
    let stack;
    try
    {
       // Throwing the error for Safari's sake, in Chrome and Firefox
       // var stack = new Error().stack; is sufficient.
       throw new Error();
    }
    catch (e: any)
    {
        stack = e.stack;
    }
    if (!stack)
        return false;

    const lines = stack.split("\n");
    for (let i = 0; i < lines.length; i++)
    {
        if (lines[i].indexOf("at Object.InjectedScript.") >= 0)
            return true;   // Chrome console
        if (lines[i].indexOf("@debugger eval code") == 0)
            return true;   // Firefox console
        if (lines[i].indexOf("_evaluateOn") == 0)
            return true;   // Safari console
    }
    return false;
}