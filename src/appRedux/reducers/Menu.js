import {
  LOAD_MENU,
  LOAD_MENU_SUCCESS,
  LOAD_MENU_FAIL
} from "src/constants/ActionTypes";
import { logOut } from "src/util/Common";

const INIT_STATE = {
  loading: false,
  menus: [],
  error: false
};


export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case LOAD_MENU: {
      return {
        ...state,
        loading: true
      }
    }

    case LOAD_MENU_SUCCESS: {
      if (action.status === 401) {
        logOut();
      }
      return {
        ...state,
        menus: action.data,
        loading: false,
        error: false
      }
    }

    case LOAD_MENU_FAIL: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    default:
      return state;
  }
}
