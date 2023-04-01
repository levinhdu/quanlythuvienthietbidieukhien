import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Col,
  Row,
  Form,
  Input,
  InputNumber,
} from "antd";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import { findIndex } from "lodash";

import map from "lodash/map";
import React, { useEffect, useState, useRef } from "react";
import { Select, FormSubmit } from "src/components/Common";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { treeToFlatlist, exportExcel } from "src/util/Common";
import { useOnClickOutside } from "src/util/useOnClickOutside";
import ModalXuatFile from "./ModalXuatFile";

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

function XuatFileIn({ history, permission }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(({ common }) => common).toJS();
  const [data, setData] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [render, setRender] = useState(false);
  const [activeExport, setActiveExport] = useState(true);
  const [activeInput, setActiveInput] = useState(false);
  const [soLuong, setSoLuong] = useState([]);
  const [column, setColumn] = useState();
  const ref = useRef();
  const [page, setPage] = useState(1);
  const pageSize = PAGE_SIZE;

  useEffect(() => {
    if (permission && permission.view) {
      getDataLocalStrorage();
    } else {
      history.push("/home");
    }
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal]);

  useEffect(() => {
    getDataLocalStrorage();
  }, [render]);

  useOnClickOutside(ref, () => soLuong && setActiveInput(false));

  const getDataLocalStrorage = () => {
    const newData = localStorage.getItem("dataThietBi");
    if (newData.length > 2) {
      setActiveExport(false);
    } else {
      setActiveExport(true);
    }
    setData(JSON.parse(newData));
  };

  const deleteDataLocalStrorage = (d) => {
    const i = findIndex(data, (x) => x.id === d.id);
    data.splice(i, 1);
    localStorage.setItem("dataThietBi", JSON.stringify(data));
    setRender(!render);
  };
  /**
   * handleTableChange
   *
   * Fetch dữ liệu dựa theo thay đổi trang
   * @param {number} pagination
   */
  const handleTableChange = (pagination) => {
    setPage(page);
    // getListData(keyword, pagination, pageSize);
  };

  /**
   * ActionContent: Action in table
   * @param {*} item
   * @returns View
   * @memberof ChucNang
   */
  const actionContent = (item) => {
    const deleteItemVal =
      permission.del && !item.isUsed
        ? { onClick: () => deleteDataLocalStrorage(item) }
        : { disabled: true };
    return (
      <div>
        <React.Fragment>
          <a {...deleteItemVal} title="Xóa">
            <DeleteOutlined />
          </a>
        </React.Fragment>
      </div>
    );
  };

  const renderInput = (value, index) => {
    return !activeInput ? (
      <div
        style={{
          width: "100%",
          height: 10,
          cursor: "pointer",
        }}
        key={index}
        onClick={() => setActiveInput(true)}
      >
        {!activeInput && soLuong}
      </div>
    ) : (
      <Row
        ref={ref}
        style={{
          width: "60%",
          marginLeft: 35,
          marginBottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Form.Item
          style={{ marginBottom: 0 }}
          name="soLuong"
          rules={[
            {
              required: true,
              message: "Số lượng là bắt buộc.",
            },
          ]}
        >
          <Input
            onChange={(e) => {
              setSoLuong(e.target.value);
            }}
          />
        </Form.Item>
      </Row>
    );
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
    { title: "Đơn vị", dataIndex: "tenDonViTinh", key: "tenDonViTinh" },
    {
      title: "Số lượng",
      key: "soLuong",
      render: (value, a, index) => renderInput(value, index),
    },
    {
      title: "Thông số kỹ thuật",
      dataIndex: "thongSoKyThuat",
      key: "thongSoKyThuat",
    },
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
      }),
    };
  });

  const handleRedirect = () => {
    setActiveModal(true);
  };

  const addButtonRender = () => {
    return (
      <Button
        icon={<SearchOutlined />}
        className="th-btn-margin-bottom-0"
        type="primary"
        onClick={handleRedirect}
        disabled={!permission.add}
      >
        Chọn thiết bị
      </Button>
    );
  };

  const handleClickExport = () => {
    const newDataExport = dataList.map((d) => {
      return {
        maVatTu: d.maVatTu,
        tenVatTu: d.tenVatTu,
        tenDonViTinh: d.tenDonViTinh,
        soLuong: d.soLuong,
        thongSoKyThuat: d.thongSoKyThuat,
        pathImage: d.pathImage,
      };
    });
    console.log(newDataExport);
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(
          `VatTu/ExportFileExcel`,
          "POST",
          newDataExport,
          "LIST",
          "listLoai",
          resolve,
          reject
        )
      );
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => console.error(error));
  };

  // const { totalPages, totalRow } = data;
  const dataList = reDataForTable(data, page, pageSize);
  return (
    <div className="gx-main-content">
      <Card
        className="th-card-margin-bottom"
        title="Xuất file yêu cầu"
        extra={addButtonRender()}
      >
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
            total: dataList.length,
            showSizeChanger: false,
            showQuickJumper: true,
          }}
          loading={loading}
        />
        <Button
          onClick={handleClickExport}
          className="th-btn-margin-bottom-0"
          type="primary"
          style={{ marginTop: 10, float: "right" }}
          disabled={activeExport}
        >
          Xuất File
        </Button>

        <ModalXuatFile
          openModal={activeModal}
          openModalFS={setActiveModal}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default XuatFileIn;
