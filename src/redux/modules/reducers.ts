import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// Types
import { History } from 'history';

// Reducers
import { web3Reducer } from './web3';

// tslint:disable-next-line:no-any
export default (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    web3State: web3Reducer
  });
