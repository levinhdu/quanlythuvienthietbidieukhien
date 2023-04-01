import React from 'react';
import { messages } from 'src/constants/messages';
import PropTypes from 'prop-types';

export default function systemError(props) {
  return (
    <div className={`content-notfound ${props.className}`}>
      <div className="center-block">
        <img alt={props.message} className="bg-notdata" src={`${process.env.PUBLIC_URL}/error.png`} />
        <h3 className={`${props.headingClassName}`}>{props.message}</h3>
      </div>
    </div>
  );
}

systemError.propTypes = {
  className: PropTypes.string,
  headingClassName: PropTypes.string,
  message: PropTypes.string
};

systemError.defaultProps = {
  className: '',
  headingClassName: 'heading',
  message: messages.LOI_HE_THONG
};

systemError.displayName = 'SystemError';
