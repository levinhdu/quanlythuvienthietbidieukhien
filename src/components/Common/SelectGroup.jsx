import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

const { Option, OptGroup } = Select;

const SelectGroup = ({ data, value, childListKey, optionsvalue, onChange, label, rootValue, ...others }) => {
  if (!isEmpty(data)) {
    return (
      <Select value={value} onChange={onChange} {...others}>
        {!isEmpty(rootValue) && <Option key="root" value={rootValue.value}>{rootValue.name}</Option>}
        {map(data, (item, index) => {
          return (
            <OptGroup key={index} label={item[label]}>
              { !isEmpty(item[childListKey]) && map(item[childListKey], val => {
                const [valValue, valName] = optionsvalue;
                return <Option key={val.id} value={val[valValue]}>{val[valName]}</Option>
              })}
            </OptGroup>
          )
        }
        )}
      </Select>
    );
  }
  return null;

}

SelectGroup.propTypes = {
  data: PropTypes.array.isRequired,
  childListKey: PropTypes.string.isRequired,
  optionsvalue: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default SelectGroup;
