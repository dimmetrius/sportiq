import * as ActionTypes from './../../actions';
import simpleRequestReducer from './simpleRequestReducer';

export const getFeedBackRequest = simpleRequestReducer(ActionTypes.getFeedBackRequest);
export const setFeedBackRequest = simpleRequestReducer(ActionTypes.setFeedBackRequest);
