import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { apiMiddleware } from 'redux-api-middleware';
import * as reducers from './ducks';

const loggerMiddleware = createLogger({
  collapsed: (getState, action, logEntry) => !logEntry.error,
});

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    //applyMiddleware(loggerMiddleware, thunk, apiMiddleware),
    applyMiddleware(apiMiddleware, loggerMiddleware, thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(combineReducers(reducers), initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
