import { combineReducers } from 'redux';
import * as userReducer from './user';
import * as calendarReducer from './calendar';
import * as clubsReduser from './clubs';

export default combineReducers(Object.assign(
  userReducer,
  calendarReducer,
  clubsReduser,
));
