import { createStore } from 'redux';

import rootReducer from './root_reducer';

function makeStore() {
  if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    return createStore(rootReducer, undefined, window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  return createStore(rootReducer);
}

export default makeStore();
