import { useState, useRef, Fragment } from "react";
import { Form, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import Request from "../lib/request";
import Helper, { MS_TYPES } from "../lib/helper";
import CommonStore from "../store/common";

const Calculator = ({ onSave }) => {
  const fileInputRef = useRef(null);
  const [data, setData] = useState(null);
  const [fond, setFond] = useState(0);

  const hasData = () => {
    return data && data.length > 0;
  };

  const clearData = () => {
    fileInputRef.current.value = null;
    setData(null);
    setFond(0);
  };

  const saveData = () => {
    CommonStore.set({ loading: true });
    Request.post("calc/save", data)
      .then(() => {
        clearData();
        onSave();
      })
      .catch((err) => {
        toast.warn(err.message);
        CommonStore.set({ loading: false });
      });
  };

  const toFloat = (value) => {
    return parseFloat(value) || 0;
  };

  const calculate = () => {
    let entries = data.slice();
    const entriesNumber = entries.length;
    const fondAmount = toFloat(fond);
    const aEntries = entries.filter((i) => i.type === "a" && i.approvalStatus);
    const bEntries = entries.filter((i) => i.type === "b" && i.approvalStatus);
    const cEntries = entries.filter((i) => i.type === "c" && i.approvalStatus);
    const dEntries = entries.filter((i) => i.type === "d" && i.approvalStatus);
    let fixedAmount = entries.reduce((acc, cur) => acc + toFloat(cur.amount), 0);
    let xa = Math.trunc(fondAmount / entriesNumber);
    let y = fondAmount - xa * aEntries.length - fixedAmount;
    let x = y / (bEntries.length + 2.875 * cEntries.length + 5.75 * dEntries.length);
    let xb = bEntries.length > 0 ? Math.trunc(x) : 0;
    let xc = cEntries.length > 0 ? Math.trunc(2.875 * x) : 0;
    let xd = dEntries.length > 0 ? Math.trunc(5.75 * x) : 0;
    cEntries
      .filter((i) => i.treatmentAmount && i.treatmentAmount / 0.85 < xc)
      .forEach((wrongEntry) => {
        const amount = Math.ceil(wrongEntry.treatmentAmount / 0.85);
        const cIndex = cEntries.findIndex((i) => i.id === wrongEntry.id);
        entries = entries.map((entry) => {
          if (entry.id !== wrongEntry.id) return entry;
          return { ...entry, amount: toFloat(entry.amount) + amount, approvalStatus: false };
        });
        cEntries.splice(cIndex, 1);
        fixedAmount = fixedAmount + amount;
        y = y - amount;
        x = y / (bEntries.length + 2.875 * cEntries.length + 5.75 * dEntries.length);
        xb = bEntries.length > 0 ? Math.trunc(x) : 0;
        xc = cEntries.length > 0 ? Math.trunc(2.875 * x) : 0;
        xd = dEntries.length > 0 ? Math.trunc(5.75 * x) : 0;
      });
    y = y - xb * bEntries.length - xc * cEntries.length - xd * dEntries.length;
    if (y >= aEntries.length && aEntries.length > 0) {
      const value = Math.trunc(y / aEntries.length);
      xa = xa + value;
      y = y - value;
    }
    if (y >= bEntries.length && bEntries.length > 0) {
      const value = Math.trunc(y / bEntries.length);
      xb = xb + value;
      y = y - value;
    }
    if (y >= cEntries.length && cEntries.length > 0) {
      const value = Math.trunc(y / cEntries.length);
      xc = xc + value;
      y = y - value;
    }
    if (y >= dEntries.length && dEntries.length > 0) {
      const value = Math.trunc(y / dEntries.length);
      xd = xd + value;
      y = y - value;
    }
    entries = entries.map((entry) => {
      if (aEntries.find((i) => i.id === entry.id)) {
        return { ...entry, amount: toFloat(entry.amount) + xa };
      }
      if (bEntries.find((i) => i.id === entry.id)) {
        return { ...entry, amount: toFloat(entry.amount) + xb };
      }
      if (cEntries.find((i) => i.id === entry.id)) {
        return { ...entry, amount: toFloat(entry.amount) + xc };
      }
      if (dEntries.find((i) => i.id === entry.id)) {
        return { ...entry, amount: toFloat(entry.amount) + xd };
      }
      return entry;
    });
    setData(entries);
    setFond(y);
  };

  const readFile = (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = await Helper.parseCsv(e.target.result);
      const formatted = result.map((item) => ({
        ...item,
        birthdate: item.birthdate ? moment(item.birthdate, "DD.MM.YYYY").toString() : null,
        isGroupLeader: item.isGroupLeader === "true",
        approvalStatus: item.approvalStatus === "true",
        amount: 0,
        id: uuidv4(),
      }));
      setData(formatted);
    };
    reader.onerror = (err) => {
      toast.warn(err.message);
      setData(null);
    };
    const [file] = e.target.files;
    reader.readAsText(file);
  };

  const setField = (itemIndex, key, value) => {
    const newData = data.map((item, index) => {
      return itemIndex === index ? { ...item, [key]: value } : item;
    });
    setData(newData);
  };

  const renderFileInput = () => (
    <Form.Control
      className="mb-3"
      type="file"
      accept="text/csv"
      ref={fileInputRef}
      onChange={readFile}
    />
  );

  const renderData = () => (
    <Table striped bordered>
      <thead>
        <tr>
          <th>№</th>
          <th>Full name</th>
          <th>Email</th>
          <th>Birthdate</th>
          <th>Group</th>
          <th>Course</th>
          <th>Group leader</th>
          <th>Type</th>
          <th>Treatment amount</th>
          <th>Approval status</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.fullName}</td>
            <td>{item.email}</td>
            <td>{Helper.formatDate(item.birthdate)}</td>
            <td>{item.group}</td>
            <td>{item.course}</td>
            <td>{item.isGroupLeader ? "yes" : "no"}</td>
            <td>{MS_TYPES[item.type]}</td>
            <td>{Helper.formatAmount(item.treatmentAmount)}</td>
            <td>
              <Form.Check
                type="checkbox"
                className="d-flex justify-content-center"
                checked={item.approvalStatus}
                onChange={(e) => setField(index, "approvalStatus", e.target.checked)}
              />
            </td>
            <td>
              <Form.Control
                size="sm"
                type="number"
                placeholder="Enter amount"
                value={item.amount || ""}
                onChange={(e) => setField(index, "amount", e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderMenu = () => (
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <Form.Control
          type="number"
          placeholder="Enter fond"
          value={fond || ""}
          onChange={(e) => setFond(e.target.value)}
        />
      </div>
      <div className="d-flex align-items-center">
        <Button variant="outline-dark" className="ms-3" onClick={clearData}>
          Clear
        </Button>
        <Button variant="outline-dark" className="ms-3" onClick={calculate}>
          Calculate
        </Button>
        <Button variant="outline-dark" className="ms-3" onClick={saveData}>
          Save
        </Button>
      </div>
    </div>
  );

  return (
    <Fragment>
      {renderFileInput()}
      {hasData() && renderData()}
      {hasData() && renderMenu()}
    </Fragment>
  );
};

export default Calculator;
