import * as ActionTypes from '../actions';

const defaultState = {};
export const transactions = (state = defaultState, action) => {
  const item = { [action.id]: action.transaction };
  switch (action.type) {
    case 'RESET_STORE':
      return defaultState;
    case ActionTypes.TRANSACTION_ADD_ITEM:
      return { ...state, ...item };
    default:
      return state;
  }
};
