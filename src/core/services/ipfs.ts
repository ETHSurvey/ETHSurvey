import IpfsApi from 'ipfs-api';

const ipfsApi = new IpfsApi('localhost', '5001', { protocol: 'http' });

export const ipfs = {
  createDirectory(path: string): Promise<void> {
    return ipfsApi.files.mkdir(path);
  },
  readFileContent(path: string): Promise<string> {
    return ipfsApi.files
      .read(path)
      .then((buffer: Buffer) => buffer.toString('UTF8'));
  },
  writeFileContent(path: string, data: {}): Promise<void> {
    const buffer = Buffer.from(JSON.stringify(data));
    return ipfsApi.files.write(path, buffer, { create: true });
  }
};
