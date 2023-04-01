import React, { useState, useEffect } from 'react';
import { Card, Descriptions } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { Table, Toolbar } from 'src/components/Common';
import { fetchStart, fetchReset } from 'src/appRedux/actions/Common';
import { convertObjectToUrlParams, reDataForTable } from 'src/util/Common';
import { PAGE_SIZE } from 'src/constants/Config';
import ContainerHeader from "src/components/ContainerHeader";

function Log({ history, permission }) {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const pageSize = PAGE_SIZE;
  const [tuNgay, setTuNgay] = useState(moment().subtract(1, 'month'));
  const [denNgay, setDenNgay] = useState(moment());
  const dispatch = useDispatch();
  const { data, loading } = useSelector(({ common }) => common).toJS();

  useEffect(() => {
    if (permission && permission.view) {
      getListData(keyword, page, pageSize, tuNgay, denNgay);
    } else {
      history.push('/home');
    }
    return () => {
      dispatch(fetchReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load danh sách Log
   * @param keyword Từ khóa
   * @param page Trang
   * @param pageSize
   */
  const getListData = (keyword, page, pageSize, TuNgay, DenNgay) => {
    const newTuNgay = TuNgay.format('MM/DD/YYYY');
    const newDenNgay = DenNgay.format('MM/DD/YYYY');
    let params = convertObjectToUrlParams({ pageSize, page, keyword, TuNgay: newTuNgay, DenNgay: newDenNgay });
    dispatch(fetchStart(`Log?${params}`, 'GET', null, 'LIST'));
  }

  /**
   * handleTableChange
   *
   * Fetch dữ liệu dựa theo thay đổi trang
   * @param {number} pagination
   */
  const handleTableChange = (pagination) => {
    setPage(pagination);
    getListData(keyword, pagination, pageSize, tuNgay, denNgay);
  };

  /**
   * Tìm kiếm Log
   *
   */
  const onSearchLog = () => {
    getListData(keyword, page, pageSize, tuNgay, denNgay);
  }

  /**
   * Thay đổi keyword
   *
   * @param {*} val
   */
  const onChangeKeyword = (val) => {
    setKeyword(val.target.value);
    if (isEmpty(val.target.value)) {
      getListData(val.target.value, page, pageSize, tuNgay, denNgay);
    }
  }

  /**
   * Khi thay đổi ngày ban hành
   *
   * @param dates
   */
  const onChangeNgayTruyCap = dates => {
    if (dates.tuNgay) {
      setPage(1);
      setTuNgay(dates.tuNgay);
      getListData(keyword, 1, pageSize, dates.tuNgay, denNgay);
    }
    if (dates.denNgay) {
      setPage(1);
      setDenNgay(dates.denNgay);
      getListData(keyword, 1, pageSize, tuNgay, dates.denNgay);
    }
  };

  const renderUrl = (val, record) => {
    return `${val} (${record.type})`;
  }

  /**
   * Hiển thị bảng
   *
   * @returns
   */
  const header = () => {
    let renderHead = [
      { title: 'STT', dataIndex: 'key', key: 'key', width: '5%', align: 'center' },
      { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Url', dataIndex: 'url', key: 'url', render: (val, record) => renderUrl(val, record) },
      { title: 'Time access', dataIndex: 'accessDate', key: 'accessDate', render: val => moment(val).format('DD/MM/YYYY HH:mm') }
    ];
    return renderHead;
  }

  const expandedRowRender = record => {
    return (
      <Descriptions title="Chi tiết" column={1}>
        <Descriptions.Item label="Data">{decodeURIComponent(record.data)}</Descriptions.Item>
        <Descriptions.Item label="IP">{record.ipAddress}</Descriptions.Item>
        <Descriptions.Item label="Username">{record.userName}</Descriptions.Item>
      </Descriptions>
    )
  }

  const { totalPage, totalRow } = data;
  const dataList = reDataForTable(data.result, page, pageSize);
  return (
    <div className="gx-main-content">
      <ContainerHeader
        title="Lịch sử truy cập"
        description="Danh sách Lịch sử truy cập"
      />
      <Card className="th-card-margin-bottom">
        <Toolbar
          count={2}
          search={{
            size: 12,
            title: 'Tìm kiếm',
            loading,
            value: keyword,
            onChange: onChangeKeyword,
            onPressEnter: onSearchLog,
            onSearch: onSearchLog,
            placeholder: 'Nhập thông tin nhân viên'
          }}
          dateRanger={{
            size: 12,
            title: 'Ngày truy cập',
            data: { tuNgay, denNgay },
            onChange: onChangeNgayTruyCap
          }}
        />
      </Card>
      <Card className="th-card-margin-bottom">
        <Table
          bordered
          columns={header()}
          className='gx-table-responsive'
          dataSource={dataList}
          size="middle"
          expandable={{
            expandedRowRender: expandedRowRender,
            rowExpandable: record => record.data !== 'null',
          }}
          pagination={{
            onChange: handleTableChange,
            pageSize,
            total: totalRow,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => totalRow <= total ? `Hiển thị ${data.result.length} trong tổng ${totalRow}` : `Tổng ${totalPage}`
          }}
          loading={loading}
        />
      </Card>
    </div>
  )
}

export default Log
