export const SET_TOKEN = 'SET_TOKEN';
export const SET_CALENDAR_DATA = 'SET_CALENDAR_DATA';
export const SET_LOGGED_USER = 'SET_LOGGED_USER';
export const SET_CLUBS = 'SET_CLUBS';
export const START_OAUTH_LOGIN = 'START_OAUTH_LOGIN';
export const START_LOGIN_WITH_PASS = 'START_LOGIN_WITH_PASS';
export const LOGIN_WITH_PASS_PROCESSING = 'LOGIN_WITH_PASS_PROCESSING';
export const ROOT_NAVIGATE = 'ROOT_NAVIGATE';

function action(type, payload = {}) {
  return { type, ...payload };
}

export const setToken = token => action(SET_TOKEN, { token });
export const startOauthLogin = network => action(START_OAUTH_LOGIN, { network });
export const startLoginWithPass = (username, password) => action(START_LOGIN_WITH_PASS, { username, password });
export const loginWithPassProcessing = processing => action(LOGIN_WITH_PASS_PROCESSING, { processing });

export const setCalendarData = data => action(SET_CALENDAR_DATA, { data });
export const setLoggedUser = loggedUser => action(SET_LOGGED_USER, { loggedUser });
export const setClubs = clubs => action(SET_CLUBS, { clubs });
export const rootNavigate = (routeName, params) => action(ROOT_NAVIGATE, { routeName, params });
