import { useState, useEffect } from "react";
import { useStore } from "@umbrellio/observable";
import { Accordion } from "react-bootstrap";
import { toast } from "react-toastify";

import Request from "../../../lib/request";
import CommonStore from "../../../store/common";
import UsersStore from "../../../store/users";
import MsTable from "../../../components/MsTable";
import UserTable from "../../../components/UserTable";

const StudentModule = () => {
  const { current: currentUser } = useStore(UsersStore);
  const [materialSupport, setMaterialSupport] = useState(null);

  useEffect(() => {
    CommonStore.set({ loading: true });
    Request.get("ms/self")
      .then((res) => setMaterialSupport(res.materialSupport))
      .catch((err) => toast.warn(err.message))
      .finally(() => CommonStore.set({ loading: false }));
  }, []);

  const renderMaterialSupport = () => {
    if (!materialSupport) {
      return null;
    }
    if (Object.keys(materialSupport).length === 0) {
      return <div className="fs-3 text-center">No material support records</div>;
    }
    return (
      <Accordion>
        {Object.keys(materialSupport).map((key, index) => (
          <Accordion.Item key={key} eventKey={index}>
            <Accordion.Header>{key}</Accordion.Header>
            <Accordion.Body>
              <MsTable rows={materialSupport[key]} />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="align-self-start" style={{ width: "60vw" }}>
      <UserTable rows={[currentUser]} className="mb-5" />
      {renderMaterialSupport()}
    </div>
  );
};

export default StudentModule;
