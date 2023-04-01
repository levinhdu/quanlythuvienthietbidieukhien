import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Settings from "./Settings";
import Auth from "./Auth";
import Common from './Common';
import Menu from './Menu';
import Notification from './Notification';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  settings: Settings,
  auth: Auth,
  common: Common,
  menus: Menu,
  notification: Notification
});

export default createRootReducer;
