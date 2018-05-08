import { NavigationActions } from 'react-navigation';

class NavService {
  constructor(name) {
    this.config = {};
    this.name = name;
  }

  setNavigator = (nav) => {
    if (nav) {
      // if (this.name) console.log(this.name, nav);
      this.config.navigator = nav;
    }
  };

  navigate = (routeName, params) => {
    if (this.config.navigator && routeName) {
      const action = NavigationActions.navigate({ routeName, params });
      this.config.navigator.dispatch(action);
    }
  };

  goBack = () => {
    if (this.config.navigator) {
      const action = NavigationActions.back({});
      this.config.navigator.dispatch(action);
    }
  };
}

export const rootNavService = new NavService('rootNavService');
export const tabsNavService = new NavService('tabsNavService');
export const calendarNavService = new NavService('calendarNavService');
export const subscriptionsNavService = new NavService('subscriptionsNavService');
export const clubsNavService = new NavService('clubsNavService');
