import React, { useEffect } from 'react';
import { Card, Button, Divider } from 'antd';
import { Icon } from '@ant-design/compatible';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { map, find, isEmpty, repeat } from 'lodash';

import { ModalDeleteConfirm, Table, EditableTableRow } from 'src/components/Common';
import { fetchStart, fetchReset } from 'src/appRedux/actions/Common';
import { reDataSelectedTable, treeToFlatlist } from 'src/util/Common';
import ContainerHeader from "src/components/ContainerHeader";

const { EditableRow, EditableCell } = EditableTableRow;

function ChucNang({ history, permission }) {

  const { loading, data } = useSelector(({ common }) => common).toJS();
  const dispatch = useDispatch();

  useEffect(() => {
    function load() {
      dispatch(fetchStart('Menu', 'GET', null, 'LIST'));
    }
    load();
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  /**
   * Lấy dữ liệu về
   *
   */
  const loadData = () => {
    dispatch(fetchStart('Menu', 'GET', null, 'LIST'));
  }


  /**
   * Thêm dấu để phân cấp tiêu đề dựa theo tree (flatlist)
   *
   * @param {*} value
   * @param {*} record
   * @returns
   * @memberof ChucNang
   */
  const renderTenMenu = (value, record) => {
    let string = repeat('- ', record.level);
    string = `${string} ${value}`;
    return (
      <div>{string}</div>
    )
  }

  /**
  * ActionContent: Hành động trên bảng
  * @param {*} item
  * @returns View
  * @memberof ChucNang
  */
  const actionContent = (item) => {
    const editItem = permission.edit ? <Link to={{
      pathname: `/he-thong/chuc-nang/${item.id}/chinh-sua`,
      state: { itemData: item }
    }} title="Sửa"><EditOutlined /></Link> : <span disabled title="Sửa"><EditOutlined /></span>
    const deleteVal = permission.del && !item.isUsed ? { onClick: () => deleteItemFunc(item) } : { disabled: true };
    return (
      <div>
        {editItem}
        <Divider type="vertical" />
        <a {...deleteVal} title="Xóa"><DeleteOutlined /></a>
      </div>
    )
  }

  /**
   * deleteItemFunc: Xoá item theo item
   * @param {object} item
   * @returns
   * @memberof VaiTro
  */
  const deleteItemFunc = (item) => {
    ModalDeleteConfirm(deleteItemAction, item);
  }

  /**
   * Xóa item
   *
   * @param {*} item
   */
  const deleteItemAction = (item) => {
    let url = `Menu/${item.id}`;
    if(item.isRemove) url = `Menu/Remove/${item.id}`;
    new Promise((resolve, reject) => {
      dispatch(fetchStart(url, 'DELETE', null, 'DELETE', '', resolve, reject));
    }).then(res => {
      // Reload lại danh sách
      loadData();
    }).catch(error => console.error(error));
  }

  /**
   * Render Icon trên bảng
   *
   * @param {*} icon
   * @param {*} record
   * @returns
   * @memberof ChucNang
   */
  const renderIcon = (icon, record) => {
    if (record.isParent) return null;
    return <Icon type={icon} />;
  }

  /**
   * Chuyển tới trang thêm mới chức năng
   *
   * @memberof ChucNang
   */
  const handleRedirect = () => {
    history.push({
      pathname: '/he-thong/chuc-nang/them-moi'
    });
  }

  /**
   * Lưu thứ tự từ bảng
   * @param {object} row dữ liệu một hàng
   * @memberof ChucNang
   */
  const handleSave = async (row) => {
    const dataValue = treeToFlatlist(data);
    // Check data not change
    const item = find(dataValue, item => item.id === row.id);
    if (!isEmpty(item)) {
      new Promise((resolve, reject) => {
        dispatch(fetchStart(`Menu/ThuTu/${item.id}`, 'PUT', {
          ...item,
          thuTu: row.thuTu
        }, 'EDIT', '', resolve, reject))
      }).then(res => {
        if (res && res.status === 204) {
          loadData();
        }
      }).catch(error => console.error(error));
    }
  };

  const addButtonRender = () => {
    return (
      <Button
        icon={<PlusOutlined />}
        className="th-margin-bottom-0"
        type="primary"
        onClick={handleRedirect}
        disabled={!permission.add}
      >
        Thêm mới
      </Button>
    )
  }

  let renderHead = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', align: 'center', width: '5%' },
    { title: 'Tên menu', dataIndex: 'tenMenu', key: 'tenMenu', render: (value, record) => renderTenMenu(value, record) },
    { title: 'Icon', dataIndex: 'icon', key: 'icon', align: 'center', render: (icon, record) => renderIcon(icon, record) },
    { title: 'URL', dataIndex: 'url', key: 'url' },
    { title: 'Thứ tự', dataIndex: 'thuTu', key: 'thuTu', align: 'center', editable: permission.edit, width: 80, info: { type: 'number', required: true } },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: 130,
      render: (value) => actionContent(value)
    }
  ];
  let dataList = treeToFlatlist(data);
  dataList = reDataSelectedTable(dataList);


  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = map(renderHead, col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        info: col.info,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <div className="gx-main-content">
      <ContainerHeader
        title="Chức năng"
        description="Danh sách chức năng"
        buttons={addButtonRender()}
      />
      <Card className="th-card-margin-bottom">
      <Table
        bordered
        columns={columns}
        components={components}
        className='gx-table-responsive'
        dataSource={dataList}
        size="middle"
        rowClassName={
          (record) => {
            return record.isParent ? "editable-row" : 'editable-row';
          }
        }
        pagination={false}
        loading={loading}
      />
    </Card>
    </div>
  )
}

export default ChucNang
