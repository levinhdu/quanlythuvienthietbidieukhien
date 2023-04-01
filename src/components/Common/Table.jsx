import React from 'react';
import { Table as TableAnt } from 'antd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export default function Table(props) {
  const { themeColor } = useSelector(({ settings }) => settings);
  return (
    // <TableAnt
    //   {...props}
    //   className={`${props.className} th-${themeType === 'THEME_TYPE_DARK' ? 'blue' : themeColor}-head`}
    // />
    <TableAnt
      {...props}
      className={`${props.className} th-${themeColor}-head`}
    />
  );
}

Table.propTypes = {
  isError: PropTypes.bool,
  loading: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  pagination: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]).isRequired,
  rowSelection: PropTypes.objectOf(PropTypes.any),
  onRow: PropTypes.func,
  components: PropTypes.objectOf(PropTypes.any),
  size: PropTypes.string,
  showHeader: PropTypes.bool
};

Table.defaultProps = {
  isError: false,
  loading: false,
  className: '',
  rowSelection: undefined,
  onRow: undefined,
  components: undefined,
  size: '',
  showHeader: true,
  dataSource: []
};

Table.displayName = 'Table';
