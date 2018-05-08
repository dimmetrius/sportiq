/* eslint-disable no-underscore-dangle */
import store from '../store';
import { sportiqHost } from './constants';

const getToken = () => {
  const state = store.getState();
  return state.user.token;
};

const getData = data => data.json();

const checkData = (data) => {
  // console.log(`checkData:${JSON.stringify(data)}`);
  if (data.status >= 200 && data.status < 300) {
    return data.json();
  }
  if (data.status === 401) {
    console.log('unauthorized');
    return {};
  }
  try {
    return data.json();
  } catch (e) {
    return {};
  }
};

const checkResponse = (data) => {
  console.log(`checkResponse:${JSON.stringify(data)}`);
  if (data.status >= 200 && data.status < 300) {
    return {};
  }
  if (data.status === 401) {
    console.log('unauthorized');
    return {};
  }
  return {};
};

const embeddedClub = (data) => {
  if (data._embedded) {
    if (data._embedded.club) {
      return data._embedded.club;
    }
  }
  return [];
};

const embeddedTimetable = (data) => {
  if (data._embedded) {
    if (data._embedded.timetable) {
      return data._embedded.timetable;
    }
  }
  return [];
};

const embeddedSubscriptions = (data) => {
  if (data._embedded) {
    if (data._embedded.subscription) {
      return data._embedded.subscription;
    }
  }
  return [];
};

const embeddedMembers = (data) => {
  if (data._embedded) {
    if (data._embedded.groupMembers) {
      return data._embedded.groupMembers;
    }
  }
  return [];
};

const fetchOptions = (method, data, noauth) => {
  const options = {};
  options.method = method || 'GET';
  options.headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  if (noauth) {
    delete options.headers.Authorization;
  }
  if (data) {
    options.body = data;
    options.headers['Content-Type'] = 'application/json';
  }
  return options;
};

export default {
  getToken: (social, authkey, keyvalue) => fetch(`${sportiqHost}/auth/${social}/signin?${authkey}=${keyvalue}`),
  login: (username, password, deviceId, deviceInfo) =>
    fetch(
      `${sportiqHost}/mobile/1.0/api/login/authenticate`,
      fetchOptions('POST', JSON.stringify({ username, password, deviceId, deviceInfo }), true),
    ).then(checkData),
  register: (name, username, password, password2) =>
    fetch(
      `${sportiqHost}/mobile/1.0/api/user/registration`,
      fetchOptions(
        'POST',
        JSON.stringify({ username: name, email: username, password, matchingPassword: password2 }),
        true,
      ),
    ).then(getData),
  socialLogin: (social, socialCode, deviceId, deviceInfo) =>
    fetch(
      `${sportiqHost}/mobile/1.0/api/login/authenticate`,
      fetchOptions('POST', JSON.stringify({ social, socialCode, deviceId, deviceInfo }), true),
    ).then(checkData),
  coach: (start, end) =>
    fetch(`${sportiqHost}/timetable/coach?end=${end}T00:00:00.000Z&start=${start}T00:00:00.000Z`, fetchOptions())
      .then(checkData)
      .then(embeddedTimetable),
  my: (start, end) =>
    fetch(`${sportiqHost}/timetable/my?end=${end}T00:00:00.000Z&start=${start}T00:00:00.000Z`, fetchOptions())
      .then(checkData)
      .then(embeddedTimetable),
  getMember: id =>
    fetch(`${sportiqHost}/timetable/${id}/member`, fetchOptions())
      .then(checkData)
      .then(embeddedMembers),
  checkMember: (id, memberId, was) =>
    fetch(`${sportiqHost}/timetable/${id}/member/${memberId}/checkin`, fetchOptions(was ? 'DELETE' : 'POST')).then(
      checkResponse,
    ),
  getSubscriptions: () =>
    fetch(`${sportiqHost}/subscription/my`, fetchOptions())
      .then(checkData)
      .then(embeddedSubscriptions),
  openTransaction: timetableId =>
    fetch(`${sportiqHost}/access_transaction/`, fetchOptions('POST', JSON.stringify({ timetableId }))).then(checkData),
  closeTransaction: (transactionId, timetableId) =>
    fetch(
      `${sportiqHost}/access_transaction/`,
      fetchOptions('PUT', JSON.stringify({ id: transactionId, timetableId })),
    ).then(checkData),
  loggedUser: () => fetch(`${sportiqHost}/loggedUser`, fetchOptions()).then(checkData),
  getUser: id => fetch(`${sportiqHost}/user/${id}`, fetchOptions()).then(checkData),
  getClubs: () =>
    fetch(`${sportiqHost}/club`, fetchOptions())
      .then(checkData)
      .then(embeddedClub),
  getClub: id => fetch(`${sportiqHost}/club/${id}`, fetchOptions()).then(checkData),
  beClubMember: id => fetch(`${sportiqHost}/club/${id}/member`, fetchOptions('PUT')).then(checkData),
  // >>
  findAsTrainee: (start, end) =>
    fetch(
      `${sportiqHost}/mobile/1.0/api/timetable/trainee?start=${start}T00:00:00.000Z&end=${end}T00:00:00.000Z`,
      fetchOptions(),
    ),
  findAsCoach: (start, end) =>
    fetch(
      `${sportiqHost}/mobile/1.0/api/timetable/coach?start=${start}T00:00:00.000Z&end=${end}T00:00:00.000Z`,
      fetchOptions(),
    ),
  getFeedback: id => fetch(`${sportiqHost}/mobile/1.0/api/timetable/training/${id}/feedback`, fetchOptions()),
  setFeedback: (id, data) =>
    fetch(
      `${sportiqHost}/mobile/1.0/api/timetable/training/${id}/feedback`,
      fetchOptions('POST', JSON.stringify(data)),
    ),
};
