import React, {useEffect, useState} from 'react';
import {Button, Card, Divider, Tag} from 'antd';
import {AuditOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import {ModalDeleteConfirm, Table} from 'src/components/Common';
import {fetchReset, fetchStart} from 'src/appRedux/actions/Common';
import {convertObjectToUrlParams, reDataForTable} from 'src/util/Common';
import {PAGE_SIZE} from 'src/constants/Config';
import ContainerHeader from "src/components/ContainerHeader";

function VaiTro({history, permission}) {
  const dispatch = useDispatch();
  const {data, loading} = useSelector(({common}) => common).toJS();

  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;

  useEffect(() => {
    const load = () => {
      const params = convertObjectToUrlParams({page: 1, pageSize: PAGE_SIZE});
      dispatch(fetchStart(`Role?${params}`, 'GET', null, 'LIST'));
    }
    load();
    return () => {
      dispatch(fetchReset());
    }
  }, [dispatch]);

  /**
   * Load danh sách vai trò
   *
   */
  const getListData = (page, pageSize) => {
    const params = convertObjectToUrlParams({page, pageSize});
    dispatch(fetchStart(`Role?${params}`, 'GET', null, 'LIST'));
  }

  /**
   * Chuyển tới trang thêm mới vai trò
   *
   */
  const handleRedirect = () => {
    history.push({
      pathname: '/he-thong/vai-tro/them-moi'
    });
  }

  /**
   * ActionContent: Hành động trên bảng
   *
   * @param {*} item
   * @returns View
   */
  const actionContent = (itemVal) => {
    const phanQuyenItem = permission.edit ? <Link to={{
      pathname: `/he-thong/vai-tro/${itemVal.id}/phan-quyen`,
      state: {itemData: itemVal}
    }} title="Phân quyền"><AuditOutlined/></Link> : <span disabled title="Phân quyền"><AuditOutlined/></span>;
    const editItem = permission.edit ? <Link to={{
      pathname: `/he-thong/vai-tro/${itemVal.id}/chinh-sua`,
      state: {itemData: itemVal}
    }} title="Sửa"><EditOutlined/></Link> : <span disabled title="Sửa"><EditOutlined/></span>
    const deleteVal = (permission.del && !itemVal.isUsed) ? {onClick: () => deleteItemFunc(itemVal)} : {disabled: true};
    return (
      <div>
        {phanQuyenItem}
        <Divider type="vertical"/>
        {editItem}
        <Divider type="vertical"/>
        <a {...deleteVal} title="Xóa"><DeleteOutlined/></a>
      </div>
    )
  }


  /**
   * deleteItem: Xoá item theo item
   *
   * @param {number} item
   * @returns
   */
  const deleteItemFunc = async (item) => {
    ModalDeleteConfirm(deleteItemAction, item);
  }

  /**
   * Xóa item
   *
   * @param {*} item
   */
  const deleteItemAction = (item) => {
    new Promise((resolve, reject) => {
      dispatch(fetchStart(`Role/${item.id}`, 'DELETE', null, 'DELETE', '', resolve, reject));
    }).then(res => {
      // Reload lại danh sách
      getListData(page, pageSize);
    }).catch(error => console.error(error));
  }

  /**
   * handleTableChange
   *
   * Fetch dữ liệu dựa theo thay đổi trang
   * @param {number} pagination
   */
  const handleTableChange = (pagination) => {
    setPage(pagination);
    getListData(pagination, pageSize);
  };

  const renderHead = [
    {title: 'STT', dataIndex: 'key', key: 'key', align: 'center', width: 70},
    {
      title: 'Mã quyền',
      key: 'name',
      dataIndex: 'name',
      render: name => {
        let color = name.length > 5 ? 'geekblue' : 'green';
        if (name === 'Administrator') {
          color = 'volcano';
        }
        return (
          <span>
            <Tag color={color} key={name}>
              {name.toUpperCase()}
            </Tag>
          </span>
        )
      },
    },
    {title: 'Tên quyền', dataIndex: 'description', key: 'description'},
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: 150,
      render: (value) => actionContent(value)
    }
  ];

  const {totalPages, totalRow} = data;
  const dataList = reDataForTable(data ? data.data : []);
  return (
    <div className="gx-main-content">
      <ContainerHeader
        title="Vai trò"
        description="Danh sách vai trò. Tại đây bạn có thể phân quyền cụ thể cho từng vai trò"
        buttons={
          <Button
            icon={<PlusOutlined/>}
            className="th-margin-bottom-0"
            type="primary"
            onClick={handleRedirect}
            disabled={!permission.add}
          >
            Thêm mới
          </Button>
        }
      />
      <Card className="th-card-margin-bottom">

        <Table
          bordered
          columns={renderHead}
          className='gx-table-responsive'
          dataSource={dataList}
          size="middle"
          pagination={{
            onChange: handleTableChange,
            pageSize,
            total: totalRow,
            showTotal: (total) => totalRow <= total ? `Hiển thị ${data.data.length} trong tổng ${totalRow}` : `Tổng ${totalPages}`
          }}
          loading={loading}
        />
      </Card>
    </div>
  )
}

export default VaiTro
