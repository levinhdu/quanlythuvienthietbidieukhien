import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

export default class popover extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  contentPopover = () => (
    <div className="popover-confirm">
      {(typeof this.props.dieuKien === 'undefined' || this.props.dieuKien) && this.props.ganDonViCon && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.ganDonViCon.func();
          }}
          role="presentation"
        >
          <span className="icon-gan-don-vi icon-cpc" />
          <span className="action-name">{this.props.ganDonViCon.name}</span>
        </p>
      )}
      {this.props.chinhSua && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.chinhSua.func();
          }}
          role="presentation"
        >
          <span className="icon-edit icon-cpc" />
          <span className="action-name">{this.props.chinhSua.name}</span>
        </p>
      )}
      {this.props.chuyenXuly && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.chuyenXuly.func();
          }}
          role="presentation"
        >
          <span className="icon-chuyen-xu-ly icon-cpc" />
          <span className="action-name">{this.props.chuyenXuly.name}</span>
        </p>
      )}
      {this.props.tiepNhan && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.tiepNhan.func();
          }}
          role="presentation"
        >
          <span className="icon-tiep-nhan icon-cpc" />
          <span className="action-name">{this.props.tiepNhan.name}</span>
        </p>
      )}
      {this.props.baoNham && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.baoNham.func();
          }}
          role="presentation"
        >
          <span className="icon-baonham icon-cpc" />
          <span className="action-name">{this.props.baoNham.name}</span>
        </p>
      )}
      {this.props.huyBaoNham && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.huyBaoNham.func();
          }}
          role="presentation"
        >
          <span className="icon-baonham icon-cpc" />
          <span className="action-name">{this.props.huyBaoNham.name}</span>
        </p>
      )}
      {this.props.luuThamKhao && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.luuThamKhao.func();
          }}
          role="presentation"
        >
          <span className="icon-diskette icon-cpc" />
          <span className="action-name">{this.props.luuThamKhao.name}</span>
        </p>
      )}
      {this.props.traLoi && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.traLoi.func();
          }}
          role="presentation"
        >
          <span className="icon-traloi icon-cpc" />
          <span className="action-name">{this.props.traLoi.name}</span>
        </p>
      )}
      {this.props.traLoiTatCa && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.traLoiTatCa.func();
          }}
          role="presentation"
        >
          <span className="icon-tra-loi-tat-ca icon-cpc" />
          <span className="action-name">{this.props.traLoiTatCa.name}</span>
        </p>
      )}
      {this.props.chuyenTiep && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.chuyenTiep.func();
          }}
          role="presentation"
        >
          <span className="icon-chuyen-tiep icon-cpc" />
          <span className="action-name">{this.props.chuyenTiep.name}</span>
        </p>
      )}
      {this.props.xoa && !this.props.xoa.isCheck && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.xoa.func();
          }}
          role="presentation"
        >
          <span className="icon-xoa icon-cpc" />
          <span className="action-name">{this.props.xoa.name}</span>
        </p>
      )}
      {this.props.chuyenXuLyLai && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.chuyenXuLyLai.func();
          }}
          role="presentation"
        >
          <span className="icon-reply-all icon-cpc" />
          <span className="action-name">{this.props.chuyenXuLyLai.name}</span>
        </p>
      )}
      {this.props.them && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.them.func();
          }}
          role="presentation"
        >
          <span className="icon-plus1 icon-cpc" />
          <span className="action-name">{this.props.them.name}</span>
        </p>
      )}
      {this.props.dongYThuHoi && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.dongYThuHoi.func();
          }}
          role="presentation"
        >
          <span className="icon-check icon-cpc" />
          <span className="action-name">{this.props.dongYThuHoi.name}</span>
        </p>
      )}
      {this.props.tuChoiBaoNham && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.tuChoiBaoNham.func();
          }}
          role="presentation"
        >
          <span className="icon-warning icon-cpc" />
          <span className="action-name">{this.props.tuChoiBaoNham.name}</span>
        </p>
      )}
      {this.props.traLai && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.traLai.func();
          }}
          role="presentation"
        >
          <span className="icon-return icon-cpc" />
          <span className="action-name">{this.props.traLai.name}</span>
        </p>
      )}
      {this.props.huyTraLai && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.huyTraLai.func();
          }}
          role="presentation"
        >
          <span className="icon-close icon-cpc" />
          <span className="action-name">{this.props.huyTraLai.name}</span>
        </p>
      )}
      {this.props.xuLy && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.xuLy.func();
          }}
          role="presentation"
        >
          <span className="icon-right-alignment icon-cpc" />
          <span className="action-name">{this.props.xuLy.name}</span>
        </p>
      )}
      {this.props.tuChoi && (
        <p
          className="item"
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ visible: false });
            this.props.tuChoi.func();
          }}
          role="presentation"
        >
          <span className="icon-tu-choi icon-cpc" />
          <span className="action-name">{this.props.tuChoi.name}</span>
        </p>
      )}
    </div>
  )

  handleChangeVisible = (value) => {
    this.setState({ visible: value });
  }

  render() {
    return (
      <Popover
        className="popover-table"
        content={this.contentPopover()}
        onClick={e => e.stopPropagation()}
        onVisibleChange={this.handleChangeVisible}
        placement="bottom"
        trigger="hover"
        visible={this.state.visible}
      >
        <span className="icon-action icon-cpc" />
      </Popover>
    );
  }
}

popover.propTypes = {
  chinhSua: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  chuyenXuLy: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  xoa: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func,
    isCheck: PropTypes.bool
  }),
  chuyenXuLyLai: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  tuChoiBaoNham: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  them: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  traLai: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  huyTraLai: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  ganDonViCon: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  xuLy: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  tuChoi: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  chuyenXuly: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  tiepNhan: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  baoNham: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  huyBaoNham: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  luuThamKhao: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  traLoi: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  traLoiTatCa: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  chuyenTiep: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  dongYThuHoi: PropTypes.shape({
    name: PropTypes.string,
    func: PropTypes.func
  }),
  dieuKien: PropTypes.any
};

popover.defaultProps = {
  chinhSua: null,
  chuyenXuLy: null,
  xoa: null,
  chuyenXuLyLai: null,
  tuChoiBaoNham: null,
  them: null,
  traLai: null,
  huyTraLai: null,
  ganDonViCon: null,
  xuLy: null,
  tuChoi: null,
  chuyenXuly: null,
  tiepNhan: null,
  baoNham: null,
  huyBaoNham: null,
  luuThamKhao: null,
  traLoi: null,
  traLoiTatCa: null,
  chuyenTiep: null,
  dongYThuHoi: null,
  dieuKien: null
};
