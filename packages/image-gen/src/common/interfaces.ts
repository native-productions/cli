export interface GenImgOpts {
  name: string;
  config: string | undefined;
}

export interface Size {
  width: number;
  height: number;
  name: string;
  ext?: string;
}

export interface ImgGenConfig {
  sizes: Size[];
  folderName?: string;
  input?: string;
  output?: string;
}

export interface ConfigStatus {
  msg: string;
  success: boolean;
}