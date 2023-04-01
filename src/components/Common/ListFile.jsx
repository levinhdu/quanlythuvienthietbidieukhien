import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helpers from 'src/helpers';
import { variables } from 'src/constants/variables';
import classnames from 'classnames';
import {
  isEmpty,
  isArray,
  isFunction,
  sortBy
} from 'lodash';
import { Paragraph } from 'src/components/common';
import { Tooltip } from 'antd';

export default class ListFile extends PureComponent {
  /**
   * Download và _blank link file
   * @param {*} data param
   * @returns {func} download page or _blank page
   * @memberof ListFile
   */
  downLoad = data => (e) => {
    e.stopPropagation();
    if (isFunction(this.props.onDownLoad)) {
      return this.props.onDownLoad(data);
    }
    if (data === 'stop') {
      return true;
    }
    return Helpers.download(data);
  }

  render() {
    const {
      data,
      summary,
      startFileIndex,
      midFileIndex,
      horizontal
    } = this.props;
    const newData = sortBy(data, e => !e.laVanBanChinh);
    return (
      <React.Fragment>
        {!isEmpty(summary) && (
          <Paragraph lineHeight={this.props.lineHeight} noiDung={summary} rows={this.props.rows} />
        )}
        {/* Hiển thị [props.midFileIndex] file bắt đầu từ [props.startFileIndex] */}
        {isArray(newData) && newData.slice(
          startFileIndex,
          midFileIndex
        ).map((file, i) => (
          <div
            key={file.id || i}
            className={classnames('data-file-item', {
              'data-file-horizontal': horizontal
            })}
            onClick={this.downLoad(file)}
          >
            <span
              className={`detail ${Helpers.viewTypeFile({ type: Helpers.getFileType(file) })} ml5`}
            >
              {file.tenFile}
            </span>
          </div>
        ))}
        {/* Hiển thị các file còn lại bắt đầu từ [props.midFileIndex] */}
        {isArray(newData) && newData.slice(
          midFileIndex,
          newData.length
        ).length > 0 && (
          <Tooltip
            className="tooltip-file"
            onClick={this.downLoad('stop')}
            overlayClassName="tooltip-list-file"
            placement="bottom"
            title={
              newData.slice(
                midFileIndex,
                newData.length
              ).map((file, i) => (
                <div
                  key={file.id || (i + midFileIndex)}
                  className="data-file-item"
                  onClick={this.downLoad(file)}
                >
                  <span
                    className={`detail ${Helpers.viewTypeFile({ type: Helpers.getFileType(file) })} ml5`}
                  >
                    {file.tenFile}
                  </span>
                </div>
              ))
            }
          >
            <span className="icon-dots icon-cpc" />
          </Tooltip>
        )}
      </React.Fragment>
    );
  }
}

ListFile.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  summary: PropTypes.string,
  startFileIndex: PropTypes.number,
  midFileIndex: PropTypes.number,
  onDownLoad: PropTypes.func,
  rows: PropTypes.number,
  lineHeight: PropTypes.number,
  horizontal: PropTypes.bool
};

ListFile.defaultProps = {
  data: [],
  summary: '',
  rows: 3,
  lineHeight: 18,
  startFileIndex: variables.DEFAULT_VALUE.START_FILE_INDEX,
  midFileIndex: variables.DEFAULT_VALUE.MID_FILE_INDEX,
  onDownLoad: null,
  horizontal: false
};
