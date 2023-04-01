import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
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

function TimThietBi({ history, permission }) {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(({ common }) => common).toJS();
  const [keyword, setKeyword] = useState("");
  const [NhomSelect, setNhomSelect] = useState([]);
  const [HangSelect, setHangSelect] = useState([]);
  const [loaiSelect, setLoaiSelect] = useState([]);
  const [activeHang, setActiveHang] = useState(true);
  const [activeLoai, setActiveLoai] = useState(true);
  const [selectedHang, setSelectedHang] = useState();
  const [selectedLoai, setSelectedLoai] = useState();
  const [idHang, setIdHang] = useState("");
  const [idNhom, setIdNhom] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;

  useEffect(() => {
    if (permission && permission.view) {
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
  const getListData = (Nhom_Id, Hang_Id, Loai_Id, keyword, page, pageSize) => {
    let param = convertObjectToUrlParams({
      Nhom_Id,
      Hang_Id,
      keyword,
      pageSize,
      page,
    });
    dispatch(
      fetchStart(
        `VatTu/SearchVatTu?${param}`,
        "POST",
        Loai_Id != null ? [Loai_Id] : [],
        "LIST"
      )
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
    // getListData(keyword, pagination, pageSize);
  };

  /**
   * Tìm kiếm người dùng
   *
   */
  const onSearchNguoiDung = () => {
    getListData(idNhom, idHang, null, keyword, page, pageSize);
  };

  /**
   * Thay đổi keyword
   *
   * @param {*} val
   */
  const onChangeKeyword = (val) => {
    console.log(val.target.value.length);
    setKeyword(val.target.value);
    if (val.target.value === "") {
      getListData(idNhom, idHang, null, "", page, pageSize);
    }
    // if (isEmpty(val.target.value)) {
    //   getListData(val.target.value, page, pageSize);
    // }
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
   * Lấy danh sách quyền
   *
   */
  const getNhom = () => {
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`Nhom`, "GET", null, "LIST", "listNhom", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setNhomSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
  };

  const getHang = (id) => {
    let param = convertObjectToUrlParams({ id });
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(
          `Nhom/GetChiTietNhom?${param}`,
          "GET",
          null,
          "LIST",
          "listHang",
          resolve,
          reject
        )
      );
    })
      .then((res) => {
        if (res && res.data) {
          setHangSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
  };
  const getLoai = (idNhom, idHang) => {
    let param = convertObjectToUrlParams({ idNhom, idHang });
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(
          `Hang/GetChiTietHang?${param}`,
          "GET",
          null,
          "LIST",
          "listLoai",
          resolve,
          reject
        )
      );
    })
      .then((res) => {
        if (res && res.data) {
          setLoaiSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
  };

  function handleOnSelectNhom(id) {
    getHang(id);
    setIdNhom(id);
    setSelectedHang(null);
    setSelectedLoai(null);
    setActiveHang(false);
    setActiveLoai(true);
    getListData(id, "", null, "", page, pageSize);
  }
  function handleOnSelectHang(id) {
    getLoai(idNhom, id);
    setIdHang(id);
    setActiveLoai(false);
    getListData(idNhom, id, null, "", page, pageSize);
  }
  function handleOnSelectLoai(id) {
    getListData(idNhom, idHang, id, "", page, pageSize);
  }

  const { totalPages, totalRow } = data;
  const dataList = reDataForTable(data, page, pageSize);
  dataList.map((d) => {
    d.tenLoai = d.lstLoai.map((d) => d.tenLoai)[0];
  });
  return (
    <div className="gx-main-content">
      <Card className="th-card-margin-bottom" title="Tìm thiết bị">
        <Row style={{ marginBottom: 20 }}>
          <Col span={2}>Nhóm:</Col>
          <Col span={5}>
            <Select
              className="heading-select slt-search th-select-heading"
              data={NhomSelect ? NhomSelect : []}
              placeholder="Chọn nhóm"
              optionsvalue={["id", "tenNhom"]}
              style={{ width: "100%" }}
              onSelect={handleOnSelectNhom}
            />
          </Col>
          <Col span={2}>Hãng:</Col>
          <Col span={5}>
            <Select
              className="heading-select slt-search th-select-heading"
              data={HangSelect ? HangSelect : []}
              placeholder="Chọn hãng"
              optionsvalue={["id", "tenHang"]}
              style={{ width: "100%" }}
              disabled={activeHang}
              onSelect={handleOnSelectHang}
              onChange={(value) => setSelectedHang(value)}
              value={selectedHang}
            />
          </Col>
          <Col span={2}>Loại:</Col>
          <Col span={8}>
            <Select
              className="heading-select slt-search th-select-heading"
              data={loaiSelect ? loaiSelect : []}
              placeholder="Chọn loại"
              optionsvalue={["loai_Id", "tenLoai"]}
              style={{ width: "100%" }}
              disabled={activeLoai}
              allowClear
              onSelect={handleOnSelectLoai}
              onChange={(value) => setSelectedLoai(value)}
              value={selectedLoai}
              onClear={onSearchNguoiDung}
            />
          </Col>
          <Col span={2} style={{ marginTop: 12 }}>
            Từ khóa:
          </Col>
          <Col span={22}>
            <Toolbar
              count={1}
              search={{
                loading,
                value: keyword,
                onChange: onChangeKeyword,
                onPressEnter: onSearchNguoiDung,
                onSearch: onSearchNguoiDung,
                placeholder: "Nhập từ khóa",
                allowClear: true,
              }}
            />
          </Col>
        </Row>
        <Table
          bordered
          scroll={{ y: 200 }}
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
          }}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default TimThietBi;
