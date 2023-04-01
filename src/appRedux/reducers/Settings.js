import { SWITCH_LANGUAGE } from "constants/ActionTypes";
import {
  LAYOUT_TYPE,
  LAYOUT_TYPE_FULL,
  NAV_STYLE,
  NAV_STYLE_FIXED,
  THEME_TYPE,
  THEME_TYPE_LITE,
  THEME_COLOR
} from "src/constants/ThemeSetting";
import { getLocalStorage, setLocalStorage } from 'src/util/Common';

// Get localstorage theme config
const localAppConfig = getLocalStorage('app-theme');
let initialSettings = {};
if (localAppConfig) {
  initialSettings = localAppConfig;
} else {
  initialSettings = {
    navStyle: NAV_STYLE_FIXED,
    layoutType: LAYOUT_TYPE_FULL,
    themeType: THEME_TYPE_LITE,
    themeColor: 'dark_blue',

    isDirectionRTL: false,
    locale: {
      languageId: 'vietnam',
      locale: 'vi',
      name: 'Tiếng Việt',
      icon: 'vn'
    }
  };
  setLocalStorage('app-theme', initialSettings);
}

const applySettingValue = (key, val) => {
  let newValue = initialSettings;
  newValue[key] = val;
  setLocalStorage('app-theme', newValue);
}

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case THEME_TYPE:
      applySettingValue('themeType', action.themeType);
      return {
        ...state,
        themeType: action.themeType
      };

    case THEME_COLOR:
      applySettingValue('themeColor', action.themeColor);
      return {
        ...state,
        themeColor: action.themeColor
      };

    case NAV_STYLE:
      applySettingValue('navStyle', action.navStyle);
      return {
        ...state,
        navStyle: action.navStyle
      };
    case LAYOUT_TYPE:
      applySettingValue('layoutType', action.layoutType);
      return {
        ...state,
        layoutType: action.layoutType
      };

    case SWITCH_LANGUAGE:
      return {
        ...state,
        locale: action.payload
      };
    default:
      return state;
  }
};

export default settings;
