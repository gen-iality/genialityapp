import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
const middlewares = [thunk];

/** DEV **/
/*import { createLogger } from 'redux-logger';
const middlewares = [thunk,createLogger()];*/
/** END */

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({ ...reducers }),
  /* preloadedState, */ composeEnhancers(compose(applyMiddleware(...middlewares)))
);
export default store;
