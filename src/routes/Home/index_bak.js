import React, { Component } from 'react';
import { Card, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

import { BASE_URL_APP } from 'src/constants/Config';

class Home extends Component {

  /**
   * Tải tài liệu
   *
   * @memberof Home
   */
  downloadDocument = (path) => {
    const url = BASE_URL_APP + path;
    window.open(url);
  }

  /**
   * Hiển thị danh sách tài liệu
   *
   * @memberof Home
   */
  renderDocumentList = () => {
    return (
      <>
        <span style={{ marginRight: 20 }}><strong>Tài liệu hướng dẫn</strong></span>
        <Button
          className="th-margin-bottom-0"
          onClick={() => this.downloadDocument('/files/HDSD-QLMH.pdf')}
          type="primary"
          icon={<CopyOutlined />}
        >
          Tài liệu hướng dẫn
        </Button>
      </>
    )
  }

  render() {
    return (
      <Card
        title={`Trang chủ`}
        // extra={this.renderDocumentList()}
      >
        <p>Đang xây dựng nội dung</p>
      </Card>
    )
  }
}


export default Home
