/* eslint-disable no-underscore-dangle */
import store from '../store';

const getToken = () => {
  const state = store.getState();
  return state.user.token;
};

const checkData = (data) => {
  if (data.status === 200) {
    return data.json();
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

export default {
  coach: (start, end) => fetch(
    `http://sportiq.io/timetable/coach?end=${end}T00:00:00.000Z&start=${start}T00:00:00.000Z`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  ).then(checkData).then(embeddedTimetable),
  my: (start, end) => fetch(
    `http://sportiq.io/timetable/my?end=${end}T00:00:00.000Z&start=${start}T00:00:00.000Z`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  ).then(checkData).then(embeddedTimetable),
};
