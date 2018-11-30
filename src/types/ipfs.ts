export const IPFS_FILE_EXISTS = 'file already exists';
export const IPFS_FILE_NOT_FOUND = 'file does not exist';

export const enum IpfsFileType {
  Directory = 'directory',
  File = 'file'
}

export interface IpfsFile {
  hash: string;
  name: string;
  size: number;
  type: IpfsFileType;
}
