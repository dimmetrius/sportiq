import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import GroupHeader from './GroupHeader';

it('renders correctly', () => {
  const rendered = renderer.create(<GroupHeader item={{}} />).toJSON();
  expect(rendered).toBeTruthy();
});
