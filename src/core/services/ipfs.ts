import IpfsHttpClient from 'ipfs-http-client';

// Types
import { IpfsFile } from '@src/types';

const ipfsClient = new IpfsHttpClient('localhost', '5001', {
  protocol: 'http'
});

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
