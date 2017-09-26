/* eslint-disable import/prefer-default-export */
import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';

function token(state = '', action) {
  switch (action.type) {
    case ActionTypes.SET_TOKEN:
      return action.token;
    default:
      return state;
  }
}

function loggedUser(state = {}, action) {
  switch (action.type) {
    case ActionTypes.SET_LOGGED_USER:
      return action.loggedUser;
    default:
      return state;
  }
}

export const user = combineReducers({
  token,
  loggedUser,
});
