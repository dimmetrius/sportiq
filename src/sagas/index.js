// import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { ActionSheetIOS, Platform } from 'react-native';
import { takeEvery, call, put, all } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import { showAlert } from '../utils/alerts';
import { validateEmail } from '../utils/validations';
import * as navigation from './navigation';
import * as calendar from './calendarRequest';
import * as feedback from './feedbackRequest';
import * as training from './trainingRequest';
import * as transaction from './transactionRequest';

// import { fetchUserInfo, fetchUserNotes, fetchUserRepos, postNote } from './userData';
/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/

import * as Actions from '../actions';

function* startLoginWithPass(action) {
  const { username, password } = action;
  if (!validateEmail(username) && username !== 'Edward') {
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

function* registerRequest(action) {
  const { name, username, password, password2 } = action;
  const {
    registerRequest: { processing, success, failed },
    ui: { setAuth },
  } = Actions;
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

function showActionSheet(options) {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex: options.length,
          },
          (action, buttonIndex) => resolve({ action, buttonIndex }),
        );
      } else {
        // UIManager.showPopupMenu(findNodeHandle(this.refs.menu), options, () => {}, onSelect);
        reject();
      }
    } catch (e) {
      reject(e);
    }
  });
}

function* otherPress() {
  const { logOut } = Actions;
  const options = ['Выйти из приложения', 'Отмена'];

  let sheet;
  try {
    sheet = yield call(showActionSheet, options);
    if (
      (Platform.OS === 'ios' && sheet.action === 0) ||
      (Platform.OS === 'android' && sheet.action === 'itemSelected' && sheet.buttonIndex === 0)
    ) {
      yield put(logOut());
    }
  } catch (e) {
    return 0;
  }
  return 0;
}

function* onlogOut() {
  const { setLoggedUser, setToken, rootNavigate } = Actions;
  yield put(setLoggedUser({}));
  yield put(setToken(''));
  yield put(rootNavigate('__reset__'));
}

function* mySaga() {
  yield all([
    navigation.sagas(),
    takeEvery(Actions.START_LOGIN_WITH_PASS, startLoginWithPass),
    takeEvery(Actions.registerRequest.startCode, registerRequest),
    takeEvery(Actions.LOG_OUT, onlogOut),
    calendar.sagas(),
    takeEvery(Actions.OTHER_PRESS, otherPress),
    feedback.sagas(),
    training.sagas(),
    transaction.sagas(),
  ]);
}

export default mySaga;
