import { Fragment } from "react";
import { useStore } from "@umbrellio/observable";
import { Navbar, Button } from "react-bootstrap";

import Helper from "../lib/helper";
import UsersStore from "../store/users";

const Header = () => {
  const { current: currentUser } = useStore(UsersStore);

  const renderUserInfo = () => {
    const { fullName, role } = currentUser;
    const textInfo = `${fullName} [${role}]`;
    return (
      <Fragment>
        <Navbar.Text className="me-3">{textInfo}</Navbar.Text>
        <Button size="sm" variant="outline-light" onClick={Helper.logoutHandler}>
          Logout
        </Button>
      </Fragment>
    );
  };

  return (
    <Navbar bg="dark" variant="dark" className="ps-5 pe-5">
      <Navbar.Brand className="me-auto user-select-none">
        <img
          alt="logo"
          src="/eservice.png"
          width="30"
          height="30"
          className="d-inline-block align-top me-3"
        />
        Electronic services 2.0
      </Navbar.Brand>
      {currentUser && renderUserInfo()}
    </Navbar>
  );
};

export default Header;
