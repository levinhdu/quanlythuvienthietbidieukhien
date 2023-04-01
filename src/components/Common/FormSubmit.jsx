import React from 'react';
import { Row, Col, Button, Divider } from 'antd';
import { RollbackOutlined, SaveOutlined } from '@ant-design/icons';

const FormSubmit = ({ goBack, saveAndClose, disabled, handleSave, loading }) => {
  return (
    <>
      <Divider />
      <Row style={{ marginTop: 20 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          {goBack &&
            <Button className="th-btn-margin-bottom-0" icon={<RollbackOutlined />} onClick={goBack}>
              Quay lại
          </Button>
          }
          {handleSave ?
            <Button disabled={!disabled} className="th-btn-margin-bottom-0" type="primary"
              onClick={() => saveAndClose('false')}
              icon={<SaveOutlined />}
              loading={loading}
              >
              Lưu
            </Button>
            :
            <Button disabled={!disabled} className="th-btn-margin-bottom-0" type="primary" htmlType={'submit'}
              icon={<SaveOutlined />}
              loading={loading}
              >
              Lưu
            </Button>
          }
          {saveAndClose &&
            <Button disabled={!disabled} className="th-btn-margin-bottom-0" icon={<SaveOutlined />} onClick={() => saveAndClose(true)}>
              Lưu và thoát
            </Button>
          }
        </Col>
      </Row>
    </>
  )
}

FormSubmit.defaultProps = {
  loading: false,
}

export default FormSubmit;
