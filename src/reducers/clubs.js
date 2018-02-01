/* eslint-disable import/prefer-default-export */
import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';

function all(state = '', action) {
  switch (action.type) {
    case ActionTypes.SET_CLUBS:
      return action.clubs;
    default:
      return state;
  }
}

const clubs = combineReducers({
  all,
});

export default clubs;
