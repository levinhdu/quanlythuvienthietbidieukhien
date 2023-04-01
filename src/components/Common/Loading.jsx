import React from 'react';
import {
  Skeleton,
  Table,
  Spin
} from 'antd';
import PropTypes from 'prop-types';

const header = [
  {
    key: 'key1',
    title: <Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />,
    width: '5%',
    align: 'left',
    render: function renderHeader() {
      return <Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />;
    }
  },
  {
    key: 'key2',
    title: <Skeleton active paragraph={{ rows: 1 }} title={false} />,
    width: '25%',
    align: 'left',
    render: function renderHeader() {
      return <Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />;
    }
  },
  {
    key: 'key3',
    title: <Skeleton active paragraph={{ rows: 1 }} title={false} />,
    width: '45%',
    align: 'left',
    render: function renderHeader() {
      return <Skeleton active paragraph={{ rows: 3 }} title={false} />;
    }
  },
  {
    key: 'key4',
    title: <Skeleton active paragraph={{ rows: 1 }} title={false} />,
    width: '15%',
    align: 'left',
    render: function renderHeader() {
      return <Skeleton active paragraph={{ rows: 1 }} title={false} />;
    }
  },
  {
    key: 'key5',
    title: <Skeleton active paragraph={{ rows: 1 }} title={false} />,
    width: '10%',
    align: 'left',
    render: function renderHeader() {
      return <Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />;
    }
  }
];

export default function Loading(props) {
  const { type, showHeader } = props;
  const tableColumns = () => {
    if (!props.header) {
      return header;
    }
    const tableHeader = props.header.map((value) => {
      const newValue = {
        ...value,
        render: function renderData() {
          if (value.key && value.key === 'trichYeu') {
            return (<Skeleton active paragraph={{ rows: 3 }} title={false} />);
          }
          return (<Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />);
        }
      };
      return newValue;
    });
    return tableHeader;
  };

  return (
    <div className={`${props.className}`} style={{ background: '#fff', marginBottom: '10px' }}>
      {
        !type && (
          <Skeleton
            active
            className="p20"
            {...props}
          />
        )
      }
      {
        type === 'table' && (
          <Table
            bordered
            className="table-wrapper-custom"
            columns={tableColumns()}
            dataSource={[{ key: 0 }, { key: 1 }]}
            pagination={false}
            showHeader={showHeader}
            size="middle"
          />
        )}
      {
        type === 'container' && (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        )
      }
    </div>
  );
}

Loading.propTypes = {
  header: PropTypes.any,
  type: PropTypes.string,
  className: PropTypes.string,
  showHeader: PropTypes.bool
};

Loading.defaultProps = {
  header: null,
  type: '',
  className: '',
  showHeader: true
};
