const defaultState = { processing: false };

const simpleRequestReducer = requestType => (state = defaultState, action) => {
  const { processing, error } = action;
  switch (action.type) {
    case requestType.processingCode:
      return {
        ...state,
        processing,
        ok: false,
        error,
      };
    case requestType.successCode: {
      return {
        ...state,
        processing,
        ok: true,
        error,
      };
    }
    case requestType.failedCode: {
      return {
        ...state,
        processing,
        ok: false,
        error,
      };
    }
    default:
      return state;
  }
};

export default simpleRequestReducer;
