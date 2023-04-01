import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Modal as AntModal, Button, Card, Divider, Col, Row, Tag } from "antd";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { findIndex, indexOf, remove, union } from "lodash";
import React, { useEffect, useState } from "react";
import { Select, FormSubmit } from "src/components/Common";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { treeToFlatlist } from "src/util/Common";

import { fetchReset, fetchStart } from "src/appRedux/actions/Common";
import {
  getToolbarValue,
  reDataForTableByKey,
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

function ModalXuatFile({ openModalFS, openModal, loading }) {
  const dispatch = useDispatch();
  const { data } = useSelector(({ common }) => common).toJS();
  const [keyword, setKeyword] = useState("");
  const [NhomSelect, setNhomSelect] = useState([]);
  const [HangSelect, setHangSelect] = useState([]);
  const [loaiSelect, setLoaiSelect] = useState([]);
  const [activeHang, setActiveHang] = useState(true);
  const [activeLoai, setActiveLoai] = useState(true);
  const [selectedNhom, setSelectedNhom] = useState();
  const [selectedHang, setSelectedHang] = useState();
  const [selectedLoai, setSelectedLoai] = useState();
  const [selectedDevice, setSelectedDevice] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [idHang, setIdHang] = useState("");
  const [idNhom, setIdNhom] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;

  useEffect(() => {
    setSelectedNhom(null);
    setSelectedDevice([]);
    setSelectedKeys([]);
    getNhom();
  }, [openModal]);
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
    setPage(page);
    // reDataForTableByKey(data, "maVatTu", pagination, pageSize);
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
    setKeyword(val.target.value);
    if (val.target.value === "") {
      getListData(idNhom, idHang, null, "", page, pageSize);
    }
    // if (isEmpty(val.target.value)) {
    //   getListData(val.target.value, page, pageSize);
    // }
  };
  let colValues = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
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
      }),
    };
  });

  const setLocalStorage = () => {
    const newData = JSON.parse(localStorage.getItem("dataThietBi"));
    if (newData) {
      const new1 = [];
      newData
        .map((element) => {
          return selectedDevice.map((e, i) => {
            if (e.id === element.id) {
              return e.id;
            }
          });
        })
        .forEach((element) => {
          element.forEach((e) => {
            if (e !== undefined) new1.push(e);
          });
        });
      new1.forEach((element) => {
        const i = findIndex(selectedDevice, (x) => x.id === element);
        selectedDevice.splice(i, 1);
      });
      newData.push(...selectedDevice);
      localStorage.setItem("dataThietBi", JSON.stringify(newData));
    } else {
      localStorage.setItem("dataThietBi", JSON.stringify(selectedDevice));
    }
  };
  const handleCancel = () => {
    openModalFS(false);
  };

  const handleOk = () => {
    setLocalStorage();
    openModalFS(false);
  };
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

  function hanldeRemoveSelected(device) {
    const newDevice = remove(selectedDevice, (d) => {
      return d !== device;
    });
    const newKeys = remove(selectedKeys, (d) => {
      return d !== device.key;
    });
    setSelectedDevice(newDevice);
    setSelectedKeys(newKeys);
  }

  const renderDisplaySelected = () => {
    return (
      <div>
        <span>Thiết bị đã chọn: </span>
        {selectedDevice.map((item, index) => {
          return (
            <Tag key={index}>
              {item.maVatTu}
              <CloseOutlined
                onClick={() => hanldeRemoveSelected(item)}
                style={{ marginLeft: 5, cursor: "pointer" }}
              />
            </Tag>
          );
        })}
      </div>
    );
  };

  // const { totalPages, totalRow } = data;
  const dataList = reDataForTableByKey(data, "maVatTu", page, pageSize);
  dataList.map((d) => {
    d.tenLoai = d.lstLoai.map((d) => d.tenLoai)[0];
  });

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    selectedRows: selectedDevice,
    onChange: (selectedRowKeys, selectedRows) => {
      const newSelectedDevice = [...selectedRows];
      const newSelectedKey = [...selectedRowKeys];
      setSelectedDevice(newSelectedDevice);
      setSelectedKeys(newSelectedKey);

      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
    },
  };

  return (
    <AntModal
      title="Chọn thiết bị "
      visible={openModal}
      width={`70%`}
      closable={true}
      onCancel={handleCancel}
      onOk={handleOk}
      footer={[
        <Button type="primary" onClick={handleOk}>
          OK
        </Button>,
      ]}
    >
      <Row>
        <Col span={2}>Nhóm:</Col>
        <Col span={5}>
          <Select
            className="heading-select slt-search th-select-heading"
            data={NhomSelect ? NhomSelect : []}
            placeholder="Chọn nhóm"
            optionsvalue={["id", "tenNhom"]}
            style={{ width: "100%" }}
            onSelect={handleOnSelectNhom}
            onChange={(value) => setSelectedNhom(value)}
            value={selectedNhom}
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
        <Col span={24} style={{ marginBottom: 15 }}>
          {selectedDevice && renderDisplaySelected()}
        </Col>
      </Row>
      <Table
        bordered
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
          hideSelectAll: true,
          preserveSelectedRowKeys: true,
        }}
        scroll={{ y: 100 }}
        columns={columns}
        components={components}
        className="gx-table-responsive"
        dataSource={dataList}
        size="middle"
        rowClassName={"editable-row"}
        pagination={{
          onChange: handleTableChange,
          pageSize,
          total: dataList.length,
          showSizeChanger: false,
          showQuickJumper: true,
        }}
        loading={loading}
      />
    </AntModal>
  );
}

export default ModalXuatFile;
