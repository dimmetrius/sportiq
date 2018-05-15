import { call, put, all, takeEvery } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import * as Actions from '../actions';

function* getTrainingAsCoach(action) {
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

function* getTrainingAsTrainee(action) {
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

function* setTrainingDescription(action) {
  const { id, description } = action;
  const {
    setTrainingDescription: { processing, success, failed },
  } = Actions;

  yield put(processing());

  let training;
  try {
    training = yield call(ApiRequest.setTrainingDescription, id, description);
  } catch (e) {
    yield put(failed({ error: e }));
    return;
  }

  if (training.status === 200) {
    yield put(success());
  } else {
    yield put(failed());
  }
}

export function sagas() {
  return all([
    takeEvery(Actions.getTrainingAsTrainee.startCode, getTrainingAsTrainee),
    takeEvery(Actions.getTrainingAsCoach.startCode, getTrainingAsCoach),
    takeEvery(Actions.setTrainingDescription.startCode, setTrainingDescription),
  ]);
}
