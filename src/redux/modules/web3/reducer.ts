import { Action, handleActions } from 'redux-actions';

import * as Web3Actions from './actions';
import { iWS, State, Web3State } from './state';

export const web3Reducer = handleActions<Web3State, State>(
  {
    [Web3Actions.INIT_WEB3]: (state: Web3State, action: Action<State>) => {
      return state.merge({ error: null, loading: true });
    }
  },
  new Web3State(iWS)
);
