import { showMessage } from 'react-native-flash-message';
import { colors } from './colors';

export const showError = (message) => {
  showMessage({
    message: message,
    type: 'default',
    backgroundColor: '#C86161',
    color: colors.white,
  });
};

export const showSuccess = (message) => {
  showMessage({
    message: message,
    type: 'default',
    backgroundColor: '#3AA76D',
    color: colors.white,
  });
};
