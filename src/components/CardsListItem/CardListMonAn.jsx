import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'antd';
import map from 'lodash/map';
import ShowMoreText from "react-show-more-text";

function CardListMonAn({ data, styleName, onSelectItem, buttons }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const executeOnClick = () => {
    setIsExpanded(!isExpanded);
  };

  const { id, title, description, subDescription, imgThumb } = data;
  return (
    <Col xs={24} md={12}>
      <div className={`gx-user-list ${styleName}`} style={{ position: 'relative' }}>
        {map(buttons, (btn, index) => {
          return (
            <div key={index} onClick={() => onSelectItem(id)} className="th-mouseover" style={{ position: 'absolute', top: 35, right: 35 }}>
              {btn.content}
            </div>
          )
        })}
        <img alt="..." src={imgThumb} className="gx-smart-img gx-border-0" style={{ marginBottom: 10 }} />
        <div>
          <div className="gx-flex-row">
            <h4>{title}</h4>
            <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
            <span>{subDescription} VNĐ</span>
          </div>
          <p className="gx-text-grey gx-mb-2">{description ?
            <ShowMoreText
              /* Default options */
              lines={1}
              more="Xem thêm"
              less="Ẩn"
              className="content-css"
              anchorClass="my-anchor-css-class"
              onClick={executeOnClick}
              expanded={isExpanded}
              width={280}
              truncatedEndingComponent={"... "}
            >
              {description}
            </ShowMoreText> : 'Không có mô tả'}</p>
        </div>
      </div>
    </Col>
  )
}

CardListMonAn.defaultProps = {
  data: {
    styleName: 'gx-card-list',
  }
}

CardListMonAn.propTypes = {
  styleName: PropTypes.string,
  data: PropTypes.objectOf({
    name: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    description: PropTypes.string,
    subDescription: PropTypes.string,
    buttons: PropTypes.arrayOf({
      title: PropTypes.string,
      type: PropTypes.string
    })
  })
}

export default CardListMonAn
