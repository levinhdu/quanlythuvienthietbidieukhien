import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col
} from 'antd';
export default function container(props) {
  return (
    <Fragment>
      <Row type="flex">
        <Col className="th-heading-page">
          <h3 className="th-heading-form">
            <span>{props.title}</span>
          </h3>
        </Col>
      </Row>
      <div className="content-wrapper">
        {props.children && props.children}
      </div>
    </Fragment>
  );
}

container.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};
container.defaultProps = {
  children: '',
  title: '',
};

container.displayName = 'ContainerHeader';
