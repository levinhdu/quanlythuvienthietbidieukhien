import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col
} from 'antd';

export default function ContainerHeading(props) {
  return (
    <Row className="container-heading md-flex-column" type="flex">
      <Col
        className="heading-page d-flex max-width-360 md-full"
        style={{ paddingRight: '20px' }}
      >
        {props.goBack && (
          <span
            className="icon-arrow-left btn-goback mr10"
            onClick={props.goBack.onClick}
          />
        )}
        {props.title && (
          <h3 className={`heading ${props.className || ''}`}>
            <span>
              {props.title}
            </span>
          </h3>
        )}
      </Col>
      <Col className="md-full" style={{ marginLeft: 'auto', flex: '1 0', flexWrap: 'nowrap' }}>
        {props && props.heading}
      </Col>
    </Row>
  );
}

ContainerHeading.propTypes = {
  className: PropTypes.string,
  heading: PropTypes.objectOf(PropTypes.any),
  goBack: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string
};

ContainerHeading.defaultProps = {
  className: '',
  heading: undefined,
  goBack: undefined,
  title: ''
};
