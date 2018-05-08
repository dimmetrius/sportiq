import * as ActionTypes from '../actions';
import padStart from './../utils/padStart';

const addItems = (state, day, data, type) => {
  const items = { ...state };

  data.forEach((event) => {
    const dt = event.start.split('T')[0];
    if (!items[dt]) {
      items[dt] = [];
    }

    const itemId = items[dt].find(item => item.id === event.id);

    const curItem = {
      type,
      ...event,
    };
    if (itemId) {
      Object.assign(itemId, curItem);
    } else {
      items[dt].push(curItem);
    }

    items[dt].sort((a, b) => new Date(a.start) - new Date(b.start));
  });

  // add empty days for all month
  const endDayNum = new Date(day.year, day.month, 0).getDate();
  for (let i = 1; i <= endDayNum; i++) {
    const dt = [padStart(day.year, 4, '0'), padStart(day.month, 2, '0'), padStart(i, 2, '0')].join('-');

    if (!items[dt]) {
      items[dt] = [];
    }
  }

  return items;
};

const calendar = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.CALENDAR_ADD_ITEMS:
      return addItems(state, action.day, action.data, action.eventType);
    default:
      return state;
  }
};

export default calendar;
