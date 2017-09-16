/* eslint-disable no-underscore-dangle */
import store from '../store';

const getToken = () => {
  const state = store.getState();
  return state.user.token;
};

const checkData = (data) => {
  console.log(`checkData:${JSON.stringify(data)}`);
  if (data.status === 200) {
    return data.json();
  }
  if (data.status === 401) {
    console.log('unauthorized');
    return {};
  }
  return {};
};

const checkResponse = (data) => {
  console.log(`checkResponse:${JSON.stringify(data)}`);
  if (data.status === 200) {
    return {};
  }
  if (data.status === 401) {
    console.log('unauthorized');
    return {};
  }
  return {};
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

const embeddedFeedBack = data => data.feedback || {};

const fetchOptions = (method, data) => {
  const options = {};
  options.method = method || 'GET';
  options.headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  if (data) {
    options.body = data;
    options.headers['Content-Type'] = 'application/json';
  }
  return options;
};

export default {
  coach: (start, end) => fetch(
    `http://sportiq.io/timetable/coach?end=${end}T00:00:00.000Z&start=${start}T00:00:00.000Z`,
    fetchOptions(),
  ).then(checkData).then(embeddedTimetable),
  my: (start, end) => fetch(
    `http://sportiq.io/timetable/my?end=${end}T00:00:00.000Z&start=${start}T00:00:00.000Z`,
    fetchOptions(),
  ).then(checkData).then(embeddedTimetable),
  getFeedback: id => fetch(
    `http://sportiq.io/timetable/${id}/feedback`,
    fetchOptions(),
  ).then(checkData).then(embeddedFeedBack),
  sendFeedback: (id, data) => fetch(
    `http://sportiq.io/timetable/${id}/feedback`,
    fetchOptions('PUT', data),
  ).then(checkData).then(embeddedFeedBack),
  getMember: id => fetch(
    `http://sportiq.io/timetable/${id}/member`,
    fetchOptions(),
  ).then(checkData).then(embeddedMembers),
  checkMember: (id, memberId, was) => fetch(
    `http://sportiq.io/timetable/${id}/member/${memberId}/checkin`,
    fetchOptions(was ? 'DELETE' : 'POST'),
  ).then(checkResponse),
  getSubscriptions: () => fetch(
    'http://sportiq.io/subscription/my',
    fetchOptions(),
  ).then(checkData).then(embeddedSubscriptions),
};
