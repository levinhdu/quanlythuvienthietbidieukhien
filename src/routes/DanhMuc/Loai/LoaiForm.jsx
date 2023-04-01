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
  maLoai: "",
  tenLoai: "",
};
const LoaiForm = ({ history, match, permission }) => {
  const dispatch = useDispatch();
  const [type, setType] = useState("new");
  const [id, setId] = useState(undefined);
  const [fieldTouch, setFieldTouch] = useState(false);
  const [info, setInfo] = useState({});

  const [form] = Form.useForm();
  const { maLoai, tenLoai } = initialState;

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
        fetchStart(`Loai/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res && res.data) {
          setFieldsValue({
            loai: res.data[0],
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
    history.push("/danh-muc/loai");
  };

  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.loai);
  };

  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        saveData(values.loai, true);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const saveData = (loai, saveQuit = false) => {
    if (type === "new") {
      const newData = loai;
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(`Loai`, "POST", newData, "ADD", "", resolve, reject)
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
      const newData = { ...info, ...loai };
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(`Loai/${id}`, "PUT", newData, "EDIT", "", resolve, reject)
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

  const formTitle = type === "new" ? "Thêm mới loại" : "Chỉnh sửa loại";
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
            label="Mã loại"
            name={["loai", "maLoai"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={maLoai}
          >
            <Input className="input-item" placeholder="Nhập mã loại" />
          </FormItem>
          <FormItem
            label="Tên loại"
            name={["loai", "tenLoai"]}
            rules={[
              {
                type: "string",
                required: true,
              },
            ]}
            initialValue={tenLoai}
          >
            <Input className="input-item" placeholder="Nhập tên loại" />
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

export default LoaiForm;
