import { compose, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { autoRehydrate } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import appReducer from '../reducers';
import mySaga from './../sagas';

/*
import { LOG_OUT } from './../actions';
const rootReducer = (_state, action) => {
  let state = _state;
  if (action.type === LOG_OUT) {
    Object.keys(state).forEach((key) => {
      storage.removeItem(`persist:${key}`);
    });
    state = undefined;
  }

  return appReducer(state, action);
};
*/

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = compose(autoRehydrate())(createStore)(
  appReducer,
  applyMiddleware(logger),
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(mySaga);

export default store;
