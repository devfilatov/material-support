import { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import { toast } from "react-toastify";

import Request from "../../../lib/request";
import Helper from "../../../lib/helper";
import CommonStore from "../../../store/common";
import MsTable from "../../../components/MsTable";

const ManagerModule = () => {
  const [materialSupport, setMaterialSupport] = useState(null);

  useEffect(() => {
    CommonStore.set({ loading: true });
    Request.get("ms/all")
      .then((res) => setMaterialSupport(res.materialSupport))
      .catch((err) => toast.warn(err.message))
      .finally(() => CommonStore.set({ loading: false }));
  }, []);

  const calculateTotalAmount = (key) => {
    const totalAmount = materialSupport[key]?.reduce((acc, cur) => {
      const curAmount = parseFloat(cur.amount) || 0;
      return acc + curAmount;
    }, 0);
    return Helper.formatAmount(totalAmount);
  };

  const renderMaterialSupport = () => {
    if (!materialSupport) return null;
    if (Object.keys(materialSupport).length === 0) {
      return <div className="fs-3 text-center">No material support records</div>;
    }
    return (
      <Accordion>
        {Object.keys(materialSupport).map((key, index) => (
          <Accordion.Item key={key} eventKey={index}>
            <Accordion.Header>{key}</Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <span className="me-2">Total amount:</span>
                <span>{calculateTotalAmount(key)}</span>
              </div>
              <MsTable rows={materialSupport[key]} />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="align-self-start" style={{ width: "60vw" }}>
      {renderMaterialSupport()}
    </div>
  );
};

export default ManagerModule;
