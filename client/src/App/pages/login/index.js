import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import Request from "../../lib/request";
import CommonStore from "../../store/common";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();
    CommonStore.set({ loading: true });
    Request.post("auth", { email, password })
      .then(({ token }) => CommonStore.set({ token }))
      .catch((err) => toast.warn(err.message))
      .finally(() => CommonStore.set({ loading: false }));
  };

  return (
    <Form className="align-self-center" style={{ width: "350px" }}>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="w-100" onClick={submitHandler}>
        Submit
      </Button>
    </Form>
  );
};

export default Login;
