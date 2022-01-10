import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

import { MS_TYPES } from "../lib/helper";

const MsForm = ({ materialSupport = {}, onSubmit, onClose, ...props }) => {
  const [data, setData] = useState(materialSupport);

  useEffect(() => setData(materialSupport), [materialSupport]);

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit(data);
    onClose();
  };

  return (
    <Form style={{ width: "350px" }} {...props}>
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Control
          as="select"
          placeholder="Select type"
          value={data.type}
          onChange={(e) => setData({ ...data, type: e.target.value })}
        >
          {Object.keys(MS_TYPES).map((key) => (
            <option key={key} value={key}>
              {MS_TYPES[key]}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter amount"
          value={data.amount || ""}
          onChange={(e) => setData({ ...data, amount: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Approval status</Form.Label>
        <Form.Control
          as="select"
          placeholder="Select approval status"
          value={data.approvalStatus}
          onChange={(e) => setData({ ...data, approvalStatus: e.target.value })}
        >
          <option value={true}>true</option>
          <option value={false}>false</option>
        </Form.Control>
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

export default MsForm;
