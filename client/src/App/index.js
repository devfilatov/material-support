import { useState, useEffect } from "react";
import { useStore } from "@umbrellio/observable";
import { ToastContainer, toast } from "react-toastify";

import Cookie from "./lib/cookie";
import Request from "./lib/request";
import CommonStore from "./store/common";
import UsersStore from "./store/users";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Home from "./pages/home";
import Login from "./pages/login";

const App = () => {
  const { token, loading } = useStore(CommonStore);
  const { current: currentUser } = useStore(UsersStore);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const savedToken = Cookie.get("token");
    CommonStore.set({ token: savedToken });
  }, []);

  useEffect(() => {
    setAuthed(false);
    if (token) {
      CommonStore.set({ loading: true });
      Cookie.set("token", token);
      Request.get("users/self")
        .then(({ user }) => {
          UsersStore.set({ current: user });
          setAuthed(true);
        })
        .catch((err) => toast.warn(err.message))
        .finally(() => CommonStore.set({ loading: false }));
    } else {
      Cookie.delete("token");
    }
  }, [token]);

  const renderContent = () => {
    const content = currentUser && authed ? <Home /> : <Login />;
    return <div className="d-flex flex-grow-1 justify-content-center p-5">{content}</div>;
  };

  return (
    <div className="app-container bg-main">
      <Header />
      {renderContent()}
      {loading && <Loader />}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
