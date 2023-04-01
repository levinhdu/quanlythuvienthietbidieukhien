import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";
import Auth from "helpers/Auth";

const ThietBi = asyncComponent(() => import("./ThietBi/ThietBi"));
const ThietBiForm = asyncComponent(() => import("./ThietBi/ThietBiForm"));
const TimThietBi = asyncComponent(() => import("./TimThietBi/TimThietBi"));
const XuatFileIn = asyncComponent(() => import("./XuatFileIn/XuatFileIn"));

const App = ({ match, location, menus, permission }) => {
  const { pathname } = location;
  return (
    <Switch>
      <Route
        path={`${match.url}/thiet-bi`}
        exact
        component={Auth(ThietBi, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/thiet-bi/them-moi`}
        exact
        component={Auth(ThietBiForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/thiet-bi/:id/chinh-sua`}
        exact
        component={Auth(ThietBiForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/tim-thiet-bi`}
        exact
        component={Auth(TimThietBi, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/xuat-file-in`}
        exact
        component={Auth(XuatFileIn, menus, pathname, permission)}
      />
    </Switch>
  );
};

export default App;
