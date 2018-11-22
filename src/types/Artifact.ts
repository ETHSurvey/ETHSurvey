import { ABIDefinition } from 'web3/eth/abi';

export interface Artifact {
  contractName: string;
  abi: ABIDefinition[];
  networks: {
    [networkId: number]: {
      address: string;
    };
  };
}
