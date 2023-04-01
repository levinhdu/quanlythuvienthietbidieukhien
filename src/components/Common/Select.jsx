import React from 'react';
import { Select } from 'antd';
import isArray from 'lodash/isArray';
import indexOf from 'lodash/indexOf';

const { Option } = Select;

const CustomSelect = (props) => {
  if (props.optionsvalue) {
    const value = props.value ? props.value : (props.mode === 'multiple' || props.mode === 'tags') ? [] : undefined;
    return (
      <Select
        // muc dich su dung "props.name": xac dinh element theo dropdownClassName (auto test)
        dropdownClassName={`dropdown-${props.name}`}
        {...props}
        className={`w-100 ${props.className}`}
        value={value}
      >
        {props.data.map((item, i) => (
          <Option
            key={i}
            disabled={indexOf(props.dataDisable, item[props.optionsvalue[0]]) !== -1}
            name={item[props.optionsvalue[1]]}
            value={item[props.optionsvalue[0]]}
          >
            {item[props.optionsvalue[1]]}
          </Option>
        ))}
      </Select>
    )
  }

  const redata = isArray(props.data) ? props.data : [...props.data, props.data];
  return (
    <Select
      dropdownClassName={`dropdown-${props.name}`}
      {...props}
      className={`'w-100' ${props.className}`}
      value={redata.length ? props.value : undefined}
    >
      {redata.map((item, i) => (
        <Option
          key={i}
          disabled={indexOf(props.dataDisable, item.value) !== -1}
          name={item.name}
          value={item.value}
        >
          {item.name}
        </Option>
      ))}
    </Select>
  )
}

export default CustomSelect;
