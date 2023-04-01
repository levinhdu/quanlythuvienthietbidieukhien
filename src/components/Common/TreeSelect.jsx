import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect as TreeSelectAnt } from 'antd';
import classname from 'classnames';
import Helpers from 'src/helpers';
import { isEmpty } from 'lodash';

const { TreeNode } = TreeSelectAnt;
export default class TreeSelect extends PureComponent {
  treeNode(data) {
    const options = this.props.options || [];
    const option = [
      options[0] ? options[0] : 'value',
      options[1] ? options[1] : 'name',
      options[2] ? options[2] : 'children',
      options[3] ? options[3] : 'isLeaf',
      options[4] ? options[4] : 'disableCheckbox',
      options[5] ? options[5] : 'hiddenCheckbox',
      options[6] ? options[6] : 'disabled'
    ];

    return data.map((item) => {
      let addNoneSelectableClass = false;
      let selectable = !this.props.treeCheckable;
      if (selectable && !isEmpty(this.props.selectablecondition)) {
        const isValidSelectable = Helpers.isValidCondition({
          conditions: Helpers.get(this.props.selectablecondition, 'conditions'),
          isOrConditions: Helpers.get(this.props.selectablecondition, 'isOrConditions'),
          record: item
        });
        selectable = isValidSelectable;
        addNoneSelectableClass = !selectable;
      }
      let disableCheckbox = false;
      if (this.props.treeCheckable && !isEmpty(this.props.disabledcheckboxcondition)) {
        disableCheckbox = Helpers.isValidCondition({
          conditions: Helpers.get(this.props.disabledcheckboxcondition, 'conditions'),
          isOrConditions: Helpers.get(this.props.disabledcheckboxcondition, 'isOrConditions'),
          record: item
        });
      }
      let disabled = false;
      if (this.props.treeCheckable && !isEmpty(this.props.disabledcondition)) {
        disabled = Helpers.isValidCondition({
          conditions: Helpers.get(this.props.disabledcondition, 'conditions'),
          isOrConditions: Helpers.get(this.props.disabledcondition, 'isOrConditions'),
          record: item
        });
      }
      if (item[option[2]] && item[option[2]].length > 0) {
        return (
          <TreeNode
            key={item[option[0]]}
            className={classname({
              'hidden-checkbox-tree': item[option[5]],
              'none-selectable': addNoneSelectableClass
            })}
            disableCheckbox={disableCheckbox || item[option[4]] || item[option[5]]}
            disabled={disabled || item[option[6]]}
            record={item}
            selectable={selectable}
            title={item[option[1]]}
            value={item[option[0]]}
          >
            {this.treeNode(item[option[2]])}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item[option[0]]}
          className={classname({
            'hidden-checkbox-tree': item[option[5]],
            'none-selectable': addNoneSelectableClass
          })}
          disableCheckbox={disableCheckbox || item[option[4]] || item[option[5]]}
          disabled={disabled || item[option[6]]}
          isLeaf={item[option[3]] !== false}
          record={item}
          selectable={selectable}
          title={item[option[1]]}
          value={item[option[0]]}
        />
      );
    });
  }

  render() {
    const { value, datatreeselect, name } = this.props;
    return (
      <TreeSelectAnt
        // muc dich su dung "props.name": xac dinh element theo dropdownClassName (auto test)
        dropdownClassName={`tree-dropdown-${name}`}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        style={{ minWidth: 280, width: 'auto', maxWidth: '100%' }}
        treeNodeFilterProp="title"
        {...this.props}
        value={datatreeselect.length ? value : undefined}
      >
        {this.treeNode(datatreeselect)}
      </TreeSelectAnt>
    );
  }
}

TreeSelect.propTypes = {
  datatreeselect: PropTypes.arrayOf(PropTypes.any),
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  options: PropTypes.arrayOf(PropTypes.any),
  // moi element trong mot form se co "name" khac nhau
  name: PropTypes.string,
  // same to Helpers.isValidCondition params
  selectablecondition: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.any),
    isOrConditions: PropTypes.bool
  }),
  disabledcheckboxcondition: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.any),
    isOrConditions: PropTypes.bool
  }),
  disabledcondition: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.any),
    isOrConditions: PropTypes.bool
  }),
  treeCheckable: PropTypes.bool
};

TreeSelect.defaultProps = {
  options: undefined,
  name: '',
  datatreeselect: [],
  selectablecondition: {},
  disabledcheckboxcondition: {},
  disabledcondition: {},
  treeCheckable: false
};
