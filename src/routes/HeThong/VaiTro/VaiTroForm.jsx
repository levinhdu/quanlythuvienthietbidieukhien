import React, { useState, useEffect } from "react";
import { Form, Card, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import includes from "lodash/includes";

import { Input, FormSubmit } from "src/components/Common";
import { fetchStart, fetchReset } from "src/appRedux/actions/Common";
import { DEFAULT_FORM_STYLE } from "src/constants/Config";
import ContainerHeader from "src/components/ContainerHeader";

const FormItem = Form.Item;

const initState = {
  name: "",
  description: "",
};

function VaiTroForm({ history, match, permission }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(({ common }) => common).toJS();
  const [id, setId] = useState(undefined);
  const [type, setType] = useState("new");
  const [fieldTouch, setFieldTouch] = useState(false);

  const [form] = Form.useForm();
  const { setFieldsValue, resetFields, validateFields } = form;
  const { name, description } = initState;

  useEffect(() => {
    const load = () => {
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
    };
    load();
    return () => dispatch(fetchReset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Lấy thông tin vai trò
   *
   */
  const getInfo = (id) => {
    new Promise((resolve, reject) => {
      dispatch(
        fetchStart(`Role/${id}`, "GET", null, "DETAIL", "", resolve, reject)
      );
    })
      .then((res) => {
        if (res.data) {
          setType("edit");
          setFieldsValue({
            vaiTro: res.data,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  /**
   * Khi submit
   *
   * @param {*} values
   */
  const onFinish = (values) => {
    saveData(values.vaiTro);
  };

  /**
   * Lưu và thoát
   *
   */
  const saveAndClose = () => {
    validateFields()
      .then((values) => {
        saveData(values.vaiTro, true);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  /**
   * Lưu dữ liệu
   *
   * @param {*} vaiTro
   * @param {boolean} [saveQuit=false]
   */
  const saveData = (vaiTro, saveQuit = false) => {
    if (type === "new") {
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(`Role`, "POST", vaiTro, "ADD", "", resolve, reject)
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
      const newData = vaiTro;
      newData.id = id;
      new Promise((resolve, reject) => {
        dispatch(
          fetchStart(`Role/${id}`, "PUT", newData, "EDIT", "", resolve, reject)
        );
      })
        .then((res) => {
          if (saveQuit) {
            if (res.status !== 409) goBack();
          } else {
            getInfo(id);
            setFieldTouch(false);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  /**
   * Quay lại danh sách vai trò
   *
   */
  const goBack = () => {
    history.push("/he-thong/vai-tro");
  };

  const formTitle = type === "new" ? "Thêm mới vai trò" : "Chỉnh sửa vai trò";
  return (
    <div className="gx-main-content">
      <ContainerHeader title={formTitle} back={goBack} />
      <Card className="th-card-margin-bottom">
        <Spin spinning={loading}>
          <Form
            {...DEFAULT_FORM_STYLE}
            form={form}
            name="vai-tro-control"
            onFinish={onFinish}
            onFieldsChange={() => setFieldTouch(true)}
          >
            <FormItem
              label="Mã quyền"
              name={["vaiTro", "name"]}
              rules={[
                {
                  type: "string",
                  required: true,
                  max: 255,
                },
              ]}
              initialValue={name}
            >
              <Input className="input-item" placeholder="Nhập Mã quyền" />
            </FormItem>
            <FormItem
              label="Tên quyền"
              name={["vaiTro", "description"]}
              rules={[
                {
                  type: "string",
                  required: true,
                  max: 255,
                },
              ]}
              initialValue={description}
            >
              <Input className="input-item" placeholder="Nhập Tên quyền" />
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

export default VaiTroForm;
