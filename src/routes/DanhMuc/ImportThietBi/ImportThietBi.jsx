import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Col, Row, Form } from "antd";
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

function ImportThietBi({ history, permission }) {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(({ common }) => common).toJS();
  const [keyword, setKeyword] = useState("");
  const [NhomSelect, setNhomSelect] = useState([]);
  const [active, setActive] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;

  useEffect(() => {
    if (permission && permission.view) {
      getListData(keyword, page, pageSize);
      getNhom();
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
    {
      title: "Mã thiết bị",
      dataIndex: "maVatTu",
      key: "maVatTu",
      width: "25%",
    },
    {
      title: "Tên thiết bị",
      dataIndex: "tenVatTu",
      key: "tenVatTu",
      width: "25%",
    },
    { title: "Nhóm", dataIndex: "tenNhom", key: "tenNhom", width: "15%" },
    {
      title: "DVT",
      dataIndex: "tenDonViTinh",
      key: "tenDonViTinh",
      width: "15%",
    },
    { title: "Loại", dataIndex: "tenLoai", key: "tenLoai", width: "15%" },
    { title: "Hãng", dataIndex: "tenHang", key: "tenHang", width: "15%" },
    {
      title: "Thông số kỹ thuật",
      dataIndex: "tenHang",
      key: "tenHang",
      width: "30%",
    },
    {
      title: "Lỗi",
      dataIndex: "tenHang",
      key: "tenHang",

      width: "10%",
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

  const handleRedirect = () => {
    history.push({
      pathname: "/thiet-bi/thiet-bi/them-moi",
    });
  };

  const addButtonRender = (icon, name, type, disabled) => {
    return (
      <Button
        icon={icon}
        className="th-btn-margin-bottom-0"
        type={type}
        onClick={handleRedirect}
        disabled={disabled}
      >
        {name}
      </Button>
    );
  };

  function handleOnChangNhomSelect(e) {
    setActive(true);
    console.log(e);
    getListData(e, page, pageSize);

    // onSearchNguoiDung();
  }

  const { totalPages, totalRow } = data;
  const dataList = reDataForTable(data.data, page, pageSize);
  return (
    <div className="gx-main-content">
      <Card
        className="th-card-margin-bottom"
        title="Import thiết bị"
        extra={<a>Download file mẫu import</a>}
      >
        <Row style={{ marginBottom: 10 }}>
          <Col span={6}>
            {addButtonRender(<UploadOutlined />, "Chọn File", null, false)}
          </Col>
          <Col>
            {addButtonRender(<ImportOutlined />, "Import", "primary", true)}
          </Col>
        </Row>
        <Table
          bordered
          scroll={{ x: 1200 }}
          columns={columns}
          components={components}
          className="gx-table-responsive"
          dataSource={active && dataList}
          size="middle"
          rowClassName={"editable-row"}
          // pagination={{
          //   onChange: handleTableChange,
          //   pageSize,
          //   total: totalRow,
          //   showSizeChanger: false,
          //   showQuickJumper: true,
          //   showTotal: (total) =>
          //     totalRow <= total
          //       ? `Hiển thị ${data.data.length} trong tổng ${totalRow}`
          //       : `Tổng ${totalPages}`,
          // }}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default ImportThietBi;
