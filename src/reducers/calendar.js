/* eslint-disable import/prefer-default-export */
import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';

function data(state = [], action) {
  switch (action.type) {
    case ActionTypes.SET_CALENDAR_DATA:
      return action.data;
    default:
      return state;
  }
}

export const calendar = combineReducers({
  data,
});
