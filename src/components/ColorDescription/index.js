import React from 'react';
import { Badge } from 'antd';
import map from 'lodash/map';

export const colors = [
  { color: "blue", text: "Nghỉ chế độ" },
  { color: "cyan", text: "Không báo cơm" },
  { color: "geekblue", text: "Hỗ trợ" },
  { color: "gold", text: "Điều chuyển quá hạn" },
  { color: "red", text: "Thiếu đơn vị trả lương" },
];

function ColorDescription() {
  /*
    * * --- renderColorDescription ---
    * isNghiCheDo = true | text: Nghỉ chế độ | color: blue
    * isKhongBaoCom = true | text: Không báo cơm | color: cyan
    * isHoTro = true | text: Hỗ trợ | color: geekblue
    * isChuaXacNhanDieuChuyen = true | text: Điều chuyển quá hạn | color: gold
    * isLoi = true missing donViTraLuong | text: Thiếu đơn vị trả lương | color: green
  */
  return (
    <>
      {map(colors, color => {
        return (<Badge key={color.color} color={color.color} text={color.text} />)
      })}
    </>
  )

}

export default ColorDescription;
