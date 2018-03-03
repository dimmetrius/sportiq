// import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { takeEvery, call, put } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import { rootNavService } from '../utils/NavigationService';
import { showAlert } from '../utils/alerts';
import { validateEmail } from '../utils/validations';

// import { fetchUserInfo, fetchUserNotes, fetchUserRepos, postNote } from './userData';
/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/

import * as Actions from '../actions';

function* startLoginWithPass(action) {
  const { username, password } = action;
  if (!validateEmail(username)) {
    showAlert('невалидный email');
    return;
  }
  if (!(password.length > 0)) {
    showAlert('пароль не может быть пустым');
    return;
  }
  yield put(Actions.loginWithPassProcessing(true));
  const loginData = yield call(ApiRequest.login, username, password, Math.random(1).toString(), '{}');
  if (loginData.token) {
    yield put(Actions.setToken(loginData.token));
    //
    yield put(Actions.rootNavigate('TabsNavigator'));
  }
  yield put(Actions.loginWithPassProcessing(false));
}

function* rootNavigate(action) {
  const { routeName, params } = action;
  if (routeName === '<=') {
    yield call(rootNavService.goBack);
    return;
  }
  yield call(rootNavService.navigate, routeName, params);
}

function* startRegister(action) {
  const { name, username, password, password2 } = action;
  const { registering: { processing, success, failed }, ui: { setAuth } } = Actions;
  if (!(name.length > 0)) {
    showAlert('имя не может быть пустым');
    return;
  }
  if (!validateEmail(username)) {
    showAlert('невалидный email');
    return;
  }
  if (!(password.length > 0)) {
    showAlert('пароль не может быть пустым');
    return;
  }
  if (password !== password2) {
    showAlert('не совпадают пароли');
    return;
  }

  yield put(processing());
  const regData = yield call(ApiRequest.register, name, username, password, password2);

  if (regData.code === 200) {
    yield put(success(regData));
    showAlert(regData.message);
    yield put(setAuth());
  } else {
    yield put(failed(regData));
    showAlert(regData.error);
  }
}

function* mySaga() {
  yield [
    takeEvery(Actions.START_LOGIN_WITH_PASS, startLoginWithPass),
    takeEvery(Actions.ROOT_NAVIGATE, rootNavigate),
    takeEvery(Actions.registering.startCode, startRegister),
  ];
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/

// function* mySaga() {
//   yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
// }

export default mySaga;
