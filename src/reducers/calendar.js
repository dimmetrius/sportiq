import * as ActionTypes from '../actions';

const calendar = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.SET_CALENDAR_DATA:
      return action.data;
    default:
      return state;
  }
};

export default calendar;
