import { LOAD_THONG_BAO } from "constants/ActionTypes";

export function loadThongBao(value) {
  return {
    type: LOAD_THONG_BAO,
    payload: value
  }
}
