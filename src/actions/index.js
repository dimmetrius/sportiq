export const SET_TOKEN = 'SET_TOKEN';
export const SET_CALENDAR_DATA = 'SET_CALENDAR_DATA';

function action(type, payload = {}) {
  return { type, ...payload };
}

export const setToken = token => action(SET_TOKEN, { token });
export const setCalendarData = data => action(SET_CALENDAR_DATA, { data });
