import { call, put } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import * as Actions from '../actions';

export function* getFeedBackRequest(action) {
  const { id } = action;
  const {
    getFeedBackRequest: { processing, success, failed },
  } = Actions;

  yield put(processing());

  const feedback = yield call(ApiRequest.getFeedback, id);

  if (feedback.status === 200) {
    const json = yield feedback.json();
    yield put(success());
    yield put(Actions.addFeedBackItem(id, json));
  } else {
    yield put(failed());
  }
}

export function* setFeedBackRequest(action) {
  const { id, feedback } = action;
  const {
    setFeedBackRequest: { processing, success, failed },
  } = Actions;

  yield put(processing());

  const res = yield call(ApiRequest.setFeedback, id, feedback);

  if (res.status === 200) {
    yield put(success());
    yield put(Actions.addFeedBackItem(id, feedback));
  } else {
    yield put(failed({}));
  }
}
