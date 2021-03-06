/* eslint-disable global-require */
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import PropTypes from 'prop-types';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { findAsTraineeRequest, calendarNavigate, findAsCoachRequest } from './actions';
import sport from './icons/sport';
import padStart from './utils/padStart';
import getStrTimer from './utils/getStrTimer';
import { colors, TRAINEE, COACH, TRAINING_QR } from './utils/constants';
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
    calendar: PropTypes.shape(),
    user: PropTypes.shape(),
    findAsTrainee: PropTypes.func.isRequired,
    findAsCoach: PropTypes.func.isRequired,
    // goToFeedBack: PropTypes.func.isRequired,
    // goToMembers: PropTypes.func.isRequired,
    goToQrScan: PropTypes.func.isRequired,
    goToTraining: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    headerBackTitle: '',
    headerTruncatedBackTitle: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      month: LocaleConfig.locales.ru.monthNames[new Date().getMonth()],
    };
  }

  onClickItem = (item) => {
    const { /* goToFeedBack, goToMembers, */ goToTraining } = this.props;
    const { trainingDetailsForTrainee, trainingDetailsForCoach } = item._links;
    if (item.type === TRAINEE) {
      if (trainingDetailsForTrainee) {
        const arr = trainingDetailsForTrainee.href.split('/');
        const id = arr[arr.length - 2];
        // goToFeedBack(id);
        goToTraining(id, TRAINEE, item.start);
      }
    } else if (item.type === COACH) {
      if (trainingDetailsForCoach) {
        const arr = trainingDetailsForCoach.href.split('/');
        const id = arr[arr.length - 2];
        // goToMembers(id);
        goToTraining(id, COACH, item.start);
      }
    }
  };

  setMonth = (month) => {
    this.setState({
      month,
    });
  };

  getColorByType(type) {
    switch (type) {
      // case TRAINEE:
      //   return '#ddecfb';
      case COACH:
        return '#ffe8e8';
      default:
        return '#ffffff';
    }
  }

  rowHasChanged(r1, r2) {
    return r1.id !== r2.id;
  }

  loadItems(day) {
    const { findAsTrainee, findAsCoach } = this.props;
    this.setMonth(LocaleConfig.locales.ru.monthNames[day.month]);
    findAsCoach(day);
    findAsTrainee(day);
  }

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
        <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 15 }}>Нет занятий!</Text>
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
        <View style={[styles.item, { flexDirection: 'row', backgroundColor: this.getColorByType(item.type) }]}>
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
              <Ionicon name="ios-time-outline" size={12} color={colors.warmGrey} style={{ marginLeft: 15 }} />
              <Text style={{ marginLeft: 3, fontSize: 12, color: colors.warmGrey }}>{startTime}</Text>
              <Ionicon name="ios-timer-outline" size={12} color={colors.warmGrey} style={{ marginLeft: 15 }} />
              <Text style={{ marginLeft: 3, fontSize: 12, color: colors.warmGrey }}>{len}</Text>
              <View
                style={{ width: 10, height: 10, marginLeft: 15, borderRadius: 5, backgroundColor: item.group.color }}
              />
              {item.billable ? (
                <Ionicon name="logo-usd" size={12} color={colors.grassyGreen} style={{ marginLeft: 15 }} />
              ) : null}
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
          items={this.props.calendar}
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
        {this.canQrScan() ? <QrButton onPress={() => this.props.goToQrScan(TRAINING_QR)} /> : null}
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

const mapDispatchToProps = dispatch => ({
  findAsTrainee: day => dispatch(findAsTraineeRequest.start({ day })),
  findAsCoach: day => dispatch(findAsCoachRequest.start({ day })),
  goToFeedBack: id => dispatch(calendarNavigate('FeedBack', { id })),
  goToMembers: id => dispatch(calendarNavigate('Members', { id })),
  goToQrScan: tp => dispatch(calendarNavigate('QrScan', { type: tp })),
  goToTraining: (id, type, date) => dispatch(calendarNavigate('Training', { id, type, date })),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgendaScreen);
