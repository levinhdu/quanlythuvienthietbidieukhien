import React from "react";
import { Row, Col, Input, Checkbox } from "antd";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";

import {
  Select,
  DatePicker,
  DatePickerRange,
  MonthPicker,
  WeekPicker,
  TreeSelect,
  TreeSelectRole,
  YearPicker,
} from "src/components/Common";

const { Search } = Input;

export default function Toolbar(props) {
  const gridViewValue = (count) => {
    switch (count) {
      case 2:
        return { md: 24 / 2, xs: 24 };
      case 3:
        return { md: 24 / 3, xs: 24 };
      case 4:
        return { md: 24 / 4, xs: 24 };
      default:
        return { xs: 24 };
    }
  };

  const gridViewCustomValue = (value) => {
    return { md: value, xs: 24 };
  };

  const grid = gridViewValue(props.count);
  const {
    search,
    selects,
    checkboxes,
    treeSelects,
    treeSelectsRole,
    dateRanger,
    days,
    months,
    week,
    years,
    children,
  } = props;

  const renderSearch = () => {
    let sizeGrid = { xs: 12 };
    if (search.size) {
      sizeGrid = gridViewCustomValue(search.size);
    } else {
      sizeGrid = grid;
    }
    return (
      <Col {...sizeGrid} className="th-head-col">
        <h5>{search.title}</h5>
        <Search
          value={search.value}
          onChange={search.onChange}
          onPressEnter={search.onPressEnter}
          onSearch={search.onSearch}
          placeholder={search.placeholder}
          enterButton
          loading={search.loading}
          disabled={search.disabled}
          allowClear={search.allowClear}
        />
      </Col>
    );
  };

  const renderSelect = (select, index) => {
    let sizeGrid = { xs: 12 };
    if (select.size) {
      sizeGrid = gridViewCustomValue(select.size);
    } else {
      sizeGrid = grid;
    }
    const { data, options, title, onChange, placeholder, value, ...others } =
      select;
    return (
      <Col {...sizeGrid} key={index} className="th-head-col">
        <h5>{title}</h5>
        <Select
          autoClearSearchValue
          data={data}
          onChange={onChange}
          optionsvalue={options}
          placeholder={placeholder}
          style={{ width: "100%" }}
          value={value}
          showSearch
          optionFilterProp="children"
          {...others}
        />
      </Col>
    );
  };

  const renderTreeSelect = (tree, index) => {
    let sizeGrid = { xs: 12 };
    if (tree.size) {
      sizeGrid = gridViewCustomValue(tree.size);
    } else {
      sizeGrid = grid;
    }
    return (
      <Col {...sizeGrid} key={index} className="th-head-col">
        <h5>{tree.title}</h5>
        <TreeSelect
          className="tree-select-item"
          datatreeselect={tree.data}
          onChange={tree.onChange}
          options={tree.options}
          placeholder={tree.placeholder}
          style={{ width: "100%" }}
          value={tree.value}
          showSearch
          optionFilterProp="children"
          disabled={tree.disabled}
        />
      </Col>
    );
  };

  const renderTreeSelectRole = (tree, index) => {
    let sizeGrid = { xs: 12 };
    if (tree.size) {
      sizeGrid = gridViewCustomValue(tree.size);
    } else {
      sizeGrid = grid;
    }
    return (
      <Col {...sizeGrid} key={index} className="th-head-col">
        <h5>{tree.title}</h5>
        <TreeSelectRole
          className="tree-select-item"
          datatreeselect={tree.data}
          onChange={tree.onChange}
          options={tree.options}
          placeholder={tree.placeholder}
          style={{ width: "100%" }}
          value={tree.value}
          disabled={tree.disabled}
          showSearch
          optionFilterProp="children"
        />
      </Col>
    );
  };

  const renderCheckBox = (checkbox, index) => {
    let sizeGrid = { xs: 12 };
    if (checkbox.size) {
      sizeGrid = gridViewCustomValue(checkbox.size);
    } else {
      sizeGrid = grid;
    }
    return (
      <Col {...sizeGrid} key={index} className="th-head-col">
        <h5>{checkbox.headTitle}</h5>
        <Checkbox style={{ marginTop: 5 }} onChange={checkbox.onChange}>
          {checkbox.title}
        </Checkbox>
      </Col>
    );
  };

  const renderDay = (day, index) => {
    const { onChange, defaultValue, title, size, disabled, ...other } = day;
    let sizeGrid = { xs: 12 };
    if (size) {
      sizeGrid = gridViewCustomValue(size);
    } else {
      sizeGrid = grid;
    }

    return (
      <Col {...sizeGrid} key={index} className="th-head-col">
        <h5>{title}</h5>
        <DatePicker
          className="heading-dateRangePicker"
          format={"DD/MM/YYYY"}
          onChange={onChange}
          showTime={false}
          value={defaultValue}
          disabled={disabled}
          {...other}
        />
      </Col>
    );
  };

  const renderDateRanger = () => {
    const { onChange, data, title, size, showTime, ...others } = dateRanger;
    let sizeGrid = { xs: 12 };
    if (size) {
      sizeGrid = gridViewCustomValue(size);
    } else {
      sizeGrid = grid;
    }
    return (
      <Col {...sizeGrid} className="th-head-col">
        <h5>{title}</h5>
        <DatePickerRange
          allowClear={false}
          className="heading-dateRangePicker"
          format={"DD/MM/YYYY"}
          onChange={onChange}
          showTime={showTime}
          value={data}
          {...others}
        />
      </Col>
    );
  };

  const renderMonth = (month, index) => {
    let sizeGrid = { xs: 12 };
    if (month.size) {
      sizeGrid = gridViewCustomValue(month.size);
    } else {
      sizeGrid = grid;
    }
    const disabled =
      !isEmpty(month.disabled) || month.disabled ? month.disabled : false;
    return (
      <Col {...sizeGrid} key={index} className="th-head-col">
        <h5>{month.title}</h5>
        <MonthPicker
          onChange={month.onChange}
          picker="month"
          style={{ width: "100%" }}
          value={month.value}
          disabled={disabled}
        />
      </Col>
    );
  };

  const renderYear = (year, index) => {
    let sizeGrid = { xs: 12 };
    if (year.size) {
      sizeGrid = gridViewCustomValue(year.size);
    } else {
      sizeGrid = grid;
    }
    return (
      <Col {...sizeGrid} key={index} className="th-head-col">
        <h5>{year.title}</h5>
        <YearPicker
          onChange={year.onChange}
          picker="year"
          style={{ width: "100%" }}
          defaultValue={year.defaultValue}
        />
      </Col>
    );
  };

  const renderWeek = () => {
    let sizeGrid = { xs: 12 };
    if (week.size) {
      sizeGrid = gridViewCustomValue(week.size);
    } else {
      sizeGrid = grid;
    }
    return (
      <Col {...sizeGrid} className="th-head-col">
        <h5>{week.title}</h5>
        <WeekPicker
          onChange={week.onChange}
          style={{ width: "100%" }}
          defaultValue={week.defaultValue}
          picker={week.picker}
          value={week.value}
        />
      </Col>
    );
  };
  return (
    <Row>
      {children}
      {!isEmpty(treeSelects) &&
        map(treeSelects, (tree, index) => {
          return renderTreeSelect(tree, index);
        })}
      {!isEmpty(treeSelectsRole) &&
        map(treeSelectsRole, (tree, index) => {
          return renderTreeSelectRole(tree, index);
        })}
      {!isEmpty(selects) &&
        map(selects, (select, index) => {
          return renderSelect(select, index);
        })}
      {!isEmpty(checkboxes) &&
        map(checkboxes, (checkbox, index) => {
          return renderCheckBox(checkbox, index);
        })}
      {!isEmpty(days) &&
        map(days, (day, index) => {
          return renderDay(day, index);
        })}
      {!isEmpty(months) &&
        map(months, (month, index) => {
          return renderMonth(month, index);
        })}
      {/* {month && renderMonth()} */}
      {week && renderWeek()}
      {dateRanger && renderDateRanger()}
      {!isEmpty(years) &&
        map(years, (year, index) => {
          return renderYear(year, index);
        })}
      {!isEmpty(search) && renderSearch()}
    </Row>
  );
}

Toolbar.propTypes = {
  isError: PropTypes.bool,
  loading: PropTypes.bool,
  count: PropTypes.number.isRequired,
  search: PropTypes.shape({
    size: PropTypes.number,
    title: PropTypes.string,
    keyword: PropTypes.string,
    onChange: PropTypes.func,
    onPressEnter: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    loading: PropTypes.bool,
  }),
  selects: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number,
      title: PropTypes.string,
      data: PropTypes.array,
      onChange: PropTypes.func,
      options: PropTypes.array,
      placeholder: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  treeSelects: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number,
      title: PropTypes.string,
      data: PropTypes.array,
      onChange: PropTypes.func,
      options: PropTypes.array,
      placeholder: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  checkboxes: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number,
      title: PropTypes.string,
      headTitle: PropTypes.string,
      onChange: PropTypes.func,
    })
  ),
  month: PropTypes.shape({
    title: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    defaultValue: PropTypes.object,
  }),
  years: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      placeholder: PropTypes.string,
      onChange: PropTypes.func,
      defaultValue: PropTypes.object,
    })
  ),
  week: PropTypes.shape({
    title: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    defaultValue: PropTypes.object,
  }),
};

Toolbar.defaultProps = {
  isError: false,
  loading: false,
  count: 1,
  search: {},
  orders: [],
};

Toolbar.displayName = "Toolbar";
