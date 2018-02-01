import { combineReducers } from 'redux';
import user from './user';
import calendar from './calendar';
import clubs from './clubs';

export default combineReducers({
  user,
  calendar,
  clubs,
});
