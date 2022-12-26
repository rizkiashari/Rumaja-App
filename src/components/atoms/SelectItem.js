import React from 'react';
import { Select } from 'native-base';

const SelectItem = ({ label, value }) => {
  return <Select.Item label={label} value={value} />;
};

export default SelectItem;
