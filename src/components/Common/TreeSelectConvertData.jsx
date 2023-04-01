import React, { PureComponent } from 'react';
import {
  TreeSelect
} from 'src/components/common';
import PropTypes from 'prop-types';
import Helpers from 'src/helpers';
import { isArray, compact, uniqBy } from 'lodash';

export default class TreeSelectConvertData extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    if ('value' in props && props.value !== state.value) {
      const data = props.value.data || [];
      const result = data.map(item => props.onConvertData(item));
      const defaultExpandedKeys = result.map(item => String(item.key));
      return {
        defaultExpandedKeys,
        value: props.value,
        selectedData: result
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
      selectedData: result
    };
  }

  /**
   * Handle logic when the TreeSelect component is changed
   * @param {array} items all selected values
   * @param {string} label
   * @param {object} extra object
   * @returns {void}
   */
  onChangeTreeSelect = async (items = [], label, extra) => {
    // get item đã được chọn
    const getCheckedItem = (node) => {
      const disableCheckbox = Helpers.get(node, 'props.disableCheckbox');
      const disabled = Helpers.get(node, 'props.disabled');
      if (disableCheckbox || disabled) {
        return undefined;
      }
      const treeNodeLabelProp = this.props.treeNodeLabelProp || 'label';
      const treeNodeFilterProp = this.props.treeNodeFilterProp || 'value';
      const record = Helpers.get(node, 'props.record');
      const title = Helpers.get(node, 'props.title');
      const value = Helpers.get(node, 'props.value');
      const checkedItem = this.props.onConvertData({
        ...record,
        [treeNodeLabelProp]: title,
        [treeNodeFilterProp]: value
      });
      return checkedItem;
    };
    const { checked = false, triggerNode = {} } = extra;
    const record = Helpers.get(triggerNode, 'props.record');
    let selectedData = [...this.state.selectedData];
    // kiểm tra item được check hay không
    const isAddedNode = checked;
    // kiểm tra giá trị của item có được sử dụng hay không
    const isUsedNode = Helpers.get(record, 'isLeaf', true)
      || (!Helpers.get(record, 'isLeaf', true) && this.props.treeCheckStrictly);
    if (isAddedNode) {
      if (isUsedNode) {
        // thêm giá trị của item được sử dụng
        selectedData.push(getCheckedItem(triggerNode));
      } else {
        // thêm giá trị của children của item
        const children = Helpers.get(triggerNode, 'props.children', []) || [];
        if (isArray(children)) {
          children.forEach((childNode) => {
            selectedData.push(getCheckedItem(childNode));
          });
        }
      }
    } else {
      // loại bỏ các giá trị không còn nằm trong items
      const values = items.map(item => Helpers.get(item, 'value'));
      selectedData = selectedData.filter(item => values.indexOf(Helpers.get(item, 'value')) > -1);
    }
    await this.setState(prevState => ({
      ...prevState,
      selectedData: uniqBy(compact(selectedData), 'value')
    }));
    await this.sendData(this.state.selectedData);
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
      <TreeSelect
        className="select select-multi"
        datatreeselect={this.props.data}
        disabled={this.props.disableAll}
        disabledCheckboxCondition={this.props.disabledCheckboxCondition}
        disabledCondition={this.props.disabledCondition}
        dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
        labelInValue
        loadData={this.props.loadData}
        multiple
        onChange={this.onChangeTreeSelect}
        options={this.props.options}
        placeholder={this.props.placeholder}
        showSearch
        style={{ width: '100%' }}
        treeCheckable={this.props.treeCheckable}
        treeCheckStrictly={this.props.treeCheckStrictly}
        treeDefaultExpandedKeys={this.state.defaultExpandedKeys}
        value={this.state.selectedData}
      />
    );
  }
}

TreeSelectConvertData.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  loadData: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.objectOf(PropTypes.any),
  onConvertData: PropTypes.func,
  disableAll: PropTypes.bool,
  disabledCheckboxCondition: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.any),
    isOrConditions: PropTypes.bool
  }),
  disabledCondition: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.any),
    isOrConditions: PropTypes.bool
  }),
  treeCheckable: PropTypes.bool,
  treeCheckStrictly: PropTypes.bool,
  treeNodeLabelProp: PropTypes.string,
  treeNodeFilterProp: PropTypes.string
};

TreeSelectConvertData.defaultProps = {
  data: [],
  loadData: null,
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
  disabledCheckboxCondition: {},
  disabledCondition: {},
  treeCheckable: false,
  treeCheckStrictly: false,
  treeNodeLabelProp: 'label',
  treeNodeFilterProp: 'value'
};
