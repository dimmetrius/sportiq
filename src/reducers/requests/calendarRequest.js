import * as ActionTypes from './../../actions';
import simpleRequestReducer from './simpleRequestReducer';

export const findAsCoachRequest = simpleRequestReducer(ActionTypes.findAsCoachRequest);
export const findAsTraineeRequest = simpleRequestReducer(ActionTypes.findAsTraineeRequest);
