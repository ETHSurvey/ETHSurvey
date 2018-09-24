import { Record } from 'immutable';
import Web3 from 'web3';

export interface State {
  error: Error;
  loading: boolean;
  web3: Web3;
}

export const iWS: State = {
  error: null,
  loading: false,
  web3: null
};

export class Web3State extends Record(iWS) {
  constructor(params: State) {
    super(params);
  }

  get<T extends keyof State>(key: T): State[T] {
    return super.get(key);
  }

  set<T extends keyof State, V extends keyof State>(key: T, value: State[V]) {
    return super.set(key, value);
  }
}
