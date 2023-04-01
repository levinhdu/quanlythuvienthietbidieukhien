import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Checkbox } from 'antd';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';

import {
  Select,
  TreeSelect,
  TreeSelectRole,
  DatePicker,
  DatePickerRange,
  MonthPicker,
  WeekPicker
} from 'src/components/Common';

const { Search } = Input;

function ToolbarExtra(props) {
  const { childContent, list } = props;

  const renderItem = (item, index) => {
    switch (item.type) {
      case 'search':
        return (
          <Col key={index} md={item.size || 24} xs={24}>
            <h5>{item.label}</h5>
            <Search
              value={item.value}
              onChange={item.onChange}
              onPressEnter={item.onPressEnter}
              onSearch={item.onSearch}
              placeholder={item.placeholder}
              enterButton
              loading={item.loading}
            />
          </Col>
        );
      case 'checkbox':
        return (
          <Col key={index} md={item.size || 24} xs={24}>
            <h5>{item.label}</h5>
            <Checkbox
              style={{ marginTop: 5 }}
              onChange={item.onChange}
              checked={item.value}
            >
              {item.title}
            </Checkbox>
          </Col>
        )
      case 'select':
        return (
          <Col key={index} md={item.size || 24} xs={24}>
            <h5>{item.label}</h5>
            <Select
              autoClearSearchValue
              data={item.data}
              onChange={item.onChange}
              showSearch
              optionsvalue={item.options}
              placeholder={item.placeholder}
              style={{ width: '100%' }}
              value={item.value}
              optionFilterProp="children"
              disabled={item.disabled}
              loading={item.loading}
            />
          </Col>
        );
      case 'treeSelect':
        return (
          <Col key={index} md={item.size || 24} xs={24}>
            <h5>{item.label}</h5>
            <TreeSelect
              className="tree-select-item"
              datatreeselect={item.data}
              onChange={item.onChange}
              showSearch
              options={item.options}
              placeholder={item.placeholder}
              style={{ width: '100%' }}
              value={item.value}
            />
          </Col>)
      case 'treeSelectRole':
        return (
          <Col key={index} md={item.size || 24} xs={24}>
            <h5>{item.label}</h5>
            <TreeSelectRole
              className="tree-select-item"
              datatreeselect={item.data}
              onChange={item.onChange}
              options={item.options}
              placeholder={item.placeholder}
              style={{ width: '100%' }}
              value={item.value}
              disabled={item.disabled}
            />
          </Col>
        );
      case 'dateRanger':
        return (
          <Col key={index} md={item.size || 24} xs={24}>
            <h5>{item.label}</h5>
            <DatePickerRange
              allowClear={item.allowClear}
              className="heading-dateRangePicker"
              format={'DD/MM/YYYY'}
              onChange={item.onChange}
              showTime={false}
              value={item.value}
              disabledStartDate={item.disabledStartDate}
            />
          </Col>
        )
      case 'day':
        return (
          <Col key={index} md={item.size || 24} xs={24}>
            <h5>{item.label}</h5>
            <DatePicker
              allowClear={false}
              className="heading-dateRangePicker"
              format={'DD/MM/YYYY'}
              onChange={item.onChange}
              showTime={false}
              value={item.value}
              disabledDate={item.disabledDate}
              disabled={item.disabled}
            />
          </Col>
        )
      case 'month':
        return (
          <Col key={index} md={item.size || 24} xs={24}>
            <h5>{item.label}</h5>
            <MonthPicker
              onChange={item.onChange}
              picker="month"
              style={{ width: '100%' }}
              defaultValue={item.defaultValue}
            />
          </Col>
        )
      case 'week':
        return (
          <Col key={index} md={item.size || 24} xs={24}>
            <h5>{item.label}</h5>
            <WeekPicker
              onChange={item.onChange}
              style={{ width: '100%' }}
              defaultValue={item.defaultValue}
              picker={item.picker}
              value={item.value}
              disabled={item.disabled}
              allowClear={item.allowClear}
            />
          </Col>
        )
      default:
        return null;
    }
  }

  const renderListContent = () => {
    // reoder list by order object key
    const newList = orderBy(list, ['order'], ['asc']);
    return map(newList, (item, index) => {
      return renderItem(item, index);
    });
  }

  return (
    <Row>
      {childContent.position === 'left' && props.children && props.children}
      {isEmpty(list) ? null : renderListContent()}
      {childContent.position === 'right' && props.children && props.children}
    </Row>
  )
}

ToolbarExtra.defaultProps = {
  childContent: {
    contentPositon: 'left',
  },
  list: []
}

ToolbarExtra.propTypes = {
  childContent: PropTypes.shape({
    position: PropTypes.oneOf(['left', 'right'])
  }),
  list: PropTypes.arrayOf(PropTypes.shape({
    order: PropTypes.number.isRequired,
    type: PropTypes.oneOf([
      'search',
      'select',
      'checkbox',
      'treeSelect',
      'treeSelectRole',
      'dateRanger',
      'day',
      'month',
      'week'
    ]).isRequired,
    size: PropTypes.number,
    label: PropTypes.string,
  }))
}

export default ToolbarExtra