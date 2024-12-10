import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import Orientation from 'react-native-orientation-locker';

const App = () => {
  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);
  return <AppNavigator />;
};

export default App;
