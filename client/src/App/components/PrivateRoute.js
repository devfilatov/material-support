import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, available, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      available === true ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default PrivateRoute;
