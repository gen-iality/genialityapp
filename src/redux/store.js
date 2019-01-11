import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
const middlewares = [thunk];

/** DEV **/
/*import { createLogger } from 'redux-logger';
const middlewares = [thunk,createLogger()];*/
/** END */

const store = createStore(
    combineReducers({...reducers}),
    compose(applyMiddleware(...middlewares))
);
window.store = store;
export default store;
