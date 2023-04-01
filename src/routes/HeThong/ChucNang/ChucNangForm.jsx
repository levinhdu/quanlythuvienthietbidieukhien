import React, { useState, useEffect } from "react";
import { Card, Form, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { includes } from "lodash";
import { Icon } from "@ant-design/compatible";

import { Input, TreeSelect, FormSubmit } from "src/components/Common";
import {
  fetchStart,
  fetchReset,
  fetchResetItem,
} from "src/appRedux/actions/Common";
import { DEFAULT_FORM_STYLE } from "src/constants/Config";
import ContainerHeader from "src/components/ContainerHeader";

const FormItem = Form.Item;

const initialState = {
  tenMenu: "",
  parent_Id: "root",
  url: "",
};

function ChucNangForm({ match, permission, history }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, item } = useSelector(({ common }) => common).toJS();

  const [type, setType] = useState("new");
  const [id, setId] = useState(undefined);
  const [icon, setIcon] = useState("file-unknown");
  const [listMenu, setListMenu] = useState([]);
  const [fieldTouch, setFieldTouch] = useState(false);

  const { setFieldsValue, validateFields, resetFields } = form;
  useEffect(() => {
    if (includes(match.url, "them-moi")) {
      if (permission && !permission.add) {
        history.push("/home");
      } else {
        setType("new");
      }
    } else {
      if (permission && !permission.edit) {
        history.push("/home");
      } else {
        if (match.params.id) {
          setType("edit");
          setId(match.params.id);
          getInfo(match.params.id);
        }
      }
    }
    if (permission && (permission.add || permission.edit)) {
      // Lấy danh sách menu
      getListMenu();
    }

    return () => {
      dispatch(fetchReset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Lấy thông tin info
   *
   * @param {*} id
   */
  const getInfo = (id) => {
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`Menu/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        const newData = res.data;
        if (newData.parent_Id === null) newData.parent_Id = "root";
        setFieldsValue({
          chucNang: newData,
        });
      })
      .catch((error) => console.error(error));
  };

  /**
   * Lấy danh sách menu
   *
   */
  const getListMenu = async () => {
    dispatch(fetchResetItem("listMenu"));
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart("Menu", "GET", null, "LIST", "listMenu", resolve, reject)
      );
    })
      .then((res) => {
        setListMenu([]);
        const newList = { id: "root", tenMenu: "Root", children: [] };
        setListMenu([newList, ...res.data]);
      })
      .catch((error) => console.error(error));
  };

  const { tenMenu, parent_Id, url } = initialState;
  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.chucNang);
  };

  const onChangeIcon = (e) => {
    setIcon(e.target.value);
  };

  /**
   * Lưu và thoát
   *
   */
  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        saveData(values.chucNang, true);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const saveData = (chucNang, saveQuit = false) => {
    if (type === "new") {
      const newUser = chucNang;
      newUser.parent_Id =
        newUser.parent_Id === "root" ? null : newUser.parent_Id;
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(`Menu`, "POST", newUser, "ADD", "", resolve, reject)
        );
      })
        .then((res) => {
          if (saveQuit) {
            goBack();
          } else {
            resetFields();
            setFieldTouch(false);
            getListMenu();
          }
        })
        .catch((error) => console.error(error));
    }
    if (type === "edit") {
      const editUser = { ...item, ...chucNang };
      editUser.parent_Id =
        editUser.parent_Id === "root"
          ? (editUser.parent_Id = null)
          : editUser.parent_Id;
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(`Menu/${id}`, "PUT", editUser, "EDIT", "", resolve, reject)
        );
      })
        .then((res) => {
          if (saveQuit) {
            goBack();
          } else {
            setFieldTouch(false);
            getInfo(id);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  /**
   * Quay lại trang chức năng
   *
   */
  const goBack = () => {
    history.push("/he-thong/chuc-nang");
  };

  const formTitle =
    type === "new" ? "Thêm mới chức năng" : "Chỉnh sửa chức năng";

  return (
    <div className="gx-main-content">
      <ContainerHeader title={formTitle} back={goBack} />
      <Card className="th-card-margin-bottom">
        <Spin spinning={loading}>
          <Form
            {...DEFAULT_FORM_STYLE}
            form={form}
            name="nguoi-dung-control"
            onFinish={onFinish}
            onFieldsChange={() => setFieldTouch(true)}
          >
            <FormItem
              label="Tên menu"
              name={["chucNang", "tenMenu"]}
              rules={[
                {
                  type: "string",
                  required: true,
                },
                {
                  max: 250,
                },
              ]}
              initialValue={tenMenu}
            >
              <Input className="input-item" placeholder="Nhập tên menu" />
            </FormItem>
            <FormItem
              label="Chọn menu cha"
              name={["chucNang", "parent_Id"]}
              rules={[
                {
                  type: "string",
                },
              ]}
              initialValue={parent_Id}
            >
              <TreeSelect
                className="tree-select-item"
                datatreeselect={listMenu}
                name="menu"
                options={["id", "tenMenu", "children"]}
                placeholder="Chọn menu cha"
                style={{ width: "100%" }}
              />
            </FormItem>
            <FormItem
              label="Path"
              name={["chucNang", "url"]}
              rules={[
                {
                  type: "string",
                  required: true,
                },
                {
                  max: 250,
                },
              ]}
              initialValue={url}
            >
              <Input className="input-item" placeholder="Nhập đường dẫn" />
            </FormItem>
            <FormItem
              label="Icon"
              name={["chucNang", "icon"]}
              rules={[
                {
                  type: "string",
                  required: true,
                },
                {
                  max: 250,
                },
              ]}
            >
              <Input
                className="input-item"
                placeholder="Nhập tên icon"
                addonAfter={<Icon type={icon} />}
                onChange={onChangeIcon}
              />
            </FormItem>
            <FormSubmit
              goBack={goBack}
              saveAndClose={saveAndClose}
              disabled={fieldTouch}
            />
          </Form>
        </Spin>
      </Card>
    </div>
  );
}

export default ChucNangForm;
