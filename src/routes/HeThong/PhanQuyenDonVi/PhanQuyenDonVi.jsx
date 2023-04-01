import React, { useEffect, useState } from 'react';
import { Card, Button, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import map from 'lodash/map';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import { useDispatch, useSelector } from 'react-redux';

import { Select, Tree } from 'src/components/Common';
import { fetchStart, fetchReset } from 'src/appRedux/actions/Common';
import { reDataSelectedTable, treeToFlatlist } from 'src/util/Common';
import ContainerHeader from "src/components/ContainerHeader";

function PhanQuyenDonVi({ permission, history }) {
  const dispatch = useDispatch();
  const { loading, loadingSave } = useSelector(({ common }) => common).toJS();
  const [loadingUser, setLoadingUser] = useState(false);
  const value = undefined;
  const [listUser, setListUser] = useState([]);
  const [listDepartment, setListDepartment] = useState([]);
  const [listDepartmentValue, setListDepartmentValue] = useState([]);
  const [userId, setUserId] = useState(undefined);
  const [checkedKeys, setCheckedKeys] = useState([]);
  // const [halfChecked, setHalfchecked] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (permission && permission.edit) {
      getListUser();
    } else {
      history.push('/home');
    }
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Lấy danh sách người dùng
   *
   */
  const getListUser = () => {
    setLoadingUser(true);
    new Promise((resolve, reject) => {
      dispatch(fetchStart('Account/Form', 'GET', null, 'LIST', 'listUser', resolve, reject));
    }).then(res => {
      if (res && res.data && res.status === 200) {
        const newListUser = map(res.data, user => {
          return { ...user, emailAndName: `${user.email} - ${user.fullName}` }
        });
        setListUser(newListUser);
      }
      setLoadingUser(false);
    }).catch(error => {
      setLoadingUser(false);
      console.error(error);
    });
  }

  /**
   * Lưu danh sách
   *
   */
  const saveData = async () => {
    // const newcheckedKeys = map(checkedKeys, check => {
    //   let valueItem = {};
    //   valueItem.value = check;
    //   valueItem.isFull = true;
    //   return valueItem;
    // });
    // const newHalfchecked = map(halfChecked, check => {
    //   let valueItem = {};
    //   valueItem.value = check;
    //   valueItem.isFull = false;
    //   return valueItem;
    // });

    // const newCheck = [...newcheckedKeys, ...newHalfchecked];

    // // Thiết lập và bỏ giá trị
    // const departmentData = await map(listDepartmentValue, (department) => {
    //   let check = false;
    //   let isFull = false;
    //   map(newCheck, item => {
    //     if (item.value === department.id) {
    //       isFull = item.isFull;
    //       check = true;
    //     }
    //   });
    //   department.checked = check;
    //   department.isFull = isFull;
    //   return department;
    // });

    const dataToSave = {
      user_Id: userId,
      lst_DonVis: listDepartmentValue
    };

    new Promise((resolve, reject) => {
      dispatch(fetchStart('DonVi/LuuPhanQuyen', 'POST', dataToSave, 'EDIT', '', resolve, reject));
    }).then(res => {
      if (res && res.status === 200) setTouch(false);
    }).catch(error => console.error(error));
  }

  /**
   * Khi thay đổi người dùng
   *
   * @param {*} name
   */
  const onChangeSelectNguoiDung = (name) => {
    const reListUser = map(listUser, user => {
      return { ...user, emailAndName: `${user.email} - ${user.fullName}` }
    });
    const userItem = find(reListUser, item => item.emailAndName === name);
    setUserId(userItem.id);
    setCheckedKeys([]);
    // Call API to load list by department
    getListDepartment(userItem.id);
  }

  /**
   * Lấy danh sách đơn vị
   *
   * @param {*} userid
   */
  const getListDepartment = (userid) => {
    new Promise((resolve, reject) => {
      dispatch(fetchStart(`DonVi/Get_By_User?User_id=${userid}`, 'GET', null, 'LIST', 'listDepartment', resolve, reject));
    }).then(res => {
      if (res && res.data) {
        let selectRow = [];
        let listDepartmentVal = treeToFlatlist(res.data);
        listDepartmentVal = reDataSelectedTable(listDepartmentVal);
        map(listDepartmentVal, (item, index) => {
          if (item.checked && item.isFull) {
            selectRow = [...selectRow, item.id];
          }
        });
        map(listDepartmentVal, dept => {
          dept.unCheck = !dept.checked;
          return dept;
        });
        setListDepartment(res.data);
        setListDepartmentValue(listDepartmentVal);
        setCheckedKeys(selectRow);
      }
    }).catch(error => {
      console.error(error);
    });
  }

  const setParentValues = (listDept, indexItem) => {
    const parentItem = find(listDept, ['id', listDept[indexItem].parent_Id]);
    if (parentItem) {
      // lấy danh sách con của parent và tiến hành set trang là true
      map(listDept, dept => {
        if (dept.parent_Id === parentItem.id) {
          // find index and exclude current index
          // then check true all item
          const index = findIndex(listDept, ['id', dept.id]);
          if(index !== indexItem) {
            if(!dept.checked && !dept.unCheck) {
              listDept[index].checked = true;
              listDept[index].isFull = true;
            }
          }
        }
      });

      const parentIndex = findIndex(listDept, ['id', parentItem.id]);
      listDept[parentIndex].checked = false;
      listDept[parentIndex].isFull = false;
      if (parentItem.parent_Id) {
        setParentValues(listDept, parentIndex);
      }
    }
  }

  /**
   * Khi bung cây đơn vị
   *
   * @param {*} expandedKeys
   */
  const onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setAutoExpandParent(false);
  };

  /**
   * Khi nhấn check đơn vị
   *
   * @param {*} checkedKeys
   * @param {*} info
   */
  const onCheck = (checkedKeys, info) => {
    const { halfCheckedKeys, node, checked } = info;
    const item = find(listDepartmentValue, ['id', node.parent_Id]);

    // Lấy về vị trí của node
    const indexItem = findIndex(listDepartmentValue, ['id', node.id]);
    const newListDepartmentValue = [...listDepartmentValue];
    // Nếu check là true
    if (checked) {
      // Nếu có cha
      if (item) {
        const indexItemParent = findIndex(listDepartmentValue, ['id', item.id]);
        // Kiểm tra nếu node click vào có half check thì set tại vị trí đó mà full
        if (!isEmpty(halfCheckedKeys)) {
          // kiểm tra nếu item này có id nằm trong danh sách halfCheckedKeys thì mới làm còn không thì bỏ qua
          newListDepartmentValue[indexItem].isFull = true;
          newListDepartmentValue[indexItem].checked = true;
          // Kiểm tra xem có child thì xóa hết trạng thái của con là false
          if (!isEmpty(node.children)) {
            map(node.children, (child) => {
              const indexChild = findIndex(newListDepartmentValue, ['id', child.id]);
              newListDepartmentValue[indexChild].isFull = false;
              newListDepartmentValue[indexChild].checked = false;
            });
          }
        } else {
          // Không có half thì tiến hành lưu luôn
          newListDepartmentValue[indexItemParent].isFull = true;
          newListDepartmentValue[indexItemParent].checked = true;
        }
      } else {
        // Nếu không có cha
        newListDepartmentValue[indexItem].isFull = true;
        newListDepartmentValue[indexItem].checked = true;
      }
    } else {
      // Kiếm tra có cha không nếu cha có check thì check xóa luôn
      // Hàm xử lý kéo lên tới root nếu cần
      // const parentItem = find(newListDepartmentValue, ['id', newListDepartmentValue[indexItem].parent_Id]);

      // if (parentItem) {
      //   const parentIndex = findIndex(newListDepartmentValue, ['id', parentItem.id]);
      //   newListDepartmentValue[parentIndex].isFull = false;
      //   newListDepartmentValue[parentIndex].checked = false;
      // }

      // Nếu có cha thì đổi trạng thái hết sang true ngoại trừ chính nó.
      // Đk phụ là nếu các item còn lại có trạng thái là false
      setParentValues(newListDepartmentValue, indexItem);

      newListDepartmentValue[indexItem].isFull = false;
      newListDepartmentValue[indexItem].checked = false;
      newListDepartmentValue[indexItem].unCheck = true;
    }

    setListDepartmentValue(newListDepartmentValue);
    setCheckedKeys(checkedKeys);
    // setHalfchecked(halfCheckedKeys);
    setTouch(true);
  };

  /**
   * Hiển thị nút lưu
   *
   * @returns
   */
  const renderHeaderBtn = () => {
    return (
      <Button
        icon={<SaveOutlined />}
        className="th-margin-bottom-0"
        type="primary"
        onClick={saveData}
        disabled={!touch || (loadingSave || loading)}
      >
        Lưu
      </Button>
    )
  }

  return (
    <div className="gx-main-content">
      <ContainerHeader
        title="Phân quyền đơn vị"
        description="Phân quyền bằng cách chọn nhân viên và chọn vào đơn vị tương ứng"
        buttons={renderHeaderBtn()}
      />
      <Card className="th-card-margin-bottom">
        <h5>Tài khoản</h5>
        <Select
          autoClearSearchValue
          data={listUser ? listUser : []}
          onChange={onChangeSelectNguoiDung}
          showSearch
          optionsvalue={['emailAndName', 'emailAndName']}
          placeholder="Chọn tài khoản để phân quyền"
          style={{ width: '100%' }}
          loading={loadingUser || loading}
          disabled={loadingSave || loading}
          value={value}
        />
      </Card>

      {!isEmpty(listDepartment) &&
        <Card title="Đơn vị">
          <Spin spinning={loadingSave || loading}>
            <Tree
              checkable
              treeData={listDepartment}
              options={['id', 'tenDonVi', 'children', 'isLeaf']}
              virtual={true}
              height={600}
              selectable={false}
              autoExpandParent={autoExpandParent}
              // expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              onExpand={onExpand}
              onSelect={() => {
                console.log('Select department')
              }}
              defaultExpandAll={true}
            />
          </Spin>
        </Card>
      }
    </div>
  )
}

export default PhanQuyenDonVi
