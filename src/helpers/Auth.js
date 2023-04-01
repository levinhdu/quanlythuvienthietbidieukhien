import React, { Component } from 'react';
import { find, filter, isEmpty, replace, split, includes } from 'lodash';
import { removeFirstCharacterWithInputCharacter, treeToFlatlist } from 'src/util/Common';

const defaultPermission = { add: true, del: true, edit: true, view: true, print: true, cof: true };

/**
 * Xử lý vai trò có thể vào Component hay không
 *
 * @param {*} WrappedComponent - Component đầu vào
 * @param {*} selectData - Vai trò
 * @returns Component có quyền vào hay không ?
 */
export default (WrappedComponent, selectData, pathName = '', permission = defaultPermission) => {
  // Xử lý dữ liệu
  if (!isEmpty(selectData)) {
    let pathNameReChange = removeFirstCharacterWithInputCharacter(pathName, '/');
    const flatData = treeToFlatlist(selectData);

    // Xóa những path url có đường dẫn là them-moi và chinh-sua
    if (includes(pathNameReChange, 'them-moi')) {
      pathNameReChange = replace(pathNameReChange, '/them-moi', '');
    }
    if (includes(pathNameReChange, 'chinh-sua') || includes(pathNameReChange, 'phan-quyen') || includes(pathNameReChange, 'chi-tiet')) {
      let pathArrTmp = split(pathNameReChange, '/');
      pathArrTmp.pop();
      pathArrTmp.pop();
      pathNameReChange = pathArrTmp.join('/');
    }
    // Tìm kiếm item có url bằng pathNameReChange
    const itemData = find(flatData, ['url', pathNameReChange]);
    let menuData = [];
    if (itemData && itemData.isParent) {
      menuData = filter(flatData, ['parent_Id', itemData.parent_Id]);
    }
    const permissionTmp = itemData && itemData.permission;
    // Xử lý trên Component
    return class extends Component {
      render() {
        return <WrappedComponent {...this.props} permission={permissionTmp} menus={menuData} />
      }
    }
  } else {
    const permissionTmp = permission && permission;
    return class extends Component {
      render() {
        return <WrappedComponent {...this.props} permission={permissionTmp} menus={selectData} />
      }
    }
  }
}
