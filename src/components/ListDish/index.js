import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Tooltip } from 'antd';
import map from 'lodash/map';
import { BASE_URL_STORAGE } from 'src/constants/Config';
import { numberLocalConvert } from 'src/util/Common';

function ListDish({ data, onClick, disabled }) {
  console.log('disabled', disabled);
  return (
    <div className="gx-pt-2">
      <ul className="gx-menu-list gx-mb-0">
        {map(data, dish => {
          const { monAn_Id, tenMonAn, moTa, gia, thumb_File_Url, isSelected } = dish;
          const action = disabled ? {} : { onClick: () => onClick(dish) };
          const cssVal = disabled ? { style: { background: '-webkit-linear-gradient(top, rgb(242 242 246 / 90%), rgb(10 10 10 / 95%)' } } : {};
          return (
            <li key={monAn_Id} className="gx-mb-2" {...action}>
              <Tooltip title={moTa} placement="topLeft">
                <div className="gx-user-fnd">
                  <img alt="..." style={{ objectFit: 'cover', height: 150 }} src={`${BASE_URL_STORAGE}/${thumb_File_Url}`} />
                  <div className="gx-user-fnd-content" {...cssVal}>
                    <Badge color={!disabled && isSelected ? 'green' : 'gray'} />
                    <div>
                      <p style={{
                        background: 'green',
                        padding: 5,
                        borderRadius: 3
                      }}>{tenMonAn}</p>
                    </div>
                    <h6 style={{ fontSize: 14 }}>
                      <span style={{
                        backgroundColor: 'green',
                        padding: 5,
                        borderRadius: 3,
                        display: 'inline-block'
                      }}>{numberLocalConvert(gia)} vnđ</span></h6>
                  </div>
                </div>
              </Tooltip>
            </li>
            // <li>
            //   Keyone
            // </li>
          );
        })}
      </ul>
    </div>
  )
}

ListDish.propTypes = {
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
}

export default ListDish