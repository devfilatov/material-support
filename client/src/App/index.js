import { useState, useEffect } from "react";
import { useStore } from "@umbrellio/observable";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Cookie from "./lib/cookie";
import Request from "./lib/request";
import CommonStore from "./store/common";
import UsersStore from "./store/users";
import { PrivateRoute, Loader } from "./components";
import Home from "./pages/home";
import Login from "./pages/login";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const history = useHistory();
  const { token, loading } = useStore(CommonStore);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const savedToken = Cookie.get("token");
    CommonStore.set({ token: savedToken });
  }, []);

  useEffect(() => {
    if (!token) return null;
    CommonStore.set({ loading: true });
    Cookie.set("token", token);
    Request.get("users/self")
      .then(({ user }) => {
        UsersStore.set({ current: user });
        setAuthed(true);
        history.push("/home");
      })
      .catch((err) => toast.warn(err.message))
      .finally(() => CommonStore.set({ loading: false }));
  }, [token]);

  return (
    <div className="app-container">
      <Switch>
        <PrivateRoute exact available={authed} path="/home" component={Home} />
        <Route exact path="/login" component={Login} />
        <Redirect to="/home" />
      </Switch>
      {loading && <Loader />}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
