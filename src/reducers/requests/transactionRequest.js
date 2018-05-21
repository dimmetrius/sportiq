import * as ActionTypes from './../../actions';
import simpleRequestReducer from './simpleRequestReducer';

export const openTransaction = simpleRequestReducer(ActionTypes.openTransaction);
export const closeTransaction = simpleRequestReducer(ActionTypes.closeTransaction);
