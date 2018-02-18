/* eslint-disable global-require */
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setLoggedUser } from './actions';
import ApiRequest from './utils/ApiRequest';
import sport from './icons/sport';
import padStart from './utils/padStart';
import getStrTimer from './utils/getStrTimer';
import { colors } from './utils/constants';
import QrButton from './components/QrButton';

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

class AgendaScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
    user: PropTypes.shape(),
    setLoggedUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      month: LocaleConfig.locales.ru.monthNames[new Date().getMonth()],
      items: {},
    };
  }

  componentDidMount() {
    ApiRequest.loggedUser().then((data) => {
      this.props.setLoggedUser(data);
    });
  }

  onClickItem = (item) => {
    if (item.type === 'my') {
      this.props.navigation.navigate('FeedBack', item);
    } else if (item.type === 'coach') {
      this.props.navigation.navigate('Members', item);
    }
  };

  setMonth = (month) => {
    this.setState({
      month,
    });
  };

  getColorByType(type) {
    switch (type) {
      case 'my':
        return '#ddecfb';
      case 'coach':
        return '#ffe8e8';
      default:
        return '#ffffff';
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

      /*
      curItem.name = event.group.name;
      curItem.color = event.group.color;
      curItem.icon = event.group.activities[0].className;
      */
    });
  };

  rowHasChanged(r1, r2) {
    return r1.id !== r2.id;
  }

  addEmptyDays = (year, month) => {
    const endDayNum = new Date(year, month, 0).getDate();
    for (let i = 1; i <= endDayNum; i++) {
      const dt = [padStart(year, 4, '0'), padStart(month, 2, '0'), padStart(i, 2, '0')].join('-');

      const items = this.state.items;
      if (!items[dt]) {
        items[dt] = [];
      }
    }
  };

  loadItems(day) {
    console.log(JSON.stringify(day));
    this.setMonth(LocaleConfig.locales.ru.monthNames[day.month]);
    const startDate = [padStart(day.year, 4, '0'), padStart(day.month, 2, '0'), '01'].join('-');

    const endDayNum = new Date(day.year, day.month, 0).getDate();
    const endDay = padStart(endDayNum, 2, '0');
    const endDate = [padStart(day.year, 4, '0'), padStart(day.month, 2, '0'), endDay].join('-');

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
  };

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  canQrScan() {
    const { loggedUser } = this.props.user;
    // eslint-disable-next-line
    return loggedUser && loggedUser._links && loggedUser._links.check_access_code;
  }

  renderEmptyDate() {
    return (
      <View style={[styles.item, { flexDirection: 'column' }]}>
        <Text />
        <Text>Нет занятий!</Text>
        <Text />
      </View>
    );
  }

  renderItem(item) {
    const startDate = new Date(item.start);
    const startTime = `${padStart(startDate.getHours(), 2, '0')}:${padStart(startDate.getMinutes(), 2, '0')}`;
    // <Ionicon name="md-checkmark" size={12} color={colors.grassyGreen} style={{ marginLeft: 15 }} />

    const len = getStrTimer(new Date(item.end) - new Date(item.start));
    return (
      <TouchableOpacity onPress={() => this.onClickItem(item)}>
        <View style={[styles.item, { flexDirection: 'row', backgroundColor: 'white' }]}>
          <View style={{ width: 50, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 5,
                  borderRadius: 5,
                  width: 40,
                  height: 40,
                  borderColor: colors.warmGrey,
                  borderWidth: 1,
                  backgroundColor: 'transparent',
                }}
              >
                <Text style={{ fontSize: 24, fontFamily: 'sports-48-x-48' }}>
                  {sport[item.group.activities[0].className] || ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ marginLeft: 15, fontSize: 15, fontWeight: '800', color: '#000000', textAlign: 'left' }}>
                {item.group.name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="clock-o" size={12} color={colors.warmGrey} style={{ marginLeft: 15 }} />
              <Text style={{ marginLeft: 3, fontSize: 12 }}>
                {startTime}
              </Text>
              <MaterialCommunityIcon name="clock-start" size={12} color={colors.warmGrey} style={{ marginLeft: 15 }} />
              <Text style={{ marginLeft: 3, fontSize: 12 }}>
                {len}
              </Text>
              <View
                style={{ width: 10, height: 10, marginLeft: 15, borderRadius: 5, backgroundColor: item.group.color }}
              />
              {item.billable
                ? <Ionicon name="logo-usd" size={12} color={colors.grassyGreen} style={{ marginLeft: 15 }} />
                : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Agenda
          // ref={(ref) => { if (ref) { this.AgRef = ref; console.log(ref); } }}
          items={this.state.items}
          loadItemsForMonth={day => this.loadItems(day)}
          selected={new Date().toJSON().split('T')[0]}
          renderItem={item => this.renderItem(item)}
          renderEmptyDate={() => this.renderEmptyDate()}
          rowHasChanged={(r1, r2) => this.rowHasChanged(r1, r2)}
          firstDay={1}
          onDayChange={(day) => {
            this.setMonth(LocaleConfig.locales.ru.monthNames[day.month - 1]);
          }}
          // agenda theme
          theme={{
            textLinkColor: colors.grassyGreen,
            selectedDayBackgroundColor: colors.grassyGreen,
            todayTextColor: colors.grassyGreen,
            dotColor: colors.grassyGreen,
            arrowColor: colors.grassyGreen,
            agendaTodayColor: colors.grassyGreen,
            // agendaDayTextColor: 'yellow',
            // agendaDayNumColor: 'green',
            // agendaTodayColor: 'red',
          }}
          // renderKnob={() => (<Text> {this.state.month} </Text>)}
          // hideKnob={false}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          // renderDay={(day, item) => (<Text>{day ? day.day: ''}</Text>)}
        />
        {this.canQrScan()
          ? <QrButton onPress={() => this.props.navigation.navigate('QrCode', { type: 'scan', mode: '0' })} />
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: isIos ? 20 : 0,
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    height: 70,
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

export default connect(mapStateToProps, {
  setLoggedUser,
})(AgendaScreen);
