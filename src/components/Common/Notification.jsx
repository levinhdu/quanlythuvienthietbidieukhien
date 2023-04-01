import { notification } from 'antd';
import PropTypes from 'prop-types';

export default function notifi(props) {
  return notification.open({ duration: 2, ...props });
}

notifi.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

notifi.displayName = 'Notifi';
