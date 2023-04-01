import React from 'react';
import PropTypes from 'prop-types';
import {DownOutlined} from '@ant-design/icons';
import {Tree as TreeAnt} from 'antd';
import {regenaratorTreeList} from "src/util/Common";

/**
 * Hiển thị cây dạng cha con
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Tree(props) {
  const {options, treeData} = props;
  const treeList = regenaratorTreeList(treeData, options);
  return (
    <TreeAnt
      showLine={true}
      switcherIcon={<DownOutlined />}
      {...props}
      treeData={treeList}
    />
  )
}

Tree.defaultProps = {
  treeData: [],
  options: ['id', 'name', 'children', 'isLeaf']
}

Tree.propTypes = {
  treeData: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  virtual: PropTypes.bool,
  className: PropTypes.string,
  height: PropTypes.number,
  selectable: PropTypes.bool,
  autoExpandParent: PropTypes.bool,
  expandedKeys: PropTypes.array,
  checkedKeys: PropTypes.array,
  onCheck: PropTypes.func,
  onExpand: PropTypes.func
}

export default Tree;
