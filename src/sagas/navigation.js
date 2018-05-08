import { call } from 'redux-saga/effects';
import { rootNavService, clubsNavService, calendarNavService } from '../utils/NavigationService';

function* navigateWithService(service, action) {
  const { routeName, params } = action;
  if (routeName === '<=') {
    yield call(service.goBack);
    return;
  }
  yield call(service.navigate, routeName, params);
}

export function* rootNavigate(action) {
  yield call(navigateWithService, rootNavService, action);
}

export function* clubsNavigate(action) {
  yield call(navigateWithService, clubsNavService, action);
}

export function* calendarNavigate(action) {
  yield call(navigateWithService, calendarNavService, action);
}
