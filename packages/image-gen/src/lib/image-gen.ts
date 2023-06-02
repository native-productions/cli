/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFile, mkdir } from 'fs/promises';
import * as fs from 'fs';
import * as sharp from 'sharp';
import * as path from 'path';
import { sizes } from '../common/constants';
import { ConfigStatus, GenImgOpts, ImgGenConfig } from '../common/interfaces';
import { Command, program } from 'commander';

function joinCwd(...p: string[]): string {
  return path.join.apply(null, [process.cwd(), ...p]);
}

function isDir(p: string): boolean {
  try {
    const stat = fs.lstatSync(p);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

const isSlash = (p: string) => p.endsWith('/');

const isConfigCorrect = (object: ImgGenConfig): ConfigStatus => {
  if (!object.sizes) {
    return {
      msg: 'No sizes object included',
      success: false
    }
  }
  const _size = object.sizes[0]
  if (!_size.height) {
    return {
      msg: 'No height included inside sizes',
      success: false
    }
  }
  if (!_size.width) {
    return {
      msg: 'No width included inside sizes',
      success: false
    }
  }
  if (!_size.name) {
    return {
      msg: 'No name included inside sizes',
      success: false
    }
  }
  if (object.folderName && object.folderName.startsWith('/')) {
    return {
      msg: 'folderName cannot start with "/"',
      success: false
    }
  }
  return {
    msg: "",
    success: true
  }
}

const gen = (img: Buffer, _isOutDir: boolean, oPath: string, iPath: string, program: Command, opts?: ImgGenConfig) => {
  if (!img) {
    throw new Error(`File does not exist`);
  }

  if (opts) {
    if (opts.sizes.length === 0) {
      program.error(`Sizes cannot be an empty array`, { code: 'wrong.sizes', exitCode: 2 })
    }
    for (const size of opts.sizes) {
      const fName =
        size.height === 32 && size.width === 32
          ? `${size.name}${size.ext}`
          : `${size.name}-${size.width}-${size.height}${size.ext}`;
      sharp(iPath)
        .resize({
          width: size.width,
          height: size.height,
          withoutEnlargement: true,
          fit: sharp.fit.inside,
        })
        .toFile(`${oPath}${isSlash(oPath) ? fName : `/${fName}`}`, (err: any) => {
          if (err) {
            throw new Error(err);
          }
          console.log(`🚀 Generating ${fName}`);
        });
    }
    return true
  }
  for (const size of sizes) {
    const fName =
      size.height === 32 && size.width === 32
        ? `${size.name}${size.ext}`
        : `${size.name}-${size.width}-${size.height}${size.ext}`;
    sharp(iPath)
      .resize({
        width: size.width,
        height: size.height,
        withoutEnlargement: true,
        fit: sharp.fit.inside,
      })
      .toFile(`${oPath}${isSlash(oPath) ? fName : `/${fName}`}`, (err: any) => {
        if (err) {
          throw new Error(err);
        }
        console.log(`🚀 Generating ${fName}`);
      });
  }
  return true
}

export const generateImages = async (inputPath: string | undefined, outputPath: string | undefined, _program: Command, opts?: GenImgOpts) => {
  let initialOpts: GenImgOpts = {
    config: undefined,
    name: 'generated'
  }

  if (opts) {
    initialOpts = {
      ...initialOpts,
      ...opts
    }
  }
  if (inputPath && outputPath) {
    const iPath = joinCwd(`./`, inputPath || '');
    const oPath = joinCwd(`./`, outputPath || '');
  
    const getExtendedFileName = (name: string) => `${oPath}${isSlash(oPath) ? name : `/${name}`}`;
    const extendedFileName = getExtendedFileName(initialOpts.name);

    const img = await readFile(iPath);
    const isOutDir = isDir(extendedFileName);
  
    if (!fs.existsSync(extendedFileName)) {
      await mkdir(extendedFileName, { recursive: true })
    }
    return gen(img, isOutDir, extendedFileName, iPath, program)
  }


  if (initialOpts.config) {
    const dataObj = await import(joinCwd(initialOpts.config)) as ImgGenConfig
    const checkConfig = isConfigCorrect(dataObj)
    if (checkConfig.success) {
      let _inputPath: string
      let _outputPath: string
      let _img: Buffer
      let extendedFileName: string

      const getExtendedFileName = (name: string) => `${_outputPath}${isSlash(_outputPath) ? name : `/${name}`}`
      
      if (dataObj.input && !dataObj.output || dataObj.output && !dataObj.input) {
        program.error(`output or input path does not exist`, { code: 'required.outputpath', exitCode: 1 })
      }
      
      if (dataObj.input && dataObj.output) {
        _inputPath = joinCwd(`./`, dataObj.input)
        _outputPath = joinCwd(`./`, dataObj.output)
        _img = await readFile(_inputPath)
      } else {
        program.error(`Unknown Error`, { code: 'unknown error', exitCode: 1 })
      }
      if (dataObj.folderName) {
        extendedFileName = getExtendedFileName(dataObj.folderName)
      } else {
        extendedFileName = getExtendedFileName('generated')
      }

      if (!fs.existsSync(extendedFileName)) {
        await mkdir(extendedFileName, { recursive: true })
      }
      return gen(_img, isDir(extendedFileName), extendedFileName, _inputPath, program, dataObj)
    } else {
      console.log(dataObj)
      _program.error(checkConfig.msg, { code: 'wrong.config', exitCode: 1 })
    }
  }

  return false
};
