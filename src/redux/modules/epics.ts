import { combineEpics } from 'redux-observable';

// Epics
import { epics as web3Epics } from './web3';

const rootEpic = combineEpics(web3Epics);

export default rootEpic;
