/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs'
import { constants } from "../common/constants";
import * as path from 'path'

export function isDir(p: string): boolean {
  try {
    const stat = fs.lstatSync(p);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

export function joinCwd(p: string): string {
  return path.join(process.cwd(), p)
}

export const safeWriteFileAsync = (path: string, data: string, name?: string): Promise<boolean> => new Promise((resolve, reject) => {
  fs.readFile(path, (err) => {
    if (err && err.code === constants.errMsg.DIRECTORY_ENOENT) {
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
          resolve(true)
        })
    } else if (err && err.code !== constants.errMsg.DIRECTORY_ENOENT) {
      reject(err)
    } else {
      if (!name) {
        fs.writeFileSync(joinCwd(`${path}`), data, 'utf8')  
        resolve(true)
      }
      if (path.endsWith('/')) {
        fs.writeFileSync(joinCwd(`${path}${name}`), data, 'utf8')
      } else {
        fs.writeFileSync(joinCwd(`${path}/${name}`), data, 'utf8')
      }
      resolve(true)
    }
    resolve(false)
  })
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