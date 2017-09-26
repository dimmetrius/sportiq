export const SET_TOKEN = 'SET_TOKEN';
export const SET_CALENDAR_DATA = 'SET_CALENDAR_DATA';
export const SET_LOGGED_USER = 'SET_LOGGED_USER';

function action(type, payload = {}) {
  return { type, ...payload };
}

export const setToken = token => action(SET_TOKEN, { token });
export const setCalendarData = data => action(SET_CALENDAR_DATA, { data });
export const setLoggedUser = loggedUser => action(SET_LOGGED_USER, { loggedUser });
