import * as ActionTypes from './../../actions';
import simpleRequestReducer from './simpleRequestReducer';

export const loggedUserRequest = simpleRequestReducer(ActionTypes.loggedUserRequest);
