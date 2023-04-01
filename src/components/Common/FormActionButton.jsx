import React from 'react';
import { Col } from 'antd';
import { Icon } from '@ant-design/compatible';
import Button from './Button';

export default (props) => {
  const { handleSubmit, goBack, loading, saveAndQuit, disabled } = props;
  return (
    <Col className='footer-form' span={24}>
      {goBack &&
      <Button
        className='btn-back mr10'
        onClick={goBack}
      >
        <div className='content-btn'>
          <span className='icon-back' />
          <span className='name'><Icon type="left" /> Quay lại</span>
        </div>
      </Button>
      }
      { handleSubmit &&
      <Button
        className='btn-save'
        type='primary submit'
        onClick={handleSubmit}
        loading={loading}
        disabled={disabled}
      >
        <div className='content-btn'>
          <span className='icon-diskette' />
          <span className='name'><Icon type="save" /> Lưu</span>
        </div>
      </Button>
      }
      {saveAndQuit &&
        <Button
          className='btn-save'
          type='default submit'
          onClick={saveAndQuit}
          loading={loading}
          disabled={disabled}
        >
          <div className='content-btn'>
            <span className='icon-diskette' />
            <span className='name'><Icon type="save" /> Lưu và thoát</span>
          </div>
        </Button>
      }
    </Col>
  )
}
