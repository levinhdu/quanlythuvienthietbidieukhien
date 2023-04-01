import React, {useEffect, useState} from 'react';
import {Card, Button, Spin} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import map from 'lodash/map';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import {useDispatch, useSelector} from 'react-redux';

import {Select, Tree} from 'src/components/Common';
import {fetchStart, fetchReset} from 'src/appRedux/actions/Common';
import {reDataSelectedTable} from 'src/util/Common';
import ContainerHeader from "src/components/ContainerHeader";

function PhanQuyenDiaDiemAn({permission, history}) {

  const dispatch = useDispatch();
  const {loading, loadingSave} = useSelector(({common}) => common).toJS();
  const [loadingUser, setLoadingUser] = useState(false);
  const value = undefined;
  const [listUser, setListUser] = useState([]);
  const [listDiaDiemAn, setListDevice] = useState([]);
  const [listDiaDiemAnValue, setListDeviceValue] = useState([]);
  const [userId, setUserId] = useState(undefined);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [halfChecked, setHalfchecked] = useState([]);
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
          return {...user, emailAndName: `${user.email} - ${user.fullName}`}
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
    const newcheckedKeys = map(checkedKeys, check => {
      let valueItem = {};
      valueItem.value = check;
      valueItem.isFull = true;
      return valueItem;
    });
    const newHalfchecked = map(halfChecked, check => {
      let valueItem = {};
      valueItem.value = check;
      valueItem.isFull = false;
      return valueItem;
    });

    const newCheck = [...newcheckedKeys, ...newHalfchecked];

    // Thiết lập và bỏ giá trị
    const diaDiemAnData = await map(listDiaDiemAnValue, (diaDiemAn) => {
      let check = false;
      map(newCheck, item => {
        if (item.value === diaDiemAn.diaDiemAn_Id) {
          check = true;
        }
      });
      diaDiemAn.checked = check;
      return diaDiemAn;
    });

    const dataToSave = {
      user_Id: userId,
      lst_DiaDiemAns: diaDiemAnData
    };
    new Promise((resolve, reject) => {
      dispatch(fetchStart('DiaDiemAn/LuuPhanQuyen', 'POST', dataToSave, 'EDIT', '', resolve, reject));
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
      return {...user, emailAndName: `${user.email} - ${user.fullName}`}
    });
    const userItem = find(reListUser, item => item.emailAndName === name);
    setUserId(userItem.id);
    setCheckedKeys([]);
    // Call API to load list by diaDiemAn
    getListDiaDiemAn(userItem.id);
  }

  /**
   * Lấy danh sách địa điểm ăn
   *
   * @param {*} userid
   */
  const getListDiaDiemAn = (userid) => {
    new Promise((resolve, reject) => {
      dispatch(fetchStart(`DiaDiemAn/By_User?User_id=${userid}`, 'GET', null, 'LIST', 'listDiaDiemAn', resolve, reject));
    }).then(res => {
      if (res && res.data) {
        let selectRow = [];
        let listDiaDiemAnVal = reDataSelectedTable(res.data);

        map(listDiaDiemAnVal, (item) => {
          if (item.checked) {
            selectRow = [...selectRow, item.diaDiemAn_Id];
          }
        });
        setListDevice(res.data);
        setListDeviceValue(listDiaDiemAnVal);
        setCheckedKeys(selectRow);
      }
    }).catch(error => {
      console.error(error);
    });
  }

  /**
   * Khi nhấn check địa điểm ăn
   *
   * @param {*} checkedKeys
   * @param {*} info
   */
  const onCheck = (checkedKeys, info) => {
    console.log('checkedKeys', checkedKeys);
    console.log('info', info);
    setCheckedKeys(checkedKeys);
    setHalfchecked(info.halfCheckedKeys);
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
        icon={<SaveOutlined/>}
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
        title="Phân quyền địa điểm ăn"
        description="Phân quyền bằng cách chọn nhân viên và chọn vào địa điểm ăn tương ứng"
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
          style={{width: '100%'}}
          loading={loadingUser || loading}
          disabled={loadingSave || loading}
          value={value}
        />
      </Card>

      {!isEmpty(listDiaDiemAn) &&
      <Card title="Địa điểm ăn">
        <Spin spinning={loadingSave || loading}>
          <Tree
            checkable
            treeData={listDiaDiemAn}
            options={['diaDiemAn_Id', 'tenDiaDiemAn', 'children', 'isLeaf']}
            virtual={true}
            height={600}
            selectable={false}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            defaultExpandAll={true}
          />
        </Spin>
      </Card>
      }
    </div>
  )
}

export default PhanQuyenDiaDiemAn
