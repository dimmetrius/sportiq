/* eslint-disable import/prefer-default-export */
import * as ActionTypes from '../actions';

const defaultState = { token: '', loggedUser: {}, processing: false };

const user = (state = defaultState, action) => {
  switch (action.type) {
    case 'RESET_STORE':
      return defaultState;
    case ActionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case ActionTypes.SET_LOGGED_USER:
      return {
        ...state,
        loggedUser: action.loggedUser,
      };
    case ActionTypes.LOGIN_WITH_PASS_PROCESSING: {
      return {
        ...state,
        processing: action.processing,
      };
    }
    default:
      return state;
  }
};

export default user;
