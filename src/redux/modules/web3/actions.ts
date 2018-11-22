import { createAction } from 'redux-actions';
import Web3 = require('web3');

export const INIT_WEB3 = 'app/web3/init';
export const INIT_WEB3_SUCCESS = 'app/web3/init/success';

export const InitWeb3 = createAction(INIT_WEB3);

export const InitWeb3Success = createAction(
  INIT_WEB3_SUCCESS,
  (payload: {}) => payload
);
