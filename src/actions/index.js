export const SET_TOKEN = 'SET_TOKEN';

function action(type, payload = {}) {
  return { type, ...payload };
}
export const setToken = token => action(SET_TOKEN, { token });
