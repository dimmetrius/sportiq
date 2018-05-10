import { compose, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { autoRehydrate } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import mySaga from './../sagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = compose(autoRehydrate())(createStore)(
  rootReducer,
  // applyMiddleware(logger),
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(mySaga);

export default store;
