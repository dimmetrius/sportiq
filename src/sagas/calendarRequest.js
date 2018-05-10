import { call, put } from 'redux-saga/effects';
import ApiRequest from '../utils/ApiRequest';
import * as Actions from '../actions';
import padStart from './../utils/padStart';
import { TRAINEE, COACH } from './../utils/constants';

const embeddedTimetable = (data) => {
  if (data._embedded) {
    if (data._embedded.timetables) {
      return data._embedded.timetables;
    }
  }
  return [];
};

export function* findAsTraineeRequest(action) {
  const { day } = action;
  const {
    findAsTraineeRequest: { processing, success, failed },
  } = Actions;

  const startDate = [padStart(day.year, 4, '0'), padStart(day.month, 2, '0'), '01'].join('-');
  const endDayNum = new Date(day.year, day.month, 0).getDate();
  const endDay = padStart(endDayNum, 2, '0');
  const endDate = [padStart(day.year, 4, '0'), padStart(day.month, 2, '0'), endDay].join('-');

  yield put(processing());

  let timetable;
  try {
    timetable = yield call(ApiRequest.findAsTrainee, startDate, endDate);
  } catch (e) {
    yield put(failed({}));
    return;
  }

  if (timetable.status === 200) {
    const json = yield timetable.json();
    yield put(success(json));
    yield put(Actions.addCalendarItems(day, embeddedTimetable(json), TRAINEE));
  } else {
    yield put(failed({}));
  }
}

export function* findAsCoachRequest(action) {
  const { day } = action;
  const {
    findAsTraineeRequest: { processing, success, failed },
  } = Actions;

  const startDate = [padStart(day.year, 4, '0'), padStart(day.month, 2, '0'), '01'].join('-');
  const endDayNum = new Date(day.year, day.month, 0).getDate();
  const endDay = padStart(endDayNum, 2, '0');
  const endDate = [padStart(day.year, 4, '0'), padStart(day.month, 2, '0'), endDay].join('-');

  yield put(processing());

  let timetable;
  try {
    timetable = yield call(ApiRequest.findAsCoach, startDate, endDate);
  } catch (e) {
    yield put(failed({ error: e }));
    return;
  }

  if (timetable.status === 200) {
    const json = yield timetable.json();
    yield put(success(json));
    yield put(Actions.addCalendarItems(day, embeddedTimetable(json), COACH));
  } else {
    yield put(failed({}));
  }
}
