export const SET_TOKEN = 'SET_TOKEN';
export const CALENDAR_ADD_ITEMS = 'CALENDAR_ADD_ITEMS';
export const FEEDBACK_ADD_ITEM = 'FEEDBACK_ADD_ITEM';
export const SET_LOGGED_USER = 'SET_LOGGED_USER';
export const SET_CLUBS = 'SET_CLUBS';
export const START_OAUTH_LOGIN = 'START_OAUTH_LOGIN';
export const START_LOGIN_WITH_PASS = 'START_LOGIN_WITH_PASS';
export const LOGIN_WITH_PASS_PROCESSING = 'LOGIN_WITH_PASS_PROCESSING';
export const LOG_OUT = 'LOG_OUT';
export const RESET_STORE = 'RESET_STORE';

export const ADD_TRAINEE_TRAINING = 'ADD_TRAINEE_TRAINING';
export const ADD_COACH_TRAINING = 'ADD_COACH_TRAINING';

export const UI_SET_AUTH = 'UI_SET_AUTH';
export const UI_SET_REG = 'UI_SET_REG';

export const ROOT_NAVIGATE = 'ROOT_NAVIGATE';
export const TABS_NAVIGATE = 'TABS_NAVIGATE';
export const CALENDAR_NAVIGATE = 'CALENDAR_NAVIGATE';
export const SUBSCRIPTIONS_NAVIGATE = 'SUBSCRIPTIONS_NAVIGATE';
export const CLUBS_NAVIGATE = 'CLUBS_NAVIGATE';

export const TRANSACTION_ADD_ITEM = 'TRANSACTION_ADD_ITEM';

export const EVENT_401 = 'EVENT_401';
export const EVENT_403 = 'EVENT_403';
export const EVENT_50X = 'EVENT_50X';

export const OTHER_PRESS = 'OTHER_PRESS';

function action(type, payload = {}) {
  return { type, ...payload };
}

function requestCodes(code) {
  return {
    code,
    startCode: `${code}_START`,
    processingCode: `${code}_PROCESSING`,
    successCode: `${code}_SUCCESS`,
    failedCode: `${code}_FAILED`,
  };
}

function generateRequestActions(code) {
  const codes = requestCodes(code);
  return {
    start: data => action(`${code}_START`, { ...data }),
    processing: () => action(`${code}_PROCESSING`, { processing: true }),
    success: data => action(`${code}_SUCCESS`, { ...data, processing: false }),
    failed: data => action(`${code}_FAILED`, { error: true, ...data, processing: false }),
    ...codes,
  };
}

const navAction = code => (routeName, params) => action(code, { routeName, params });

export const resetStore = () => action(RESET_STORE);
export const setClubs = clubs => action(SET_CLUBS, { clubs });

/* *** Navigation *** */
export const rootNavigate = navAction(ROOT_NAVIGATE);
export const tabsNavigate = navAction(TABS_NAVIGATE);
export const calendarNavigate = navAction(CALENDAR_NAVIGATE);
export const subscriptionsNavigate = navAction(SUBSCRIPTIONS_NAVIGATE);
export const clubsNavigate = navAction(CLUBS_NAVIGATE);

/* register & logOut & user */
export const registerRequest = generateRequestActions('REGISTER_REQUEST');
export const loggedUserRequest = generateRequestActions('LOGGED_USER_REQUEST');
export const setLoggedUser = loggedUser => action(SET_LOGGED_USER, { loggedUser });
export const setToken = token => action(SET_TOKEN, { token });
export const startOauthLogin = network => action(START_OAUTH_LOGIN, { network });
export const startLoginWithPass = (username, password) => action(START_LOGIN_WITH_PASS, { username, password });
export const loginWithPassProcessing = processing => action(LOGIN_WITH_PASS_PROCESSING, { processing });
export const logOut = () => action(LOG_OUT);

/* calendar */
export const findAsTraineeRequest = generateRequestActions('FIND_AS_TRAINEE_REQUEST');
export const findAsCoachRequest = generateRequestActions('FIND_AS_COACH_REQUEST');
export const addCalendarItems = (day, data, eventType) => action(CALENDAR_ADD_ITEMS, { day, data, eventType });

/* feedback */
export const getFeedBackRequest = generateRequestActions('GET_FEEDBACK_REQUEST');
export const setFeedBackRequest = generateRequestActions('SET_FEEDBACK_REQUEST');
export const addFeedBackItem = (id, feedback) => action(FEEDBACK_ADD_ITEM, { id, feedback });

/* training */
export const getTrainingAsTrainee = generateRequestActions('GET_TRAINING_AS_TRAINEE_REQUEST');
export const getTrainingAsCoach = generateRequestActions('GET_TRAINING_AS_COACH_REQUEST');
export const setTrainingDescription = generateRequestActions('SET_TRAINING_DESCRIPTION');
export const addCoachTraining = (id, training) => action(ADD_COACH_TRAINING, { id, training });
export const addTraineeTraining = (id, training) => action(ADD_TRAINEE_TRAINING, { id, training });

/* transactions */
export const openTransaction = generateRequestActions('OPEN_TRANSACTION');
export const closeTransaction = generateRequestActions('CLOSE_TRANSACTION');
export const addTransactionItem = (id, transaction) => action(TRANSACTION_ADD_ITEM, { id, transaction });

export const otherPress = action(OTHER_PRESS);

export const ui = {
  setAuth: () => action(UI_SET_AUTH, { auth: true }),
  setReg: () => action(UI_SET_REG, { auth: false }),
};
