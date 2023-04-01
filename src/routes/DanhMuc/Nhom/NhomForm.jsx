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
  maNhom: "",
  tenNhom: "",
};
const NhomForm = ({ history, match, permission }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("new");
  const [id, setId] = useState(undefined);
  const [roleSelect, setRoleSelect] = useState([]);
  const [fieldTouch, setFieldTouch] = useState(false);
  const [info, setInfo] = useState({});
  const [form] = Form.useForm();
  const { maNhom, tenNhom } = initialState;
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
        fetchStart(`Nhom/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setFieldsValue({
            nhom: res.data[0],
          });
        }
        setInfo(res.data[0]);
      })
      .catch((error) => console.error(error));
  };

  /**
   * Quay lại trang người dùng
   *
   */
  const goBack = () => {
    history.push("/danh-muc/nhom");
  };

  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.nhom);
  };

  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        saveData(values.nhom, true);
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
          fetchStart(`Nhom`, "POST", newData, "ADD", "", resolve, reject)
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
      const newData = { ...info, ...user };
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(`Nhom/${id}`, "PUT", newData, "EDIT", "", resolve, reject)
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

  const formTitle = type === "new" ? "Thêm mới đơn vị" : "Chỉnh sửa đơn vị";
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
            label="Mã nhóm"
            name={["nhom", "maNhom"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={maNhom}
          >
            <Input className="input-item" placeholder="Nhập mã nhóm" />
          </FormItem>
          <FormItem
            label="Tên nhóm"
            name={["nhom", "tenNhom"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={tenNhom}
          >
            <Input className="input-item" placeholder="Nhập tên nhóm" />
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

export default NhomForm;
