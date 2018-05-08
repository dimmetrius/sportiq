import * as ActionTypes from '../actions';

export const coachTrainings = (state = {}, action) => {
  const item = { [action.id]: action.training };
  switch (action.type) {
    case ActionTypes.ADD_COACH_TRAINING:
      return { ...state, ...item };
    default:
      return state;
  }
};

export const traineeTrainings = (state = {}, action) => {
  const item = { [action.id]: action.training };
  switch (action.type) {
    case ActionTypes.ADD_TRAINEE_TRAINING:
      return { ...state, ...item };
    default:
      return state;
  }
};
