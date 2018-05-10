import { call, put, all, takeEvery } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import * as Actions from '../actions';

export function* getTrainingAsCoach(action) {
  const { id } = action;
  const {
    getTrainingAsCoach: { processing, success, failed },
  } = Actions;

  yield put(processing());

  const training = yield call(ApiRequest.getTrainingAsCoach, id);

  if (training.status === 200) {
    const json = yield training.json();
    yield put(success());
    yield put(Actions.addCoachTraining(id, json));
  } else {
    yield put(failed());
  }
}

export function* getTrainingAsTrainee(action) {
  const { id } = action;
  const {
    getTrainingAsTrainee: { processing, success, failed },
  } = Actions;

  yield put(processing());

  let training;
  try {
    training = yield call(ApiRequest.getTrainingAsTrainee, id);
  } catch (e) {
    yield put(failed({ error: e }));
    return;
  }

  if (training.status === 200) {
    const json = yield training.json();
    yield put(success());
    yield put(Actions.addTraineeTraining(id, json));
  } else {
    yield put(failed());
  }
}

export function sagas() {
  return all([
    takeEvery(Actions.getTrainingAsTrainee.startCode, getTrainingAsTrainee),
    takeEvery(Actions.getTrainingAsCoach.startCode, getTrainingAsCoach),
  ]);
}
