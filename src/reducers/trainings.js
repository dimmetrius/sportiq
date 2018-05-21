import * as ActionTypes from '../actions';

const defaultState = {};
export const coachTrainings = (state = defaultState, action) => {
  const item = { [action.id]: action.training };
  switch (action.type) {
    case 'RESET_STORE':
      return defaultState;
    case ActionTypes.ADD_COACH_TRAINING:
      return { ...state, ...item };
    case ActionTypes.UPDATE_COACH_TRAINING: {
      const training = state[action.id];
      const updated = { [action.id]: { ...training, ...action.training } };
      return { ...state, ...updated };
    }
    default:
      return state;
  }
};

export const traineeTrainings = (state = defaultState, action) => {
  const item = { [action.id]: action.training };
  switch (action.type) {
    case 'RESET_STORE':
      return defaultState;
    case ActionTypes.ADD_TRAINEE_TRAINING:
      return { ...state, ...item };
    default:
      return state;
  }
};
