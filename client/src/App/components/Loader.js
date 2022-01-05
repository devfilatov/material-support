import { Spinner } from "react-bootstrap";

const Loader = () => (
  <div className="app-loader">
    <Spinner animation="border" role="status" />
    <span className="ms-3 fs-3">Loading...</span>
  </div>
);

export default Loader;
