/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: CMakeLists.txt renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});
