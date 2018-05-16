import { combineReducers } from 'redux';
import user from './user';
import calendar from './calendar';
import clubs from './clubs';
import registerRequest from './requests/registerRequest';
import { findAsTraineeRequest, findAsCoachRequest } from './requests/calendarRequest';
import { getFeedBackRequest, setFeedBackRequest } from './requests/feedbackRequest';
import ui from './ui';
import feedbacks from './feedbacks';
import { coachTrainings, traineeTrainings } from './trainings';
import { getTrainingAsCoach, getTrainingAsTrainee, setTrainingDescription } from './requests/trainingRequest';
import { openTransaction, closeTransaction } from './requests/transactionRequest';
import { transactions } from './transactions';

export default combineReducers({
  user,
  calendar,
  feedbacks,
  clubs,
  ui,
  coachTrainings,
  traineeTrainings,
  transactions,
  // requests
  registerRequest,
  // calendar
  findAsTraineeRequest,
  findAsCoachRequest,
  // feedback
  getFeedBackRequest,
  setFeedBackRequest,
  // training
  getTrainingAsCoach,
  getTrainingAsTrainee,
  setTrainingDescription,
  // transactions
  openTransaction,
  closeTransaction,
});
