import React, { useState, useRef, useContext, useEffect } from 'react';
import { Input, Form, DatePicker } from 'antd';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

import { Input as CustomInput, Select, SelectGroup } from 'src/components/Common';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  info,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  disabled,
  ...restProps
}) => {

  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  const infoValue = info ? info : { type: 'string', required: true };

  useEffect(() => {
    if (info && (info.inputType === 'select' || info.inputType === 'select-group')) {
      //
    } else {
      if (editing) {
        inputRef.current.focus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    let recordInfo = record[dataIndex];
    if (info.type === 'dateTime') recordInfo = moment(recordInfo);
    form.setFieldsValue({
      [dataIndex]: recordInfo,
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Lưu thất bại:', errInfo);
    }
  };

  /**
   * Hiển thị input
   *
   * @param {*} type
   * @returns
   */
  const renderInput = (type, inputType) => {
    switch (type) {
      case 'string':
        if (inputType === 'select') {
          return <Select
            autoClearSearchValue
            data={info.list}
            showSearch
            optionsvalue={info.options}
            placeholder={info.placeholder}
            style={{ width: '100%' }}
            value={record[dataIndex]}
            onChange={save}
            disabled={disabled}
          />
        }
        if (inputType === 'select-group') {
          return (
            <SelectGroup
              autoClearSearchValue
              data={info.list}
              optionsvalue={info.options}
              style={{ width: '100%', height: '100%', color: 'white' }}
              showSearch
              optionFilterProp="children"
              onChange={save}
              value={record[dataIndex]}
              label={info.label}
              childListKey={info.childListKey}
              disabled={disabled}
            />
          )
        }
        return <Input ref={inputRef} onPressEnter={save} onBlur={save} disabled={disabled} />
      case 'number':
        return <CustomInput refcallback={inputRef} type="numberVN" onBlur={save} onPressEnter={save} disabled={disabled} />
      case 'dateTime':
        return (
          <DatePicker
            ref={inputRef}
            format="DD/MM/YYYY"
            showTime={false}
            placeholder="Chọn ngày..."
            onChange={save}
            disabled={disabled}
          />
        )
      default:
        return <Input ref={inputRef} onPressEnter={save} onBlur={save} />
    }
  }

  let childNode = children;
  const toogleAction = disabled ? {} : { onClick: toggleEdit };
  if (editable) {
    let type = infoValue.type;
    if (infoValue.type === 'dateTime') type = 'object';
    let rules = {
      rules: [
        { required: infoValue.required,
          message: `${title} là bắt buộc.`,
        },
        { type }
      ]
    };
    if (!isEmpty(infoValue.rules)) {
      rules = {
        rules: infoValue.rules
      }
    }
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        {...rules}
      >
        {renderInput(infoValue.type, infoValue.inputType)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        {...toogleAction}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default {
  EditableRow,
  EditableCell
}
