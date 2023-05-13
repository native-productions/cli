import * as crypto from 'crypto'
import { generate } from 'randomstring'

const hash = (msg: string) => {
  return crypto.createHash('md5').update(msg).digest('hex')
}

export const generateKey = () => {
  return hash(generate())
}

export const generateIv = () => {
  return crypto.randomBytes(16).toString('hex').slice(0, 16)
}

/**
 * Encrypt
 * @param key string The encryption key
 * @param iv string The initialization vector
 * @param msg string The message to be encrypted
 */
export const encrypt = (key: string, iv: string, msg: string) => {
  const _iv = iv || "0000000000000000"
  let secKey = key;
  secKey = hash(key);

  if (!iv || iv.length !== 16) {
    throw new Error(`Invalid IV`)
  }
  if (!key || key.length !== 32) {
    throw new Error(`Invalid key length, should be 32`)
  }

  const bufferKey = Buffer.from(secKey)
  const cipher = crypto.createCipheriv('aes-256-cbc', bufferKey, _iv)
  return cipher.update(msg, 'utf8', 'base64') + cipher.final('base64')
}

/**
 * Encrypt
 * @param key string The encryption key
 * @param iv string The initialization vector
 * @param msg string The message to be encrypted
 */
export const decrypt = (key: string, iv: string, msg: string) => {
  let defaultIv = "0000000000000000"
  let secKey = key;
  secKey = hash(key);

  if (!iv || iv.length !== 16) {
    throw new Error(`Invalid IV`)
  }
  if (!key || key.length !== 32) {
    throw new Error(`Invalid key length, should be 32`)
  }

  defaultIv = iv;
  const bufferKey = Buffer.from(secKey)
  const cipher = crypto.createCipheriv('aes-256-cbc', bufferKey, defaultIv)
  return cipher.update(msg, 'base64', 'utf8') + cipher.final('utf8')
}
