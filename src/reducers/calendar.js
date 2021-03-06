import * as ActionTypes from '../actions';
import padStart from './../utils/padStart';

const addItems = (state, day, data, type) => {
  const items = { ...state };

  const newItems = {};
  // группируем по дате
  data.forEach((event) => {
    const dt = event.start.split('T')[0];
    if (!newItems[dt]) {
      newItems[dt] = [];
    }
    newItems[dt].push({ ...event, type });
  });

  Object.keys(newItems).forEach((dt) => {
    if (!items[dt]) {
      items[dt] = [];
    }
    items[dt] = [...items[dt].filter(item => item.type !== type), ...newItems[dt]];
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
const defaultState = {};
const calendar = (state = defaultState, action) => {
  switch (action.type) {
    case 'RESET_STORE':
      return defaultState;
    case ActionTypes.CALENDAR_ADD_ITEMS:
      return addItems(state, action.day, action.data, action.eventType);
    default:
      return state;
  }
};

export default calendar;
