// import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { takeEvery, call, put } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import { navigate, goBack } from '../utils/NavigationService';

// import { fetchUserInfo, fetchUserNotes, fetchUserRepos, postNote } from './userData';
/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
import * as Actions from '../actions';

function* startLoginWithPass(action) {
  const { username, password } = action;
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
    yield call(goBack);
    return;
  }
  yield call(navigate, routeName, params);
}

function* startRegister(action) {
  const { name, username, password, password2 } = action;
  const { registering: { processing, success, failed }, ui: { setAuth } } = Actions;
  if (password !== password2) {
    // eslint-disable-next-line
    alert('не совпадают пароли');
    return;
  }
  const p = processing();
  yield put(p);
  const regData = yield call(ApiRequest.register, name, username, password, password2);

  if (regData.code === 200) {
    yield put(success(regData));
    // eslint-disable-next-line
    alert(regData.message);
    yield put(setAuth());
  } else {
    // eslint-disable-next-line
    alert(regData.error);
    yield put(failed(regData));
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
