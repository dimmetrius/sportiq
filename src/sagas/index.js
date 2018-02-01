// import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { takeEvery, call, put } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import { navigate } from '../utils/NavigationService';

// import { fetchUserInfo, fetchUserNotes, fetchUserRepos, postNote } from './userData';
/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
import * as Actions from '../actions';

function* startLoginWithPass(action) {
  const { username, password } = action;
  yield put(Actions.loginWithPassProcessing(true));
  const loginData = yield call(ApiRequest.login, username, password, 'id', '{event a kind of JSON}');
  if (loginData.token) {
    yield put(Actions.setToken(loginData.token));
    //
    yield put(Actions.rootNavigate('TabsNavigator'));
  }
  yield put(Actions.loginWithPassProcessing(false));
}

function* rootNavigate(action) {
  const { routeName, params } = action;
  yield call(navigate, routeName, params);
}

function* mySaga() {
  yield [
    takeEvery(Actions.START_LOGIN_WITH_PASS, startLoginWithPass),
    takeEvery(Actions.ROOT_NAVIGATE, rootNavigate),
    // takeEvery('USER_NOTES_FETCH_REQUESTED', fetchUserNotes),
    // takeEvery('USER_REPOS_FETCH_REQUESTED', fetchUserRepos),
    // takeEvery('USER_NOTE_POST_REQUESTED', postNote),
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
