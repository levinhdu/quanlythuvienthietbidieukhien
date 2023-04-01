import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Row,
  Col
} from 'antd';
import { ContainerHeading } from 'src/components/Common';

export default function container(props) {
  return (
    <React.Fragment>
      {props.heading
        ? <ContainerHeading {...props} />
        : (
          <React.Fragment>
            <Row className="container-heading md-flex-column" type="flex">
              <Col
                className="th-heading-page d-flex"
                style={{ paddingRight: '20px' }}
              >
                {props.goBack && (
                  <span
                    className="icon-arrow-left btn-goback mr10"
                    onClick={props.goBack.onClick}
                    style={{ marginBottom: 5, marginRight: 5 }}
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
            </Row>
          </React.Fragment>
        )
      }
      <div className={classnames(`content-wrapper ${props.containerClass}`)}>
        {props.children && props.children}
      </div>
    </React.Fragment>
  );
}

container.propTypes = {
  children: PropTypes.node,
  containerClass: PropTypes.string,
  goBack: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  className: PropTypes.string,
  heading: PropTypes.objectOf(PropTypes.any)
};
container.defaultProps = {
  children: '',
  containerClass: '',
  goBack: undefined,
  title: '',
  className: '',
  heading: undefined
};

container.displayName = 'Container';
