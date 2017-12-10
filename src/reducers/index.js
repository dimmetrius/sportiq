import { combineReducers } from 'redux';
import * as user from './user';
import * as calendar from './calendar';
import * as clubs from './clubs';

export default combineReducers(Object.assign(user, calendar, clubs));
