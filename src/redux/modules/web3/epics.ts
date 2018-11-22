import { Action } from 'redux-actions';
import { ActionsObservable, combineEpics, ofType } from 'redux-observable';
import Web3 from 'web3';

import { switchMap } from 'rxjs/operators';

import * as Web3Actions from './actions';
import { getWeb3 } from '@src/core/services';

const initWeb3Epic = (action$: ActionsObservable<Action<Web3>>) => {
  return action$.pipe(
    ofType(Web3Actions.INIT_WEB3),
    switchMap(() => {
      return getWeb3().then(payload => Web3Actions.InitWeb3Success(payload));
    })
  );
};

export const epics = combineEpics(initWeb3Epic);
