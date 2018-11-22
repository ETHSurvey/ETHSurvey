import { Ethereum } from './ethereum';
import Web3 = require('web3');

declare global {
  interface Window {
    ethereum: Ethereum;
    web3: Web3;
  }
}
