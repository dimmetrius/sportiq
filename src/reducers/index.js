import { combineReducers } from 'redux';
import user from './user';
import calendar from './calendar';
import clubs from './clubs';
import registerRequest from './requests/registerRequest';
import { findAsTraineeRequest, findAsCoachRequest } from './requests/calendarRequest';
import { getFeedBackRequest, setFeedBackRequest } from './requests/feedbackRequest';
import ui from './ui';
import feedbacks from './feedbacks';

export default combineReducers({
  user,
  calendar,
  feedbacks,
  clubs,
  ui,
  // requests
  registerRequest,
  findAsTraineeRequest,
  findAsCoachRequest,
  getFeedBackRequest,
  setFeedBackRequest,
});
