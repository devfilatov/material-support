import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import moment from "moment";

import { ROLES } from "../lib/helper";

const UserForm = ({ user = {}, onSubmit, onClose, ...props }) => {
  const [data, setData] = useState(user);

  useEffect(() => setData(user), [user]);

  const submitHandler = (e) => {
    e.preventDefault();
    const { password, ...otherData } = data;
    if (password) onSubmit(data);
    else onSubmit(otherData);
    onClose();
  };

  return (
    <Form style={{ width: "350px" }} {...props}>
      <Form.Group className="mb-3">
        <Form.Label>Full name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter full name"
          value={data.fullName || ""}
          onChange={(e) => setData({ ...data, fullName: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={data.email || ""}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Birthdate</Form.Label>
        <Form.Control
          type="date"
          placeholder="Enter birthdate"
          value={data.birthdate ? moment(data.birthdate).format("YYYY-MM-DD") : ""}
          onChange={(e) => setData({ ...data, birthdate: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Role</Form.Label>
        <Form.Control
          as="select"
          placeholder="Select role"
          value={data.role}
          onChange={(e) => setData({ ...data, role: e.target.value })}
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Group</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter group"
          value={data.group || ""}
          onChange={(e) => setData({ ...data, group: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Course</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter course"
          value={data.course || ""}
          onChange={(e) => setData({ ...data, course: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Group leader</Form.Label>
        <Form.Control
          as="select"
          placeholder="Select role"
          value={data.isGroupLeader}
          onChange={(e) => setData({ ...data, isGroupLeader: e.target.value })}
        >
          <option value={true}>yes</option>
          <option value={false}>no</option>
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>New password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter new password"
          value={data.password || ""}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button variant="primary" type="button" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" className="ms-3" onClick={submitHandler}>
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;
