import { applyMiddleware, combineReducers, createStore } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { createEpicMiddleware } from 'redux-observable';
import { logger } from 'redux-logger';

// Reducers
import rootReducers from './modules/reducers';

// Epics
import rootEpic from './modules/epics';

// Root State
import { RootState } from './state';

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const historyMiddleware = routerMiddleware(history);

// Epic Middleware
const epicMiddleware = createEpicMiddleware();

// Middlewares
const middlewares = [epicMiddleware, historyMiddleware];

// Redux Dev Tools Extension
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
}

export default function configureStore(initialState?: RootState) {
  const rootReducer = combineReducers({
    ...rootReducers,
    routerState: routerReducer
  });

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );

  epicMiddleware.run(rootEpic);

  return store;
}
