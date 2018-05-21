import { call, put, all, takeEvery } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import * as Actions from '../actions';

function* openTransaction(action) {
  const { id } = action;
  const {
    openTransaction: { processing, success, failed },
  } = Actions;

  yield put(processing());

  const training = yield call(ApiRequest.openTransaction, id);

  if (training.status === 200) {
    const json = yield training.json();
    yield put(success());
    yield put(Actions.addTransactionItem(id, json));
  } else {
    yield put(failed());
  }
}

function* closeTransaction(action) {
  const { transactionId, timetableId } = action;
  const {
    closeTransaction: { processing, success, failed },
  } = Actions;

  yield put(processing());

  const training = yield call(ApiRequest.closeTransaction, transactionId, timetableId);

  if (training.status === 200 || training.status === 208) {
    const json = yield training.json();
    yield put(success());
    yield put(Actions.addTransactionItem(timetableId, json));
  } else {
    yield put(failed({ error: {} }));
  }
}

export function sagas() {
  return all([
    takeEvery(Actions.openTransaction.startCode, openTransaction),
    takeEvery(Actions.closeTransaction.startCode, closeTransaction),
  ]);
}
