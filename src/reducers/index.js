import { combineReducers } from 'redux';
import * as userReducer from './user';
import * as calendarReducer from './calendar';

export default combineReducers(Object.assign(
  userReducer,
  calendarReducer,
));
