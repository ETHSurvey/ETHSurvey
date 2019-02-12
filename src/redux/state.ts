import { RouterState } from 'connected-react-router';

// States
import { Web3State } from './modules/web3';

export interface RootState {
  router: RouterState;
  web3State: Web3State;
}
