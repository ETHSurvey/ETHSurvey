import { RouterState } from 'react-router-redux';

// States
import { Web3State } from './modules/web3';

export interface RootState {
  router: RouterState;
  web3: Web3State;
}
