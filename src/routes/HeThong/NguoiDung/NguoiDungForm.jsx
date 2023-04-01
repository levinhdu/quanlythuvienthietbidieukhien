import React, { useState, useEffect } from "react";
import { Form, Input, Card, Switch } from "antd";
import { useDispatch } from "react-redux";
import includes from "lodash/includes";

import { Select, FormSubmit } from "src/components/Common";
import { fetchStart, fetchReset } from "src/appRedux/actions";
import { DEFAULT_FORM_STYLE } from "src/constants/Config";
import ContainerHeader from "src/components/ContainerHeader";

const FormItem = Form.Item;

const initialState = {
  email: "",
  fullName: "",
  userName: "",
  roleNames: [],
  isActive: true,
};
const NguoiDungForm = ({ history, match, permission }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("new");
  const [id, setId] = useState(undefined);
  const [roleSelect, setRoleSelect] = useState([]);
  const [fieldTouch, setFieldTouch] = useState(false);
  const [form] = Form.useForm();
  const { email, fullName, userName, roleNames, isActive } = initialState;
  const { validateFields, resetFields, setFieldsValue } = form;

  useEffect(() => {
    const load = () => {
      if (includes(match.url, "them-moi")) {
        if (permission && permission.add) {
          setType("new");
        } else {
          history.push("/home");
        }
      } else {
        if (permission && permission.edit) {
          setType("edit");
          // Get info
          const { id } = match.params;
          setId(id);
          getInfo();
        } else {
          history.push("/home");
        }
      }
      getRole();
    };
    load();
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Lấy thông tin
   *
   */
  const getInfo = () => {
    const { id } = match.params;
    setId(id);
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`Account/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setFieldsValue({
            user: res.data,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  /**
   * Lấy danh sách quyền
   *
   */
  const getRole = () => {
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(
          `Role/Form`,
          "GET",
          null,
          "LIST",
          "listRole",
          resolve,
          reject
        )
      );
    })
      .then((res) => {
        if (res && res.data) {
          setRoleSelect(res.data);
        }
      })
      .catch((error) => console.error(error));
  };

  /**
   * Quay lại trang người dùng
   *
   */
  const goBack = () => {
    history.push("/he-thong/nguoi-dung");
  };

  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.user);
  };

  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        console.log(values);
        saveData(values.user, true);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const saveData = (user, saveQuit = false) => {
    if (type === "new") {
      const newData = user;
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(`Account`, "POST", newData, "ADD", "", resolve, reject)
        );
      })
        .then((res) => {
          if (saveQuit) {
            if (res.status !== 409) goBack();
          } else {
            resetFields();
            setFieldTouch(false);
          }
        })
        .catch((error) => console.error(error));
    }
    if (type === "edit") {
      const newData = user;
      newData.id = id;
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(
            `Account/${id}`,
            "PUT",
            newData,
            "EDIT",
            "",
            resolve,
            reject
          )
        );
      })
        .then((res) => {
          if (saveQuit) {
            if (res.status !== 409) goBack();
          } else {
            getInfo();
            setFieldTouch(false);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  const formTitle =
    type === "new" ? "Thêm mới người dùng" : "Chỉnh sửa người dùng";
  return (
    <div className="gx-main-content">
      <ContainerHeader title={formTitle} back={goBack} />
      <Card className="th-card-margin-bottom">
        <Form
          {...DEFAULT_FORM_STYLE}
          form={form}
          name="nguoi-dung-control"
          onFinish={onFinish}
          onFieldsChange={() => setFieldTouch(true)}
        >
          <FormItem
            label="Địa chỉ email"
            name={["user", "email"]}
            rules={[
              {
                type: "email",
                required: true,
              },
            ]}
            initialValue={email}
          >
            <Input className="input-item" placeholder="Nhập địa chỉ email" />
          </FormItem>
          <FormItem
            label="Họ tên"
            name={["user", "fullName"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={fullName}
          >
            <Input className="input-item" placeholder="Nhập họ tên" />
          </FormItem>
          <FormItem
            label="Mã nhân viên"
            name={["user", "userName"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={userName}
          >
            <Input className="input-item" placeholder="Nhập mã nhân viên" />
          </FormItem>
          <FormItem
            label="Vai trò"
            name={["user", "roleNames"]}
            rules={[
              {
                type: "array",
                required: true,
              },
            ]}
            initialValue={roleNames}
          >
            <Select
              className="heading-select slt-search th-select-heading"
              data={roleSelect ? roleSelect : []}
              placeholder="Chọn vai trò"
              optionsvalue={["name", "description"]}
              style={{ width: "100%" }}
              mode="multiple"
            />
          </FormItem>
          <FormItem
            label="Hoạt động"
            name={["user", "isActive"]}
            valuePropName="checked"
            initialValue={isActive}
          >
            <Switch />
          </FormItem>
          <FormSubmit
            goBack={goBack}
            saveAndClose={saveAndClose}
            disabled={fieldTouch}
          />
        </Form>
      </Card>
    </div>
  );
};

export default NguoiDungForm;
