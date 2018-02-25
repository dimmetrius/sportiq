/* eslint-disable import/prefer-default-export */
import * as ActionTypes from '../actions';

const defaultState = { processing: false };

const registering = (state = defaultState, action) => {
  const { body, message, status, code, error, processing } = action;
  switch (action.type) {
    case ActionTypes.registering.processingCode:
      return {
        ...state,
        processing,
      };
    case ActionTypes.registering.successCode: {
      return {
        ...state,
        body,
        message,
        status,
        code,
        error,
        processing,
      };
    }
    case ActionTypes.registering.failedCode: {
      return {
        ...state,
        body,
        message,
        status,
        code,
        error,
        processing,
      };
    }
    default:
      return state;
  }
};

export default registering;
