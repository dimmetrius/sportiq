import * as ActionTypes from '../actions';

const defaultState = {};
const feedbacks = (state = defaultState, action) => {
  const item = { [action.id]: action.feedback };
  switch (action.type) {
    case 'RESET_STORE':
      return defaultState;
    case ActionTypes.FEEDBACK_ADD_ITEM:
      return { ...state, ...item };
    default:
      return state;
  }
};

export default feedbacks;
