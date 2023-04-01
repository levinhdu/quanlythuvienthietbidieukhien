async function printElement(printValue) {
  const printData = JSON.parse(printValue);
  let pageTotal = 1;
  if (printData.length > 8) {
    pageTotal = _.ceil(printData.length / 8);
  }

  let renderHTML = '';
  let startItem = 0;
  let numToShow = 8;
  for (let i = 0; i < pageTotal; i++) {
    startItem = numToShow * i;
    renderHTML += `
      <div class="grid-container">
    `;

    for (let j = startItem; j < startItem + numToShow; j++) {
      if (printData[j]) {
        // console.log(printData[j], '---------------');
        renderHTML += `<div class="slot-${i}">`;
        renderHTML += `<div>`;
        renderHTML += `<table style="width: 100%;">`;
        renderHTML += `<caption><strong>THẺ KANBAN SẢN XUẤT</strong></caption>`;
        renderHTML += `
              <tr>
                <td class="th-print-normal-color">1</td>
                <td class="th-print-normal-color-underline">STT phôi NMT:</td>
                <td class="th-print-normal">${printData[j].stt}</td>
                <td class="th-print-normal-color">KH</td>
                <td class="th-print-normal">${printData[j].tenKhachHang}</td>
                <td class="th-print-normal-color">Ban hành</td>
                <td>${printData[j].ngayBanHanh}</td>
              </tr>
        `;
        renderHTML += `
              <tr>
                <td class="th-print-normal-color">2</td>
                <td class="th-print-normal-color-underline">LSX Cơ Khí:</td>
                <td colspan="4" class="th-print-normal-9px">${printData[j].lsX_CoKhi}</td>
                <td class="th-print-normal-9px" style="background-color: #FEF2CB;">Lsx Thép</td>
              </tr>
        `;
        renderHTML += `
              <tr>
                <td class="th-print-normal-color">3</td>
                <td class="th-print-normal-color-left">Mã chi tiết: </td>
                <td colspan="2" class="th-print-normal-10px">${printData[j].maVatTu}</td>
                <td class="th-print-normal-color">Vật liệu</td>
                <td class="th-print-normal-10px">${printData[j].vatLieu}</td>
                <td class="th-print-normal-10px">${printData[j].maLenhSanXuat}</td>
              </tr>
        `;
        renderHTML += `
              <tr>
                <td class="th-print-normal-color">4</td>
                <td class="th-print-normal-color-left">Số lượng:</td>
                <td class="th-print-normal-9px">${printData[j].sldh}</td>
                <td colspan="2" class="th-print-normal-color">Ngày Thép HT</td>
                <td>${printData[j].ngayHoanThanh}</td>
                <td class="th-print-normal-9px">STT TRẠM</td>
              </tr>
        `;
        renderHTML += `
              <tr>
                <td class="th-print-normal-color">5</td>
                <td class="th-print-normal-color-left">Tên chi tiết:</td>
                <td colspan="4" class="th-print-normal-10px">${printData[j].tenVatTu}</td>
                <td class="th-print-normal-10px">${printData[j].stT_Tram}</td>
              </tr>
        `;
        renderHTML += `
            <tr>
              <td rowspan="2" class="th-print-normal-color">6</td>
              <td rowspan="2" class="th-print-normal-color-left">Quy cách chi tiết:</td>
              <td class="th-print-normal-color">Dài</td>
              <td class="th-print-normal-color">Rộng</td>
              <td class="th-print-normal-color">Dày</td>
              <td class="th-print-normal-color">Dn</td>
              <td class="th-print-normal-color">Dt</td>
            </tr>
        `;
        renderHTML += `
            <tr>
              <td class="th-print-normal-9px">${printData[j].dai}</td>
              <td class="th-print-normal-9px">${printData[j].rong}</td>
              <td class="th-print-normal-9px">${printData[j].day}</td>
              <td class="th-print-normal-9px">${printData[j].dn}</td>
              <td class="th-print-normal-9px">${printData[j].dt}</td>
            </tr>
        `;
        renderHTML += `
            <tr style="height: 30px;">
              <td class="th-print-normal-color">7</td>
              <td class="th-print-normal-color-left">Ghi chú: </td>
              <td colspan="5" class="th-print-normal">${printData[j].ghiChu}</td>
            </tr>
            <tr>
              <td class="th-print-normal-color">STT</td>
              <td class="th-print-normal-color-left">Công đoạn</td>
              <td class="th-print-normal-color">KS XTT</td>
              <td class="th-print-normal-color">KS XCN</td>
              <td class="th-print-normal-color">KS XTH</td>
              <td class="th-print-normal-color">KS XGCCK</td>
              <td class="th-print-normal-color">KS VCNB</td>
            </tr>
        `;
        const { lst_CongDoans } = printData[j];
        renderHTML += `
            <tr>
              <td class="th-print-normal-color">1</td>
              <td class="th-print-normal-left">${!_.isEmpty(lst_CongDoans) && !_.isEmpty(lst_CongDoans[0]) ? lst_CongDoans[0].tenCongDoan : ' '}</td>
              <td rowspan="4"></td>
              <td rowspan="4"></td>
              <td rowspan="4"></td>
              <td rowspan="4"></td>
              <td rowspan="4"></td>
            </tr>
        `;

        renderHTML += `
            <tr>
              <td class="th-print-normal-color">2</td>
              <td class="th-print-normal-left">${!_.isEmpty(lst_CongDoans) && !_.isEmpty(lst_CongDoans[1]) ? lst_CongDoans[1].tenCongDoan : ' '}</td>
            </tr>
        `;

        renderHTML += `
            <tr>
              <td class="th-print-normal-color">3</td>
              <td class="th-print-normal-left">${!_.isEmpty(lst_CongDoans) && !_.isEmpty(lst_CongDoans[2]) ? lst_CongDoans[2].tenCongDoan : ' '}</td>
            </tr>
        `;

        renderHTML += `
            <tr>
              <td class="th-print-normal-color">4</td>
              <td class="th-print-normal-left">${!_.isEmpty(lst_CongDoans) && !_.isEmpty(lst_CongDoans[3]) ? lst_CongDoans[3].tenCongDoan : ' '}</td>
            </tr>
        `;

        renderHTML += `
            <tr>
              <td class="th-print-normal-color">5</td>
              <td class="th-print-normal-left">${!_.isEmpty(lst_CongDoans) && !_.isEmpty(lst_CongDoans[4]) ? lst_CongDoans[4].tenCongDoan : ' '}</td>
              <td class="th-print-normal-color">QA CHECK</td>
              <td class="th-print-normal-color">QA CHECK</td>
              <td class="th-print-normal-color">QA CHECK</td>
              <td class="th-print-normal-color">QA FINAL</td>
              <td rowspan="5">
                <img src="${printData[j].pngImage}" alt="QR Image" width="50px">
              </td>
            </tr>
        `;

        renderHTML += `
            <tr>
              <td class="th-print-normal-color">6</td>
              <td class="th-print-normal-left">${!_.isEmpty(lst_CongDoans) && !_.isEmpty(lst_CongDoans[5]) ? lst_CongDoans[5].tenCongDoan : ' '}</td>
              <td rowspan="4"></td>
              <td rowspan="4"></td>
              <td rowspan="4"></td>
              <td rowspan="4"></td>
            </tr>
        `;

        renderHTML += `
            <tr>
              <td class="th-print-normal-color">7</td>
              <td class="th-print-normal-left">${!_.isEmpty(lst_CongDoans) && !_.isEmpty(lst_CongDoans[6]) ? lst_CongDoans[6].tenCongDoan : ' '}</td>
            </tr>
        `;

        renderHTML += `
            <tr>
              <td class="th-print-normal-color">8</td>
              <td class="th-print-normal-left">${!_.isEmpty(lst_CongDoans) && !_.isEmpty(lst_CongDoans[7]) ? lst_CongDoans[7].tenCongDoan : ' '}</td>
            </tr>
        `;

        renderHTML += `
            <tr>
              <td class="th-print-normal-color">9</td>
              <td class="th-print-normal-left">${!_.isEmpty(lst_CongDoans) && !_.isEmpty(lst_CongDoans[8]) ? lst_CongDoans[8].tenCongDoan : ' '}</td>
            </tr>
        `;

        renderHTML += `</table>`;
        renderHTML += `</div>`;
        renderHTML += `</div>`;
      }
    }
    renderHTML += `
      </div>
    `;
    // if(i === pageTotal - 1) {
    //   renderHTML += `<span style="page-break-after: always;"></span>`;
    // }
  }

  let qrWrapper = $('.print');
  qrWrapper.append(renderHTML);
  window.print();
  window.onafterprint = function () {
    window.close();
  }
}

document.onreadystatechange = function () {
  if (_) {
    var printValue = window.localStorage.getItem('inTemValue');
    if (!_.isEmpty(printValue)) {
      printElement(printValue);
    }
  } else {
    alert('Lỗi không thể tải thư viện. Vui lòng kiểm tra kết nối mạng.');
  }
};