/* eslint-disable global-require */
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import ApiRequest from './utils/ApiRequest';
import sport from './icons/sport';

LocaleConfig.locales.ru = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: ['Янв', 'Фвр', 'Мрт', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Снт', 'Окт', 'Нбр', 'Дек'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['ВС.', 'ПН.', 'ВТ.', 'СР.', 'ЧТ.', 'ПТ.', 'СБ.'],
};

LocaleConfig.defaultLocale = 'ru';

const padStart = (_str, _targetLength, _padString) => {
  const str = _str.toString();
  let padString = _padString;
  let targetLength = _targetLength;
  padString = padString || ' ';
  if (str.length > targetLength) {
    return str;
  }
  targetLength -= str.length;
  if (targetLength > padString.length) {
    padString += padString.repeat(targetLength / padString.length);
  }
  return padString.slice(0, targetLength) + str;
};


class AgendaScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      month: LocaleConfig.locales.ru.monthNames[(new Date()).getMonth()],
      items: {},
    };
  }

  onClickItem = (item) => {
    if (item.type === 'my') {
      this.props.navigation.navigate('FeedBack', {
        id: item.id,
      });
    } else if (item.type === 'coach') {
      this.props.navigation.navigate('Members', {
        id: item.id,
      });
    }
  };

  setMonth = (month) => {
    this.setState({
      month,
    });
  }

  getStrTimer = (ms) => {
    const hourInMS = 1000 * 60 * 60;
    const minInMS = 1000 * 60;
    // const secInMs = 1000;

    let countTail = ms;
    const hourPart = Math.floor(countTail / hourInMS);
    countTail -= hourPart * hourInMS;

    const minPart = Math.floor(countTail / minInMS);
    countTail -= minPart * minInMS;

    // const secPart = Math.floor(countTail / secInMs);

    return `${hourPart} ч ${minPart} мин`;
  };

  getColorByType(type) {
    switch (type) {
      case 'my': return '#ddecfb';
      case 'coach': return '#ffe8e8';
      default: return '#ffffff';
    }
  }

  addItems = (data, type) => {
    data.forEach((event) => {
      const dt = event.start.split('T')[0];
      const items = this.state.items;
      if (!items[dt]) {
        items[dt] = [];
      }

      const itemId = items[dt].find(item => item.id === event.id);

      let curItem = {};
      if (itemId) {
        curItem = itemId;
      } else {
        items[dt].push(curItem);
      }
      curItem.type = type;
      curItem.id = event.id;
      curItem.groupId = event.group.id;
      curItem.start = event.start;
      curItem.end = event.end;
      curItem.name = event.group.name;
      curItem.color = event.group.color;
      curItem.icon = event.group.activities[0].className;
    });
  }

  rowHasChanged(r1, r2) {
    return r1.id !== r2.id;
  }

  addEmptyDays = (year, month) => {
    const endDayNum = new Date(year, month, 0).getDate();
    for (let i = 1; i <= endDayNum; i++) {
      const dt = [
        padStart(year, 4, '0'),
        padStart(month, 2, '0'),
        padStart(i, 2, '0'),
      ].join('-');

      const items = this.state.items;
      if (!items[dt]) {
        items[dt] = [];
      }
    }
  }

  loadItems(day) {
    console.log(JSON.stringify(day));
    this.setMonth(LocaleConfig.locales.ru.monthNames[day.month]);
    const startDate = [
      padStart(day.year, 4, '0'),
      padStart(day.month, 2, '0'),
      '01',
    ].join('-');

    const endDayNum = new Date(day.year, day.month, 0).getDate();
    const endDay = padStart(endDayNum, 2, '0');
    const endDate = [
      padStart(day.year, 4, '0'),
      padStart(day.month, 2, '0'),
      endDay,
    ].join('-');

    console.log('date', startDate, endDate);

    ApiRequest.coach(startDate, endDate).then((data) => {
      this.addItems(data, 'coach');
      this.addEmptyDays(day.year, day.month);
      this.refreshState();
    });

    ApiRequest.my(startDate, endDate).then((data) => {
      this.addItems(data, 'my');
      this.addEmptyDays(day.year, day.month);
      this.refreshState();
    });

    /*
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);

        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: `Item for ${strTime}`,
              height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }
        }
      }
      // console.log(this.state.items);
    }, 1000);
    */
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  refreshState = () => {
    const newItems = {};
    Object.keys(this.state.items).forEach((key) => {
      newItems[key] = this.state.items[key];
    });

    this.setState({
      items: newItems,
    });
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  renderEmptyDate() {
    return (
      <View style={[styles.item, { flexDirection: 'column' }]}>
        <Text>{' '}</Text>
        <Text>Нет занятий!</Text>
        <Text>{' '}</Text>
      </View>
    );
  }

  renderItem(item) {
    const startDate = new Date(item.start);
    const startTime = `${padStart(startDate.getHours(), 2, '0')}:${padStart(startDate.getMinutes(), 2, '0')}`;

    const len = this.getStrTimer(new Date(item.end) - new Date(item.start));
    return (
      <TouchableOpacity
        onPress={() => this.onClickItem(item)}
      >
        <View style={[styles.item, { flexDirection: 'row', backgroundColor: this.getColorByType(item.type) }]}>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="clock-o" size={12} color="black" />
              <Text style={{ fontSize: 12, marginLeft: 5 }}>{startTime}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 10 }}>{len}</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                width: 40,
                height: 40,
                backgroundColor: item.color,
              }}
              >
                <Text style={{ fontSize: 24, fontFamily: 'sports-48-x-48' }}>{sport[item.icon] || ''}</Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 3, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, textAlign: 'left' }}>
                {item.name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <Agenda
          // ref={(ref) => { if (ref) { this.AgRef = ref; console.log(ref); } }}
          items={this.state.items}
          loadItemsForMonth={day => this.loadItems(day)}
          selected={(new Date()).toJSON().split('T')[0]}
          renderItem={item => this.renderItem(item)}
          renderEmptyDate={() => this.renderEmptyDate()}
          rowHasChanged={(r1, r2) => this.rowHasChanged(r1, r2)}
          firstDay={1}
          onDayChange={(day) => { this.setMonth(LocaleConfig.locales.ru.monthNames[day.month - 1]); }}
          // renderKnob={() => (<Text> {this.state.month} </Text>)}
          // hideKnob={false}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          // renderDay={(day, item) => (<Text>{day ? day.day: ''}</Text>)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});

const mapStateToProps = state => ({
  user: state.user,
  calendar: state.calendar,
});

export default connect(mapStateToProps, {})(AgendaScreen);
