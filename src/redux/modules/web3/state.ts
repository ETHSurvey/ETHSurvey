import { List, Record } from 'immutable';
import Web3 from 'web3';

import { Survey } from '@src/types/Survey';

export interface State {
  accounts: List<string>;
  error: Error;
  loading: boolean;
  network: string;
  networkId: number;
  survey: Survey;
  web3: Web3;
}

export const iWS: State = {
  accounts: List([]),
  error: null,
  loading: false,
  network: '',
  networkId: 0,
  survey: null,
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
