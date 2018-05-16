import * as ActionTypes from '../actions';

export const transactions = (state = {}, action) => {
  const item = { [action.id]: action.transaction };
  switch (action.type) {
    case ActionTypes.TRANSACTION_ADD_ITEM:
      return { ...state, ...item };
    default:
      return state;
  }
};
