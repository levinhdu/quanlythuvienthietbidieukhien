import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Divider } from "antd";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import React, { useEffect, useState } from "react";
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
import ContainerHeader from "src/components/ContainerHeader";
import { PAGE_SIZE } from "src/constants/Config";
import { convertObjectToUrlParams } from "src/util/Common";

const { EditableRow, EditableCell } = EditableTableRow;

function ThietBi({ history, permission }) {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(({ common }) => common).toJS();
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;

  useEffect(() => {
    if (permission && permission.view) {
      getListData(keyword, page, pageSize);
    } else {
      history.push("/home");
    }
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
    { title: "Mã thiết bị", dataIndex: "maVatTu", key: "maVatTu" },
    { title: "Tên thiết bị", dataIndex: "tenVatTu", key: "tenVatTu" },
    { title: "Hãng", dataIndex: "tenHang", key: "tenHang" },
    { title: "Nhóm", dataIndex: "tenNhom", key: "tenNhom" },
    { title: "Loại", dataIndex: "tenLoai", key: "tenLoai" },
    { title: "DVT", dataIndex: "tenDonViTinh", key: "tenDonViTinh" },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 130,
      render: (value) => actionContent(value),
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
   * Redirect to create new organization
   *
   * @memberof ChucNang
   */
  const handleRedirect = () => {
    history.push({
      pathname: "/thiet-bi/thiet-bi/them-moi",
    });
  };

  const addButtonRender = () => {
    return (
      <Button
        icon={<PlusOutlined />}
        className="th-btn-margin-bottom-0"
        type="primary"
        onClick={handleRedirect}
        disabled={!permission.add}
      >
        Thêm mới
      </Button>
    );
  };

  const { totalPages, totalRow } = data;
  const dataList = reDataForTable(data.data, page, pageSize);
  console.log(dataList);
  return (
    <div className="gx-main-content">
      <ContainerHeader
        title={"Thiết bị"}
        description="Danh sách thiết bị"
        buttons={addButtonRender()}
      />
      <Card className="th-card-margin-bottom">
        <Toolbar
          count={1}
          search={{
            title: "Tìm kiếm",
            loading,
            value: keyword,
            onChange: onChangeKeyword,
            onPressEnter: onSearchNguoiDung,
            onSearch: onSearchNguoiDung,
            placeholder: "Nhập từ khóa",
          }}
        />
      </Card>
      <Card className="th-card-margin-bottom">
        <Table
          bordered
          scroll={{ y: 150 }}
          columns={columns}
          components={components}
          className="gx-table-responsive"
          dataSource={dataList}
          size="middle"
          rowClassName={"editable-row"}
          pagination={{
            onChange: handleTableChange,
            pageSize,
            total: totalRow,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) =>
              totalRow <= total
                ? `Hiển thị ${data.data.length} trong tổng ${totalRow}`
                : `Tổng ${totalPages}`,
          }}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default ThietBi;
