import * as ActionTypes from '../actions';

const feedbacks = (state = {}, action) => {
  const item = { [action.id]: action.feedback };
  switch (action.type) {
    case ActionTypes.FEEDBACK_ADD_ITEM:
      return { ...state, ...item };
    default:
      return state;
  }
};

export default feedbacks;
