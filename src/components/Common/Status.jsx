import React from 'react';
import { Tooltip } from 'antd';
import { variables } from 'src/constants/variables';

const showTooltip = (data) => {
  let icon = '';
  switch (data.ma) {
    case variables.VBDEN_TRANG_THAI_ICON.TRE_HAN:
      icon = 'icon-trehan color-required size24';
      break;
    case variables.VBDEN_TRANG_THAI_ICON.GAN_TRE_HAN:
      icon = 'icon-gantrehan color-orange size24';
      break;
    case variables.VBDEN_TRANG_THAI_ICON.CHUYEN_TRUC_TIEP_LANH_DAO:
      icon = 'icon-chuyen-truc-tiep color-primary';
      break;
    case variables.VBDEN_TRANG_THAI_ICON.BAO_NHAM:
      icon = 'icon-baonham color-required';
      break;
    case variables.VBDEN_TRANG_THAI_ICON.YEU_CAU_LAY_LAI:
      icon = 'icon-yeu-cau-lay-lai color-required';
      break;
    case variables.VBDEN_TRANG_THAI_ICON.XU_LY_CHINH:
      icon = 'icon-xu-ly-chinh color-primary';
      break;
    case variables.VBDEN_TRANG_THAI_ICON.XU_LY_PHU:
      icon = 'icon-file';
      break;
    default:
      icon = '';
  }
  return icon;
};

export default function status(data = {}) {
  return (
    <React.Fragment>
      { data && data.trangThai.map((item, i) => (
        <Tooltip key={i} placement="bottom" title={item.moTa}>
          <span className={`mt5 mb5 inline-block size18 ${showTooltip(item)}`} />
        </Tooltip>
      ))}
    </React.Fragment>
  );
}

status.displayName = 'Status';
