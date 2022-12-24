import moment from 'moment/moment';

export const calculateAge = (date) => {
  return moment().diff(date, 'years') + ' Tahun';
};
