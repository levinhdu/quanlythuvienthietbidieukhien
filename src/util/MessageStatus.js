import { isString } from 'lodash';
import Helper from 'src/helpers';
import { messages } from 'src/constants/Messages';
import { removeCookieValue } from 'src/util/Common';

export default (status, message = '') => {
  switch (status) {
    case 400:
      if(isString(message)) {
        return Helper.alertError(message);
      }
      return Helper.alertError(messages.TRUNG_DU_LIEU);
    case 401:
      setTimeout(()=>{
        removeCookieValue('tokenInfo');
      },3000);
      return Helper.alertError(messages.HET_PHIEN_LAM_VIEC);
    case 404:
      return Helper.alertError(messages.DICH_VU_KO_TON_TAI);
    case 409:
      if(isString(message)) {
        return Helper.alertError(message);
      }
      return Helper.alertError(messages.NOI_DUNG_TRUNG_LAP);
    case 417:
      return Helper.alertError(messages.DU_LIEU_KO_TON_TAI);
    case 500:
      return Helper.alertError(messages.LOI_HE_THONG);
    case 504:
      return Helper.alertError(messages.KHONG_PHAN_HOI);
    default:
      break;
  }
}
