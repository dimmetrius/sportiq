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

export const user = combineReducers({
  token,
});
