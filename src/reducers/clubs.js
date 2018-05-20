/* eslint-disable import/prefer-default-export */
import * as ActionTypes from '../actions';

const defaultState = {};
function clubs(state = '', action) {
  switch (action.type) {
    case 'RESET_STORE':
      return defaultState;
    case ActionTypes.SET_CLUBS:
      return action.clubs;
    default:
      return state;
  }
}

export default clubs;
