import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";
import Auth from "helpers/Auth";

const DonVi = asyncComponent(() => import("./DonVi/DonVi"));
const DonViForm = asyncComponent(() => import("./DonVi/DonViForm"));
const Loai = asyncComponent(() => import("./Loai/Loai"));
const LoaiForm = asyncComponent(() => import("./Loai/LoaiForm"));
const Nhom = asyncComponent(() => import("./Nhom/Nhom"));
const NhomForm = asyncComponent(() => import("./Nhom/NhomForm"));
const Hang = asyncComponent(() => import("./Hang/Hang"));
const HangForm = asyncComponent(() => import("./Hang/HangForm"));
const DonViTinh = asyncComponent(() => import("./DonViTinh/DonViTinh"));
const DonViTinhForm = asyncComponent(() => import("./DonViTinh/DonViTinhForm"));
const ImportThietBi = asyncComponent(() =>
  import("./ImportThietBi/ImportThietBi")
);

const App = ({ match, location, menus, permission }) => {
  const { pathname } = location;
  return (
    <Switch>
      <Route
        path={`${match.url}/don-vi`}
        exact
        component={Auth(DonVi, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi/them-moi`}
        exact
        component={Auth(DonViForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi/:id/chinh-sua`}
        exact
        component={Auth(DonViForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/loai`}
        exact
        component={Auth(Loai, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/loai/them-moi`}
        exact
        component={Auth(LoaiForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/loai/:id/chinh-sua`}
        exact
        component={Auth(LoaiForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/nhom`}
        exact
        component={Auth(Nhom, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/nhom/them-moi`}
        exact
        component={Auth(NhomForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/nhom/:id/chinh-sua`}
        exact
        component={Auth(NhomForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/hang`}
        exact
        component={Auth(Hang, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/hang/them-moi`}
        exact
        component={Auth(HangForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/hang/:id/chinh-sua`}
        exact
        component={Auth(HangForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi-tinh`}
        exact
        component={Auth(DonViTinh, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi-tinh/them-moi`}
        exact
        component={Auth(DonViTinhForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/don-vi-tinh/:id/chinh-sua`}
        exact
        component={Auth(DonViTinhForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/import-thiet-bi`}
        exact
        component={Auth(ImportThietBi, menus, pathname, permission)}
      />
    </Switch>
  );
};

export default App;
