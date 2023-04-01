import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";
import Auth from "src/helpers/Auth";

const NguoiDung = asyncComponent(() => import("./NguoiDung/NguoiDung"));
const NguoiDungForm = asyncComponent(() => import("./NguoiDung/NguoiDungForm"));
const Quyen = asyncComponent(() => import("./Quyen/Quyen"));
const ChucNang = asyncComponent(() => import("./ChucNang/ChucNang"));
const ChucNangForm = asyncComponent(() => import("./ChucNang/ChucNangForm"));
const VaiTro = asyncComponent(() => import("./VaiTro/VaiTro"));
const VaiTroForm = asyncComponent(() => import("./VaiTro/VaiTroForm"));
const PhanQuyenDonVi = asyncComponent(() =>
  import("./PhanQuyenDonVi/PhanQuyenDonVi")
);
const PhanQuyenDiaDiemAn = asyncComponent(() =>
  import("./PhanQuyenDiaDiemAn/PhanQuyenDiaDiemAn")
);
const PhanHoi = asyncComponent(() => import("./PhanHoi/PhanHoi"));

const Log = asyncComponent(() => import("./Log/Log"));

const App = ({ match, location, menus, permission }) => {
  const { pathname } = location;
  return (
    <Switch>
      <Route
        path={`${match.url}/nguoi-dung`}
        exact
        component={Auth(NguoiDung, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/nguoi-dung/them-moi`}
        exact
        component={Auth(NguoiDungForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/nguoi-dung/:id/chinh-sua`}
        exact
        component={Auth(NguoiDungForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/chuc-nang`}
        exact
        component={Auth(ChucNang, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/chuc-nang/them-moi`}
        exact
        component={Auth(ChucNangForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/chuc-nang/:id/chinh-sua`}
        exact
        component={Auth(ChucNangForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/vai-tro`}
        exact
        component={Auth(VaiTro, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/vai-tro/them-moi`}
        exact
        component={Auth(VaiTroForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/vai-tro/:id/chinh-sua`}
        exact
        component={Auth(VaiTroForm, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/vai-tro/:id/phan-quyen`}
        exact
        component={Auth(Quyen, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/phan-quyen-don-vi`}
        exact
        component={Auth(PhanQuyenDonVi, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/phan-quyen-dia-diem-an`}
        exact
        component={Auth(PhanQuyenDiaDiemAn, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/log`}
        exact
        component={Auth(Log, menus, pathname, permission)}
      />
      <Route
        path={`${match.url}/phan-hoi`}
        exact
        component={Auth(PhanHoi, menus, pathname, permission)}
      />
    </Switch>
  );
};

export default App;
