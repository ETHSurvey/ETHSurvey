import { List } from 'immutable';
import Web3 from 'web3';

import SurveyArtifact from '@contracts/SurveyContract.sol';

// Types
import { Ethereum } from '@src/types';
import { getContractAddress } from '@src/core/utils';

export const getWeb3 = async () => {
  let web3: Web3;

  // modern dApp browsers
  if (window.ethereum) {
    const ethereum = window.ethereum as Ethereum;
    web3 = new Web3(ethereum);

    // try {
    //   await ethereum.enable();
    // } catch (error) {
    //   console.log(error);
    // }
  } else if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3 = new Web3(window.web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
  }

  // Get accounts from web3
  const accounts = List(await web3.eth.getAccounts());

  // Get network from web3
  const networkId = await web3.eth.net.getId();

  const survey = new web3.eth.Contract(
    SurveyArtifact.abi,
    getContractAddress(SurveyArtifact, networkId)
  );

  return {
    accounts,
    networkId,
    survey,
    web3
  };
};
