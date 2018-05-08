const defaultState = { processing: false };

const simpleRequestReducer = requestType => (state = defaultState, action) => {
  const { processing } = action;
  switch (action.type) {
    case requestType.processingCode:
      return {
        ...state,
        processing,
        ok: false,
      };
    case requestType.successCode: {
      return {
        ...state,
        processing,
        ok: true,
      };
    }
    case requestType.failedCode: {
      return {
        ...state,
        processing,
        ok: false,
      };
    }
    default:
      return state;
  }
};

export default simpleRequestReducer;
