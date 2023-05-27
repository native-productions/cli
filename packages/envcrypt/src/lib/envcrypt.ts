/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs'
import { decrypt, encrypt } from './crypto'
import { constants } from '../common/constants'
import { safeWriteFileAsync } from './utils'

export type EnvCryptOptions = {
  secretKey: string;
  iv?: string;
  disableWriteFile?: boolean;
  encFileName?: string;
};

export const encryptSingleData = (secret: string, iv: string, data: string) => {
  try {
    return encrypt(secret, iv, data)
  } catch (error: any) {
    throw new Error(error)
  }
};

export const decryptSingleData = (secret: string, iv: string, data: string) => {
  try {
    return decrypt(secret, iv, data)
  } catch (error: any) {
    throw new Error(error)
  }
};

export async function syncEnc(encFilePath: string, envFilePath: string, opt: EnvCryptOptions) {
  const isEncPathExist = fs.existsSync(encFilePath)
  const isEnvPathExist = fs.existsSync(envFilePath)
  let _iv = constants.defaultIv

  if (opt.iv) {
    _iv = opt.iv
  }

  if (!isEncPathExist) {
    throw new Error(`Encrypted file ${encFilePath} not found`)
  }
  if (!isEnvPathExist) {
    throw new Error(`Env file ${envFilePath} not found`)
  }

  try {
    const envModifiedTime = fs.statSync(envFilePath).mtimeMs
    const encModifiedTime = fs.statSync(encFilePath).mtimeMs
    if (encModifiedTime > envModifiedTime) {
      try {
        const encFile = fs.readFileSync(encFilePath, 'utf8')
        const decryptedEnc = decryptSingleData(opt.secretKey, _iv, encFile)
        return await safeWriteFileAsync(envFilePath, decryptedEnc)
      } catch (error: any) {
        console.error(error)
        throw new Error(error)
      }
    } else {
      try {
        const envFile = fs.readFileSync(envFilePath, 'utf8')
        const encryptedEnv = encryptSingleData(opt.secretKey, _iv, envFile)
        return await safeWriteFileAsync(envFilePath, encryptedEnv)
      } catch (error: any) {
        console.error(error)
        throw new Error(error)
      }
    }
  } catch (error: any) {
    throw new Error(error)
  }
}