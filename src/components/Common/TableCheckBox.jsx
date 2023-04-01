import React, { PureComponent } from 'react';
import {
  Radio,
  Checkbox,
  Table
} from 'src/components/common';

const data2 = [
  {
    key: 11111,
    name: 'UBND Thành phố Tam Kỳ',
    children: [
      {
        key: 111111,
        name: 'UBND Thành phố Hội An',
        children: [
          {
            key: 11111111,
            name: 'Văn phòng UBND Thành phố Hội An'
          },
          {
            key: 111111112,
            name: 'Phòng VH&TT Thành phố Hội An'
          }
        ]
      },
      {
        key: 1111111112,
        name: 'Sở Thể thao du lịch',
        children: [
          {
            key: 1111111121,
            name: 'Phạm Hồng Quảng (Giám đốc)'
          }
        ]
      },
      {
        key: 1111111113,
        name: 'Sở Kế hoạch đầu tư',
        children: [
          {
            key: 131111111,
            name: 'Phạm Hồng Quảng (Giám đốc)',
            children: [
              {
                key: 1311111111,
                name: 'Phạm Hồng Quảng (Giám đốc)'
              },
              {
                key: 1311111111112,
                name: 'Phạm Thị Ngọc Duyên (Phó Giám đốc)'
              }
            ]
          }
        ]
      }
    ]
  }
];

const data = [
  {
    key: 1,
    name: 'Sở Thông tin và Truyền thông',
    children: [
      {
        key: 11,
        name: 'Ban giám đốc',
        children: [
          {
            key: 111,
            name: 'Phạm Hồng Quảng (Giám đốc)'
          },
          {
            key: 112,
            name: 'Phạm Thị Ngọc Duyên (Phó Giám đốc)'
          }
        ]
      },
      {
        key: 12,
        name: 'Văn Phòng sở',
        children: [
          {
            key: 121,
            name: 'Phạm Hồng Quảng (Giám đốc)'
          }
        ]
      },
      {
        key: 13,
        name: 'Phòng CNTT',
        children: [
          {
            key: 131,
            name: 'Phạm Hồng Quảng (Giám đốc)',
            children: [
              {
                key: 1311,
                name: 'Phạm Hồng Quảng (Giám đốc)'
              },
              {
                key: 1312,
                name: 'Phạm Thị Ngọc Duyên (Phó Giám đốc)'
              }
            ]
          }
        ]
      }
    ]
  }
];

export default class TableCheckBox extends PureComponent {
  state = {
    chuTri: '',
    giamSat: [],
    phoiHop: [],
    xemDeBiet: []
  }

  chuTri = (e) => {
    let { giamSat, phoiHop, xemDeBiet } = this.state;
    giamSat = giamSat.filter(item => item !== e.target.value);
    phoiHop = phoiHop.filter(item => item !== e.target.value);
    xemDeBiet = xemDeBiet.filter(item => item !== e.target.value);

    this.setState({
      giamSat,
      phoiHop,
      xemDeBiet,
      chuTri: e.target.value
    });
  }

  giamSat = (e) => {
    let { giamSat, phoiHop, xemDeBiet } = this.state;
    if (e.target.checked) {
      giamSat = [
        ...giamSat,
        e.target.value
      ];
      phoiHop = phoiHop.filter(item => item !== e.target.value);
      xemDeBiet = xemDeBiet.filter(item => item !== e.target.value);
    } else {
      giamSat = giamSat.filter(item => item !== e.target.value);
    }
    this.setState({ giamSat, phoiHop, xemDeBiet });
  }

  phoiHop = (e) => {
    let { giamSat, phoiHop, xemDeBiet } = this.state;
    if (e.target.checked) {
      phoiHop = [
        ...phoiHop,
        e.target.value
      ];
      giamSat = giamSat.filter(item => item !== e.target.value);
      xemDeBiet = xemDeBiet.filter(item => item !== e.target.value);
    } else {
      phoiHop = phoiHop.filter(item => item !== e.target.value);
    }
    this.setState({ phoiHop, xemDeBiet, giamSat });
  }

  xemDeBiet = (e) => {
    let { giamSat, phoiHop, xemDeBiet } = this.state;
    if (e.target.checked) {
      xemDeBiet = [
        ...xemDeBiet,
        e.target.value
      ];
      phoiHop = phoiHop.filter(item => item !== e.target.value);
      giamSat = giamSat.filter(item => item !== e.target.value);
    } else {
      xemDeBiet = xemDeBiet.filter(item => item !== e.target.value);
    }
    this.setState({ xemDeBiet, giamSat, phoiHop });
  }

  columns = props => ([
    {
      title: (
        <span className="typography typography-14 color-primary ">
          <span className={props.icon} />
          {' '}
          {props.name}
        </span>
      ),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Chủ trì',
      key: 'chuTri',
      width: '150px',
      align: 'center',
      render: record => (
        <Radio
          checked={record.key === this.state.chuTri}
          onChange={this.chuTri}
          value={record.key}
        />
      )
    },
    {
      title: 'Giám sát',
      width: '150px',
      key: 'giamSat',
      align: 'center',
      render: record => (
        <Checkbox
          checked={this.state.giamSat.indexOf(record.key) > -1}
          disabled={record.key === this.state.chuTri}
          onChange={this.giamSat}
          value={record.key}
        />
      )
    },
    {
      title: 'Phối hợp',
      width: '150px',
      key: 'phoiHop',
      align: 'center',
      render: record => (
        <Checkbox
          checked={this.state.phoiHop.indexOf(record.key) > -1}
          disabled={record.key === this.state.chuTri}
          onChange={this.phoiHop}
          value={record.key}
        />
      )
    },
    {
      title: 'Xem để biết',
      width: '150px',
      key: 'xemDeBiet',
      align: 'center',
      render: record => (
        <Checkbox
          checked={this.state.xemDeBiet.indexOf(record.key) > -1}
          disabled={record.key === this.state.chuTri}
          onChange={this.xemDeBiet}
          value={record.key}
        />
      )
    }
  ]);

  columns2 = props => [
    {
      title: (
        <span className="typography typography-14 color-primary ">
          <span className={props.icon} />
          {' '}
          {props.name}
        </span>
      ),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Chủ trì',
      key: 'chuTri',
      width: '150px',
      align: 'center',
      render: (record) => {
        if (!record.children) {
          return (
            <Radio
              checked={record.key === this.state.chuTri}
              onChange={this.chuTri}
              value={record.key}
            />
          );
        }
        return null;
      }
    },
    {
      title: 'Giám sát',
      width: '150px',
      key: 'giamSat',
      align: 'center',
      render: (record) => {
        if (!record.children) {
          return (
            <Checkbox
              checked={this.state.giamSat.indexOf(record.key) > -1}
              disabled={record.key === this.state.chuTri}
              onChange={this.giamSat}
              value={record.key}
            />
          );
        }
        return null;
      }
    },
    {
      title: 'Phối hợp',
      width: '150px',
      key: 'phoiHop',
      align: 'center',
      render: (record) => {
        if (!record.children) {
          return (
            <Checkbox
              checked={this.state.phoiHop.indexOf(record.key) > -1}
              disabled={record.key === this.state.chuTri}
              onChange={this.phoiHop}
              value={record.key}
            />
          );
        }
        return null;
      }
    },
    {
      title: 'Xem để biết',
      width: '150px',
      key: 'xemDeBiet',
      align: 'center',
      render: (record) => {
        if (!record.children) {
          return (
            <Checkbox
              checked={this.state.xemDeBiet.indexOf(record.key) > -1}
              disabled={record.key === this.state.chuTri}
              onChange={this.xemDeBiet}
              value={record.key}
            />
          );
        }
        return null;
      }
    }
  ];

  render() {
    return (
      <div>
        <div className="border-table">
          <Table
            className="table-item"
            columns={this.columns({ icon: 'icon-followers', name: 'Danh sách người nhận' })}
            dataSource={data}
            pagination={false}
            size="middle"
          />
          <Table
            className="table-item"
            columns={this.columns({ icon: 'icon-classroom', name: 'Danh sách đơn vị nhận (Ngoài cơ quan)' })}
            dataSource={data2}
            pagination={false}
            size="middle"
          />
        </div>
        <br />
        <div className="border-table">
          <Table
            className="table-item"
            columns={this.columns2({ icon: 'icon-followers', name: 'Danh sách người nhận' })}
            dataSource={data}
            defaultExpandAllRows
            pagination={false}
            size="middle"
          />
          <Table
            className="table-item"
            columns={this.columns2({ icon: 'icon-classroom', name: 'Danh sách đơn vị nhận (Ngoài cơ quan)' })}
            dataSource={data2}
            defaultExpandAllRows
            pagination={false}
            size="middle"
          />
        </div>
      </div>
    );
  }
}
