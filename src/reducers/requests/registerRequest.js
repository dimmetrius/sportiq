import * as ActionTypes from './../../actions';

const defaultState = { processing: false };

const registerRequest = (state = defaultState, action) => {
  const { body, message, status, code, error, processing } = action;
  switch (action.type) {
    case 'RESET_STORE':
      return defaultState;
    case ActionTypes.registerRequest.processingCode:
      return {
        ...state,
        processing,
      };
    case ActionTypes.registerRequest.successCode: {
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
    case ActionTypes.registerRequest.failedCode: {
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

export default registerRequest;
