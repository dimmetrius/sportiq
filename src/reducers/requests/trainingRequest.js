import * as ActionTypes from './../../actions';
import simpleRequestReducer from './simpleRequestReducer';

export const getTrainingAsTrainee = simpleRequestReducer(ActionTypes.getTrainingAsTrainee);
export const getTrainingAsCoach = simpleRequestReducer(ActionTypes.getTrainingAsCoach);
