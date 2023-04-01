import React from "react";
import PropTypes from 'prop-types';
import {InfoCircleOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import {Tooltip} from "antd";
import {useSelector} from "react-redux";

const ContainerHeader = ({title, description, buttons, back}) => {
  const {themeColor} = useSelector(({settings}) => settings);

  const renderTitle = description ?
    <div style={{display: 'inherit'}}>
      {back && <ArrowLeftOutlined onClick={back} style={{marginTop: 5, fontSize: 16, marginRight: 10}}/>}
      <h2 className="gx-page-title" style={{marginRight: 10}}>{title}</h2>
      <Tooltip title={description} color={themeColor} placement="bottomLeft">
        <InfoCircleOutlined/>
      </Tooltip>
    </div>
    :
    <div style={{display: 'inherit'}}>
      {back && <ArrowLeftOutlined onClick={back} style={{marginTop: 5, fontSize: 16, marginRight: 10}}/>}
      <h2 className="gx-page-title">{title}</h2>
    </div>

  return (
    <div className="gx-page-heading" style={{marginBottom: 20}}>
      <div style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between', position: 'relative'}}>
        {renderTitle}
        {buttons &&
        <div style={{display: 'inline-block', position: 'absolute', bottom: 0, right: 0}}>
          {buttons}
        </div>
        }
      </div>
    </div>
  )
};

ContainerHeader.defaultProps = {
  title: '',
  description: ''
}

ContainerHeader.propTypes = {
  // title: PropTypes.oneOf(['string', 'element']),
  description: PropTypes.string,
  buttons: PropTypes.element,
  back: PropTypes.func
}

export default ContainerHeader;

