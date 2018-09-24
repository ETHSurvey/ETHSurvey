import { Action } from 'redux-actions';
import { ActionsObservable, combineEpics } from 'redux-observable';

import * as Web3Actions from './actions';

const loginEpic = (action$: ActionsObservable<Action<Error>>) => {
  return action$.ofType(Web3Actions.INIT_WEB3);
};

export const epics = combineEpics(loginEpic);
