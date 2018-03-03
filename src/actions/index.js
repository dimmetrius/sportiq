export const SET_TOKEN = 'SET_TOKEN';
export const SET_CALENDAR_DATA = 'SET_CALENDAR_DATA';
export const SET_LOGGED_USER = 'SET_LOGGED_USER';
export const SET_CLUBS = 'SET_CLUBS';
export const START_OAUTH_LOGIN = 'START_OAUTH_LOGIN';
export const START_LOGIN_WITH_PASS = 'START_LOGIN_WITH_PASS';
export const LOGIN_WITH_PASS_PROCESSING = 'LOGIN_WITH_PASS_PROCESSING';

export const UI_SET_AUTH = 'UI_SET_AUTH';
export const UI_SET_REG = 'UI_SET_REG';

export const ROOT_NAVIGATE = 'ROOT_NAVIGATE';
export const TABS_NAVIGATE = 'TABS_NAVIGATE';
export const CALENDAR_NAVIGATE = 'CALENDAR_NAVIGATE';
export const SUBSCRIPTIONS_NAVIGATE = 'SUBSCRIPTIONS_NAVIGATE';
export const CLUBS_NAVIGATE = 'CLUBS_NAVIGATE';

function action(type, payload = {}) {
  return { type, ...payload };
}

export function requestCodes(code) {
  return {
    code,
    startCode: `${code}_START`,
    processingCode: `${code}_PROCESSING`,
    successCode: `${code}_SUCCESS`,
    failedCode: `${code}_FAILED`,
  };
}

function requestActions(code) {
  const codes = requestCodes(code);
  return {
    start: data => action(`${code}_START`, { ...data }),
    processing: () => action(`${code}_PROCESSING`, { processing: true }),
    success: data => action(`${code}_SUCCESS`, { ...data, processing: false }),
    failed: data => action(`${code}_FAILED`, { ...data, processing: false }),
    ...codes,
  };
}

export const setToken = token => action(SET_TOKEN, { token });
export const startOauthLogin = network => action(START_OAUTH_LOGIN, { network });
export const startLoginWithPass = (username, password) => action(START_LOGIN_WITH_PASS, { username, password });
export const loginWithPassProcessing = processing => action(LOGIN_WITH_PASS_PROCESSING, { processing });

export const setCalendarData = data => action(SET_CALENDAR_DATA, { data });
export const setLoggedUser = loggedUser => action(SET_LOGGED_USER, { loggedUser });
export const setClubs = clubs => action(SET_CLUBS, { clubs });

// Navigation
const navAction = code => (routeName, params) => action(code, { routeName, params });
export const rootNavigate = navAction(ROOT_NAVIGATE);
export const tabsNavigate = navAction(TABS_NAVIGATE);
export const calendarNavigate = navAction(CALENDAR_NAVIGATE);
export const subscriptionsNavigate = navAction(SUBSCRIPTIONS_NAVIGATE);
export const clubsNavigate = navAction(CLUBS_NAVIGATE);

export const registering = requestActions('REGISTERING');
export const ui = {
  setAuth: () => action(UI_SET_AUTH, { auth: true }),
  setReg: () => action(UI_SET_REG, { auth: false }),
};
