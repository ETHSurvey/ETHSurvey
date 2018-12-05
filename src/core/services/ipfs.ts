import IpfsHttpClient from 'ipfs-http-client';

// Types
import { IpfsFile } from '@src/types';

let host: string;
let port: string;
let protocol: string;

if (process.env.NODE_ENV === 'production') {
  host = 'ipfs.ethsurvey.co';
  port = '5002';
  protocol = 'https';
} else {
  host = 'localhost';
  port = '5001';
  protocol = 'http';
}

const ipfsClient = new IpfsHttpClient({ host, port, protocol });

export const ipfs = {
  createDirectory(path: string): Promise<void> {
    return ipfsClient.files.mkdir(path);
  },
  getFileList(path?: string): Promise<IpfsFile[]> {
    return ipfsClient.files.ls(path, { long: true });
  },
  readFileContent(path: string): Promise<string> {
    return ipfsClient.files
      .read(path)
      .then((buffer: Buffer) => buffer.toString('UTF8'));
  },
  writeFileContent(path: string, data: {}): Promise<void> {
    const buffer = Buffer.from(JSON.stringify(data));
    return ipfsClient.files.write(path, buffer, { create: true, pin: true });
  }
};
