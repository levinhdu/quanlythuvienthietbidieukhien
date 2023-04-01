import React, {useState, useEffect} from 'react';
import {Card, Row, Col} from 'antd';
import {repeat, map, filter, forEach, isEmpty, find} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';

import {CheckBox, Table} from 'src/components/Common';
import {fetchStart, fetchReset} from 'src/appRedux/actions/Common';
import {reDataSelectedTable, newTreeToFlatlist, fillTreeWithValue} from 'src/util/Common';
import ContainerHeader from "src/components/ContainerHeader";

function Quyen({history, permission, location, match}) {
  const dispatch = useDispatch();
  const {loading} = useSelector(({common}) => common).toJS();
  const [id, setId] = useState(undefined);
  const [name, setName] = useState('');

  const [listPermission, setListPermission] = useState([]);
  const [listPermissionFlat, setListPermissionFlat] = useState([]);

  useEffect(() => {
    const load = () => {
      if (!permission.view) {
        history.push('/home');
      } else {
        const {id} = match.params;
        const itemData = location.state ? location.state.itemData : {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (id) {
          new Promise((resolve, reject) => {
            dispatch(fetchStart(`Menu/By_Role?RoleId=${id}`, 'GET', null, 'LIST', '', resolve, reject));
          })
            .then((res) => {
              if (res && res.data) {
                setListPermission(res.data);
                setListPermissionFlat(newTreeToFlatlist(res.data, 'id'));
              }
            })
            .catch(err => console.error(err));
        }
        if (itemData) {
          const {id, description} = itemData;
          setId(id);
          setName(description);
        } else {
          setId(id);
        }
      }
    }
    load();
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {title: 'STT', dataIndex: 'stt', key: 'stt', align: 'center', width: '5%'},
    {title: 'Tên menu', dataIndex: 'tenMenu', key: 'tenMenu', render: (value, record) => renderTenMenu(value, record)},
    {
      title: 'Xem',
      dataIndex: 'permission',
      key: 'view',
      align: 'center',
      render: (value, record) => renderPermissionTmp(value, record, 'view')
    },
    {
      title: 'Thêm',
      dataIndex: 'permission',
      key: 'add',
      align: 'center',
      render: (value, record) => renderPermissionTmp(value, record, 'add')
    },
    {
      title: 'Sửa',
      dataIndex: 'permission',
      key: 'edit',
      align: 'center',
      render: (value, record) => renderPermissionTmp(value, record, 'edit')
    },
    {
      title: 'Xóa',
      dataIndex: 'permission',
      key: 'del',
      align: 'center',
      render: (value, record) => renderPermissionTmp(value, record, 'del')
    },
    {
      title: 'In',
      dataIndex: 'permission',
      key: 'print',
      align: 'center',
      render: (value, record) => renderPermissionTmp(value, record, 'print')
    },
    {
      title: 'Xác nhận',
      dataIndex: 'permission',
      key: 'cof',
      align: 'center',
      render: (value, record) => renderPermissionTmp(value, record, 'cof')
    },
  ];

  /**
   * Thêm dấu để phân cấp tiêu đề dựa theo tree (flatlist)
   *
   * @param {*} value
   * @param {*} record
   * @returns
   */
  const renderTenMenu = (value, record) => {
    let string = repeat('-', record.level);
    string = `${string} ${value}`;
    return (
      <div>{string}</div>
    )
  }

  /**
   * Hiển thị checkbox trên bảng
   *
   * @param {*} value
   * @param {*} record
   * @param {*} keyName
   * @returns
   */
  const renderPermissionTmp = (value, record, keyName) => {
    if (record.isParent && keyName !== 'view') {
      return null;
    }
    return (
      <Row>
        <Col xs={24}>
          <CheckBox
            checked={value[keyName]}
            name={String(record.id)}
            onChange={e => handleCheck(e)}
            value={{data: record, keyName}}
            disabled={record.isParent}
          />
        </Col>
      </Row>
    )
  }

  /**
   * Hành động check trên bảng
   *
   * @param {*} e
   * @memberof Quyen
   */
  const handleCheck = async (e) => {
    const {name, value, checked} = e.target;
    // name: "7" value: { value: true, keyName: 'add' } checked: false
    // Tiến hành so sánh value và checked nếu khác nhau thì tiến hành
    // tìm kiếm trong danh sách listPermission sau đó set lại state.
    if (checked !== value.data) {
      // Tiến hành save lại giá trị
      const newValues = fillTreeWithValue(listPermission, name, checked, value.keyName);
      // Kiểm tra
      await setListPermission(newValues);
      let allMenu = newTreeToFlatlist(listPermission, 'id');
      allMenu = filter(allMenu, ['parent_Id', value.data.parent_Id]);
      let viewParent = false;
      forEach(allMenu, item => {
        if (item.permission.view || item.permission.add || item.permission.edit || item.permission.del || item.permission.print || item.permission.cof) {
          viewParent = true;
        }
      });
      let parent_Ids = [value.data.parent_Id];
      // find parent of current menu has value.data.parent_Id = item.id
      const parent = find(listPermissionFlat, ['id', value.data.parent_Id]);
      if(parent) {
        if(parent.parent_Id) {
          parent_Ids.push(parent.parent_Id);
        }
      }
      // Todo: current working with 3 level menu
      // Fill vào tree có parent new Value
      const newValuesData = reCheckParentValue(newValues, parent_Ids, viewParent);
      await setListPermission(newValuesData);
      const flatSaveData = newTreeToFlatlist(listPermission, 'id');
      dispatch(fetchStart(`Menu/Role_Menu?RoleId=${id}`, 'POST', flatSaveData, 'EDIT'));
    }
  }


  /**
   * Về trang vai trò
   *
   */
  const redirectToVaiTro = () => {
    history.push('/he-thong/vai-tro')
  }

  /**
   * Thiết lập lại giá trị ở menu cha view = true nếu có bất kỳ permission bên dưới và ngược lại
   *
   * @param {*} newValues
   * @param {*} parent_Id parent_Id
   * @param {*} status true or false
   */
  const reCheckParentValue = (newValues, parent_Ids, status) => {
    return map(newValues, item => {
      forEach(parent_Ids, parent_Id => {
        if(item.id === parent_Id) {
          item.permission.view = status;
        } else {
          if (!isEmpty(item.children)) {
            reCheckParentValue(item.children, parent_Ids, status);
          }
        }
      })
      return item;
    })
  };

  let flatData = newTreeToFlatlist(listPermission, 'id');
  flatData = reDataSelectedTable(flatData);
  const titleCard = name ? `Phân quyền - ${name}` : `Phân quyền`;
  return (
    <div className="gx-main-content">
      <ContainerHeader
        title={titleCard}
        description="Chi tiết phân quyền"
        back={redirectToVaiTro}
      />
      <Card className="th-card-margin-bottom">
        <Table
          bordered
          columns={header}
          className='gx-table-responsive'
          dataSource={flatData}
          pagination={false}
          rowClassName={
            (record) => {
              return record.isParent ? "th-table-row-background" : '';
            }
          }
          loading={loading}
        />
      </Card>
    </div>
  )
}

export default Quyen
