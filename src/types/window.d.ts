import Web3 from 'web3';
import { provider } from 'web3-providers';

declare global {
  interface Window {
    ethereum: provider;
    web3: Web3;
  }
}
