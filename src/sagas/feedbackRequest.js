import { call, put, takeEvery, all } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import * as Actions from '../actions';

function* getFeedBackRequest(action) {
  const { id } = action;
  const {
    getFeedBackRequest: { processing, success, failed },
  } = Actions;

  yield put(processing());

  let feedback;
  try {
    feedback = yield call(ApiRequest.getFeedback, id);
  } catch (e) {
    yield put(failed());
    return;
  }

  if (feedback.status === 200) {
    const json = yield feedback.json();
    yield put(success());
    yield put(Actions.addFeedBackItem(id, json));
  } else {
    yield put(failed());
  }
}

function* setFeedBackRequest(action) {
  const { id, feedback } = action;
  const {
    setFeedBackRequest: { processing, success, failed },
  } = Actions;

  yield put(processing());

  let res;
  try {
    res = yield call(ApiRequest.setFeedback, id, feedback);
  } catch (e) {
    yield put(failed({ error: e }));
    return;
  }

  if (res.status === 200) {
    yield put(success());
    yield put(Actions.addFeedBackItem(id, feedback));
  } else {
    yield put(failed({}));
  }
}

export function sagas() {
  return all([
    takeEvery(Actions.getFeedBackRequest.startCode, getFeedBackRequest),
    takeEvery(Actions.setFeedBackRequest.startCode, setFeedBackRequest),
  ]);
}
