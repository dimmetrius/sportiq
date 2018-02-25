import { combineReducers } from 'redux';
import user from './user';
import calendar from './calendar';
import clubs from './clubs';
import registering from './registering';
import ui from './ui';

export default combineReducers({
  user,
  calendar,
  clubs,
  registering,
  ui,
});
