import { LOAD_THONG_BAO } from "constants/ActionTypes";

let initialSettings = {
  value: {},
};

const notifications = (state = initialSettings, action) => {
  switch (action.type) {
    case LOAD_THONG_BAO:
      return {
        ...state,
        value: action.payload
      };
    default:
      return state;
  }
};

export default notifications;
