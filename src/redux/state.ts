import { RouterState } from 'react-router-redux';

// States
import { Web3State } from './modules/web3';

export interface RootState {
  routerState: RouterState;
  web3State: Web3State;
}
