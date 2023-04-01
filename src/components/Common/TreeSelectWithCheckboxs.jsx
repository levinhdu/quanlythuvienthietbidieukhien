import React, { PureComponent } from 'react';
import { Table } from 'antd';
import {
  TreeSelect,
  Checkbox
} from 'src/components/common';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { unionBy } from 'lodash';

export default class TreeSelectWithCheckboxs extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    if ('value' in props && props.value !== state.value) {
      const data = props.value.data || [];
      const result = data.map(item => props.onConvertData(item));
      const defaultExpandedKeys = result.map(item => String(item.key));
      return {
        defaultExpandedKeys,
        value: props.value,
        selectedData: result,
        selectedCheckboxData: result
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = { ...props.value };
    const data = value.data || [];
    const result = data.map(item => props.onConvertData(item));
    const defaultExpandedKeys = result.map(item => String(item.key));
    this.state = {
      defaultExpandedKeys,
      value,
      selectedData: result,
      selectedCheckboxData: result
    };
  }

  /**
   * Return the columns for table
   * @returns {array}
   */
  columns = () => ([
    {
      title: (
        <span className="typography typography-14">
          {this.props.headingTable[0]}
        </span>
      ),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: (
        <span>
          {this.props.headingTable[1]}
        </span>
      ),
      key: 'laPhongBanChuyenMon',
      width: '150px',
      align: 'center',
      render: record => (
        <Checkbox
          checked={record.laPhongBanChuyenMon}
          disabled={record.disabled || this.props.disableAll}
          onChange={this.onChangeCheckbox}
          value={record.key}
        />
      )
    }
  ])

  /**
   * Handle logic when the TreeSelect component is changed
   * @param {array} items all selected values
   * @param {string} label
   * @param {object} extra object
   * @returns {void}
   */
  onChangeTreeSelect = async (items = [], label, extra) => {
    const { checked = false } = extra;
    let selectedData = [...this.state.selectedData];
    let selectedCheckboxData = [...this.state.selectedCheckboxData];
    if (checked) {
      selectedData = items.map(item => this.props.onConvertData(item));
      selectedCheckboxData = unionBy(selectedCheckboxData, selectedData, 'key');
    } else {
      const values = items.map(item => item.value);
      selectedData = selectedData.filter(item => values.indexOf(item.key) > -1);
      selectedCheckboxData = selectedCheckboxData.filter(item => values.indexOf(item.key) > -1);
    }
    await this.setState(prevState => ({
      ...prevState,
      selectedData,
      selectedCheckboxData
    }));
    await this.sendData(this.state.selectedCheckboxData);
  }

  /**
   * Handle logic when the Checkbox components are changed
   * @param {object} e event object
   * @returns {void}
   */
  onChangeCheckbox = async (e) => {
    const { value, checked } = e.target;
    const index = this.state.selectedCheckboxData.findIndex(item => item.key === value);
    if (index === -1) {
      return false;
    }
    const selectedCheckboxData = [...this.state.selectedCheckboxData];
    selectedCheckboxData[index].laPhongBanChuyenMon = checked;
    await this.setState(prevState => ({
      ...prevState,
      selectedCheckboxData
    }));
    return this.sendData(selectedCheckboxData);
  }

  /**
   * Send data to parent component
   * @param {*} data the data will be sent to the parent component
   * @returns {void}
   */
  sendData = (data = null) => {
    const newData = { data };
    if (this.props.onChange && data) {
      this.props.onChange(newData);
    }
  }

  render() {
    return (
      <React.Fragment>
        <TreeSelect
          allowClear={!this.props.disableAll}
          className="select select-multi"
          datatreeselect={this.props.data}
          disabled={this.props.disableAll}
          dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
          labelInValue
          multiple
          onChange={this.onChangeTreeSelect}
          options={this.props.options}
          placeholder={this.props.placeholder}
          showSearch
          style={{ width: '100%' }}
          // treeCheckable
          treeCheckable={this.props.treeCheckable}
          treeCheckStrictly={this.props.treeCheckStrictly}
          treeDefaultExpandedKeys={this.state.defaultExpandedKeys}
          value={this.state.selectedData}
        />
        { this.props.isShowSelectedTable
          && this.state.selectedCheckboxData
          && this.state.selectedCheckboxData.length > 0 && (
          <Table
            bordered
            className={classnames('table-choose-user-primary table-don-vi-con')}
            columns={this.columns()}
            dataSource={this.state.selectedCheckboxData}
            pagination={false}
            scroll={{ y: this.state.selectedCheckboxData.length > 5 ? 229 : null }}
            size="middle"
          />
        )}
      </React.Fragment>
    );
  }
}

TreeSelectWithCheckboxs.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  headingTable: PropTypes.arrayOf(PropTypes.any),
  isShowSelectedTable: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.objectOf(PropTypes.any),
  onConvertData: PropTypes.func,
  disableAll: PropTypes.bool,
  treeCheckable: PropTypes.bool,
  treeCheckStrictly: PropTypes.bool
};

TreeSelectWithCheckboxs.defaultProps = {
  headingTable: ['Key', 'Value'],
  isShowSelectedTable: true,
  onChange: null,
  options: [],
  placeholder: '',
  onConvertData: (item) => {
    const result = {
      name: item.name || item.label,
      value: item.value || item.id,
      key: item.value || item.id
    };
    return result;
  },
  disableAll: false,
  treeCheckable: false,
  treeCheckStrictly: false
};
