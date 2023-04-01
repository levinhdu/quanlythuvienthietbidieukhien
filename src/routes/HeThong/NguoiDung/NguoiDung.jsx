import React, { useState, useEffect } from "react";
import { Card, Button, Divider, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UnlockOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";

import { ModalDeleteConfirm, Table, Toolbar } from "src/components/Common";
import { fetchStart, fetchReset } from "src/appRedux/actions/Common";
import { convertObjectToUrlParams, reDataForTable } from "src/util/Common";
import { PAGE_SIZE } from "src/constants/Config";
import ContainerHeader from "src/components/ContainerHeader";

function NguoiDung({ history, permission }) {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const pageSize = PAGE_SIZE;
  const dispatch = useDispatch();
  const { data, loading } = useSelector(({ common }) => common).toJS();

  useEffect(() => {
    if (permission && permission.view) {
      getListData(keyword, page, pageSize);
    } else {
      history.push("/home");
    }
    return () => {
      dispatch(fetchReset());
    };
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
    dispatch(fetchStart(`Account?${param}`, "GET", null, "LIST"));
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
   * Chuyển tới trang thêm mới người dùng
   *
   */
  const handleRedirect = () => {
    history.push({
      pathname: "/he-thong/nguoi-dung/them-moi",
    });
  };

  /**
   * Render trạng thái kích hoạt của người dùng
   *
   * @param {*} value
   * @param {*} record
   * @returns
   */
  const activeNguoiDung = (value, record) => {
    if (value) {
      return (
        <UnlockOutlined
          style={{ color: "green", fontSize: 16 }}
          onClick={() => callActiveNguoiDung(record.id)}
        />
      );
    }
    return (
      <LockOutlined
        style={{ color: "red", fontSize: 16 }}
        onClick={() => callActiveNguoiDung(record.id)}
      />
    );
  };

  /**
   * Gọi API đổi trạng thái người dùng
   *
   * @param {*} id
   */
  const callActiveNguoiDung = (id) => {
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(
          `Account/Active/${id}`,
          "PUT",
          null,
          "EDIT",
          "",
          resolve,
          reject
        )
      );
    })
      .then((res) => {
        if (res.status === 200) {
          getListData(keyword, page, pageSize);
        }
      })
      .catch((err) => console.error(err));
  };

  /**
   * ActionContent: Hành động trên bảng
   *
   * @param {*} item
   * @returns View
   */
  const actionContent = (item) => {
    const editItem = permission.edit ? (
      <Link
        to={{
          pathname: `/he-thong/nguoi-dung/${item.id}/chinh-sua`,
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
    const resetPass = permission.edit
      ? { onClick: () => resetPassword(item.id) }
      : { disabled: true };
    const deleteItemVal = permission.del
      ? { onClick: () => deleteItemFunc(item) }
      : { disabled: true };
    return (
      <React.Fragment>
        {editItem}
        <Divider type="vertical" />
        <a {...deleteItemVal} title="Xóa">
          <DeleteOutlined />
        </a>
        <Divider type="vertical" />
        <a {...resetPass} title="Khôi phục mật khẩu">
          <ReloadOutlined />
        </a>
      </React.Fragment>
    );
  };

  /**
   * deleteItem: Xoá item theo item
   *
   * @param {number} item
   * @returns
   */
  const deleteItemFunc = async (item) => {
    ModalDeleteConfirm(deleteItemAction, item);
  };

  /**
   * Xóa item
   *
   * @param {*} item
   */
  const deleteItemAction = (item) => {
    let url = `Account/${item.id}`;
    new Promise((resolve, reject) => {
      dispatch(fetchStart(url, "DELETE", null, "DELETE", "", resolve, reject));
    })
      .then((res) => {
        // Reload lại danh sách
        getListData(keyword, page, pageSize);
      })
      .catch((error) => console.error(error));
  };

  /**
   * Reset password
   *
   * @param {*} id
   */
  const resetPassword = (id) => {
    dispatch(fetchStart(`Account/ResetPassword/${id}`, "PUT", null, "EDIT"));
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
   * Hiển thị bảng
   *
   * @returns
   */
  const header = () => {
    let renderHead = [
      {
        title: "STT",
        dataIndex: "key",
        key: "key",
        width: "5%",
        align: "center",
      },
      { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
      { title: "Email", dataIndex: "email", key: "email" },
      {
        title: "Quyền",
        dataIndex: "roleNames",
        key: "roleNames",
        render: (val) => renderDisplayName(val),
      },
    ];
    if (permission.edit) {
      renderHead = [
        ...renderHead,
        {
          title: "Trạng thái",
          key: "isActive",
          dataIndex: "isActive",
          align: "center",
          render: (value, record) => activeNguoiDung(value, record),
        },
      ];
    }
    renderHead = [
      ...renderHead,
      {
        title: "Hành động",
        key: "action",
        align: "center",
        render: (value) => actionContent(value),
      },
    ];
    return renderHead;
  };

  /**
   * Hiển thị tag quyền
   *
   * @param {*} val
   * @returns
   */
  const renderDisplayName = (val) => {
    if (!isEmpty(val)) {
      return map(val, (item, index) => {
        let color = "green";
        if (item.trim() === "Quản trị") color = "magenta";
        return (
          <Tag key={index} color={color}>
            {item}
          </Tag>
        );
      });
    }
    return null;
  };

  /**
   * Hiển thị button thêm
   *
   * @returns
   */
  const addButtonRender = () => {
    return (
      <Button
        icon={<PlusOutlined />}
        className="th-margin-bottom-0"
        type="primary"
        onClick={handleRedirect}
      >
        Thêm mới
      </Button>
    );
  };

  const { totalPages, totalRow } = data;
  // console.log(data.data);
  const dataList = reDataForTable(data.data, page, pageSize);
  // console.log(dataList );
  return (
    <div className="gx-main-content">
      <ContainerHeader
        title="Người dùng"
        description="Danh sách người dùng"
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
          columns={header()}
          className="gx-table-responsive"
          dataSource={dataList}
          size="middle"
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

export default NguoiDung;
