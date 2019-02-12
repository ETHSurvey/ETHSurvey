import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createEpicMiddleware } from 'redux-observable';
import { logger } from 'redux-logger';

// Reducers
import createRootReducer from './modules/reducers';

// Epics
import rootEpic from './modules/epics';

// Root State
import { RootState } from './state';

// Create a history of your choosing (we're using a browser history in this case)
export const history = createBrowserHistory();

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
  const store = createStore(
    createRootReducer(history),
    initialState,
    applyMiddleware(...middlewares)
  );

  epicMiddleware.run(rootEpic);

  return store;
}
