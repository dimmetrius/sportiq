import { compose, createStore } from 'redux';
import { autoRehydrate } from 'redux-persist';
import rootReducer from '../reducers';

const store = compose(autoRehydrate())(createStore)(rootReducer);

// begin periodically persisting the store

export default store;
