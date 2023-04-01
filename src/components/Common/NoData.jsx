import React from 'react';
import { messages } from 'src/constants/messages';
import PropTypes from 'prop-types';

export default function noData(props) {
  return (
    <div className={`content-notfound ${props.className}`}>
      <div className="center-block">
        <img alt={props.message} className="bg-notdata" src={`${process.env.PUBLIC_URL}/search.png`} />
        <h3 className={`${props.headingClassName}`}>{props.message}</h3>
      </div>
    </div>
  );
}

noData.propTypes = {
  className: PropTypes.string,
  headingClassName: PropTypes.string,
  message: PropTypes.string
};

noData.defaultProps = {
  className: '',
  headingClassName: 'heading',
  message: messages.KHONG_CO_DU_LIEU
};

noData.displayName = 'NoData';
