/* eslint-disable import/prefer-default-export */
import * as ActionTypes from '../actions';

const defaultState = { auth: true };

const ui = (state = defaultState, action) => {
  const { auth } = action;
  switch (action.type) {
    case 'RESET_STORE':
      return defaultState;
    case ActionTypes.UI_SET_AUTH:
      return {
        ...state,
        auth,
      };
    case ActionTypes.UI_SET_REG:
      return {
        ...state,
        auth,
      };
    default:
      return state;
  }
};

export default ui;
