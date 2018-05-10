import { call, takeEvery, all } from 'redux-saga/effects';
import * as Actions from '../actions';
import { rootNavService, clubsNavService, calendarNavService } from '../utils/NavigationService';

function* navigateWithService(service, action) {
  const { routeName, params } = action;
  if (routeName === '<=') {
    yield call(service.goBack);
    return;
  }
  yield call(service.navigate, routeName, params);
}

function* rootNavigate(action) {
  yield call(navigateWithService, rootNavService, action);
}

function* clubsNavigate(action) {
  yield call(navigateWithService, clubsNavService, action);
}

function* calendarNavigate(action) {
  yield call(navigateWithService, calendarNavService, action);
}

export function sagas() {
  return all([
    takeEvery(Actions.ROOT_NAVIGATE, rootNavigate),
    takeEvery(Actions.CALENDAR_NAVIGATE, calendarNavigate),
    takeEvery(Actions.CLUBS_NAVIGATE, clubsNavigate),
  ]);
}
