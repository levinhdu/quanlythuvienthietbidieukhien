import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';

const { TreeNode } = Tree;

function treeNode(data, dataOption) {
  const options = dataOption;
  const option = [
    options[0] ? options[0] : 'id',
    options[1] ? options[1] : 'name',
    options[2] ? options[2] : 'children',
    options[3] ? options[3] : 'isLeaf'
  ];
  return data.map((item) => {
    if (item[option[2]] && item[option[2]].length > 0) {
      return (
        <TreeNode
          key={item[option[0]]}
          name={item[option[1]]}
          title={item[option[1]]}
          value={item[option[0]]}
        >
          {treeNode(item[option[2]], option)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={item[option[0]]}
        isLeaf={item[option[3]]}
        title={item[option[1]]}
        value={item[option[0]]}
      />
    );
  });
}

export default class tree extends PureComponent {
  render() {
    return (
      <Tree
        {...this.props}
        showLine
      >
        {treeNode(this.props.dataTree, this.props.options)}
      </Tree>
    );
  }
}

tree.propTypes = {
  dataTree: PropTypes.arrayOf(PropTypes.any).isRequired,
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  className: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.any)
};

tree.defaultProps = {
  value: null,
  className: '',
  options: []
};
