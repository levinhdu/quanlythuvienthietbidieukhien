import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Col, Row, Form, Tag } from "antd";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import React, { useEffect, useState } from "react";
import { Select, FormSubmit } from "src/components/Common";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { treeToFlatlist } from "src/util/Common";

import { fetchReset, fetchStart } from "src/appRedux/actions/Common";
import {
  getToolbarValue,
  reDataForTable,
  setToolbarValue,
} from "src/util/Common";

import {
  EditableTableRow,
  ModalDeleteConfirm,
  Table,
  Toolbar,
} from "src/components/Common";
import { PAGE_SIZE } from "src/constants/Config";
import { convertObjectToUrlParams } from "src/util/Common";

const { EditableRow, EditableCell } = EditableTableRow;

function PhanHoi({ history, permission }) {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(({ common }) => common).toJS();
  const [keyword, setKeyword] = useState("");
  const [NhomSelect, setNhomSelect] = useState([]);
  const [active, setActive] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;

  useEffect(() => {
    function load() {
      dispatch(fetchStart("PhanHoi", "GET", null, "LIST"));
    }
    load();
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * Load danh sách người dùng
   * @param keyword Từ khóa
   * @param page Trang
   * @param pageSize
   */
  const getListData = (keyword, page, pageSize) => {
    let param = convertObjectToUrlParams({ pageSize, page, keyword });
    dispatch(
      fetchStart(`VatTu/GetDataPagnigation?${param}`, "GET", null, "LIST")
    );
  };
  /**
   * handleTableChange
   *
   * Fetch dữ liệu dựa theo thay đổi trang
   * @param {number} pagination
   */
  const handleTableChange = (pagination) => {
    setPage(pagination);
    getListData(keyword, pagination, pageSize);
  };

  /**
   * Tìm kiếm người dùng
   *
   */
  const onSearchNguoiDung = () => {
    getListData(keyword, page, pageSize);
  };
  /**
   * Lấy danh sách quyền
   *
   */
  const getNhom = () => {
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`VatTu`, "GET", null, "LIST", "listNhom", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setNhomSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
  };
  /**
   * Thay đổi keyword
   *
   * @param {*} val
   */
  const onChangeKeyword = (val) => {
    setKeyword(val.target.value);
    if (isEmpty(val.target.value)) {
      getListData(val.target.value, page, pageSize);
    }
  };
  /**
   * deleteItemFunc: Remove item from list
   * @param {object} item
   * @returns
   * @memberof VaiTro
   */
  const deleteItemFunc = (item) => {
    ModalDeleteConfirm(deleteItemAction, item);
  };

  /**
   * Remove item
   *
   * @param {*} item
   */
  const deleteItemAction = (item) => {
    let url = `VatTu/${item.id}`;
    if (item.isRemove) url = `VatTu/Remove/${item.id}`;
    new Promise((resolve, reject) => {
      dispatch(fetchStart(url, "DELETE", null, "DELETE", "", resolve, reject));
    })
      .then((res) => {
        getListData(keyword, page, pageSize);
      })
      .catch((error) => console.error(error));
  };

  /**
   * ActionContent: Action in table
   * @param {*} item
   * @returns View
   * @memberof ChucNang
   */
  const actionContent = (item) => {
    const editItem = permission.edit ? (
      <Link
        to={{
          pathname: `/danh-muc/thiet-bi/${item.id}/chinh-sua`,
          state: { itemData: item, permission },
        }}
        title="Sửa"
      >
        <EditOutlined />
      </Link>
    ) : (
      <span disabled title="Sửa">
        <EditOutlined />
      </span>
    );
    const deleteItemVal =
      permission.del && !item.isUsed
        ? { onClick: () => deleteItemFunc(item) }
        : { disabled: true };
    return (
      <div>
        <React.Fragment>
          <Divider type="vertical" />
          {editItem}
          <Divider type="vertical" />
          <a {...deleteItemVal} title="Xóa">
            <DeleteOutlined />
          </a>
        </React.Fragment>
      </div>
    );
  };

  /**
   * Save item from table
   * @param {object} row
   * @memberof ChucNang
   */
  const handleSave = async (row) => {
    const dataValue = treeToFlatlist(data);
    // Check data not change
    const item = find(dataValue, (item) => item.id === row.id);
    if (!isEmpty(item)) {
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(
            `VatTu/${item.id}`,
            "PUT",
            {
              ...item,
              thuTu: row.thuTu,
            },
            "EDIT",
            "",
            resolve,
            reject
          )
        );
      })
        .then((res) => {
          if (res && res.status === 204) {
            getListData(keyword, page, pageSize);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  let colValues = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "5%",
      align: "center",
    },
    { title: "Ngày", dataIndex: "date", key: "date" },
    {
      title: "Nội dung phản hồi",
      dataIndex: "noiDungPhanHoi",
      key: "noiDungPhanHoi",
    },
    { title: "Góp ý", dataIndex: "gopY", key: "gopY" },
    {
      title: "Trạng thái xử lý",
      dataIndex: "trangThaiXuLy",
      key: "trangThaiXuLy",
      render: (val) => renderDisplayTrangThai(val),
    },
  ];
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = map(colValues, (col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        info: col.info,
        handleSave: handleSave,
      }),
    };
  });

  /**
   * Hiển thị trạng thái xử lý
   *
   * @param {*} val
   * @returns
   */
  const renderDisplayTrangThai = (val) => {
    if (isEmpty(val)) {
      let color = "red";
      let item = "Chưa hoàn thành";
      if (val === 1) {
        item = "Hoàn thành";
        color = "blue";
      }
      return <Tag color={color}>{item}</Tag>;
    }
    return null;
  };

  const dataList = reDataForTable(data);
  return (
    <div className="gx-main-content">
      <Card className="th-card-margin-bottom" title="Phản hồi">
        <Table
          bordered
          scroll={{ y: 150 }}
          columns={columns}
          components={components}
          className="gx-table-responsive"
          dataSource={dataList}
          size="middle"
          rowClassName={"editable-row"}
          pagination={false}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default PhanHoi;
