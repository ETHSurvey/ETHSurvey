import IpfsApi from 'ipfs-api';

export const ipfs = new IpfsApi('localhost', '5001', { protocol: 'http' });

// const data = JSON.stringify({ name: 'IPFS TEST 101' });

// const buffer = Buffer.from(data);

// ipfs.add(buffer, { pin: false }).then((hash: string) => console.log(hash));

// ipfs.get('QmTZf5b2L6nm2KmEzfRNFiGdHYbEyD1tWSERvCGhyqDjjQ', (err: Error, files: []) => {
//   files.forEach((file: {}) => {
//     console.log(file.path);
//     console.log(file.content.toString('utf8'));
//   });
// });
