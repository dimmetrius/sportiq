import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Stars from './Stars';

it('renders correctly', () => {
  renderer.create(<Stars />);
});
