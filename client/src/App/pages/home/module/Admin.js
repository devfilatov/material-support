import { useState, useEffect } from "react";
import { Accordion, Nav, Tab } from "react-bootstrap";
import { toast } from "react-toastify";

import Helper from "../../../lib/helper";
import Request from "../../../lib/request";
import CommonStore from "../../../store/common";
import MsTable from "../../../components/MsTable";
import UserTable from "../../../components/UserTable";
import MsForm from "../../../components/MsForm";
import UserForm from "../../../components/UserForm";
import Calculator from "../../../components/Calculator";

const AdminModule = () => {
  const [users, setUsers] = useState(null);
  const [materialSupport, setMaterialSupport] = useState(null);
  const [editing, setEditing] = useState(null);
  const [timeStamp, setTimeStamp] = useState(Date.now());

  useEffect(() => {
    CommonStore.set({ loading: true });
    Promise.all([Request.get("users/all"), Request.get("ms/all")])
      .then(([res1, res2]) => {
        setUsers(res1.users);
        setMaterialSupport(res2.materialSupport);
      })
      .catch((err) => toast.warn(err.message))
      .finally(() => CommonStore.set({ loading: false }));
  }, [timeStamp]);

  const updateData = () => {
    const newTimeStamp = Date.now();
    setTimeStamp(newTimeStamp);
  };

  const changeUser = (user) => {
    CommonStore.set({ loading: true });
    const { _id, ...userData } = user;
    Request.put(`users/${_id}`, userData)
      .then((res) => {
        const filteredUsers = users.map((u) => {
          return u._id === res.user._id ? res.user : u;
        });
        setUsers(filteredUsers);
      })
      .catch((err) => toast.warn(err.message))
      .finally(() => CommonStore.set({ loading: false }));
  };

  const changeMaterialSupport = (ms, key) => {
    CommonStore.set({ loading: true });
    const { _id, userEmail, ...msData } = ms;
    Request.put(`ms/${_id}`, msData)
      .then((res) => {
        const filteredMs = {
          ...materialSupport,
          [key]: materialSupport[key].map((i) =>
            i._id === res.materialSupport._id ? { ...res.materialSupport, userEmail } : i
          ),
        };
        setMaterialSupport(filteredMs);
      })
      .catch((err) => toast.warn(err.message))
      .finally(() => CommonStore.set({ loading: false }));
  };

  const removeUser = (id) => {
    CommonStore.set({ loading: true });
    Request.delete(`users/${id}`)
      .then(() => {
        const filteredUsers = users.filter((u) => u._id !== id);
        setUsers(filteredUsers);
      })
      .catch((err) => toast.warn(err.message))
      .finally(() => CommonStore.set({ loading: false }));
  };

  const removeMaterialSupport = (id, key) => {
    CommonStore.set({ loading: true });
    Request.delete(`ms/${id}`)
      .then(() => {
        const filteredMs = {
          ...materialSupport,
          [key]: materialSupport[key].filter((i) => i._id !== id),
        };
        setMaterialSupport(filteredMs);
      })
      .catch((err) => toast.warn(err.message))
      .finally(() => CommonStore.set({ loading: false }));
  };

  const calculateTotalAmount = (key) => {
    const totalAmount = materialSupport[key]?.reduce((acc, cur) => {
      const curAmount = parseFloat(cur.amount) || 0;
      return acc + curAmount;
    }, 0);
    return Helper.formatAmount(totalAmount);
  };

  const renderTabs = () => (
    <Tab.Container defaultActiveKey="users">
      <Nav role="button" variant="pills" className="mb-3">
        <Nav.Link eventKey="users">Users</Nav.Link>
        <Nav.Link eventKey="material-support">Material support</Nav.Link>
        <Nav.Link eventKey="calculator">Calculator</Nav.Link>
      </Nav>
      <Tab.Content>
        <Tab.Pane eventKey="users">{renderUsers()}</Tab.Pane>
        <Tab.Pane eventKey="material-support">{renderMaterialSupport()}</Tab.Pane>
        <Tab.Pane eventKey="calculator">{renderCalculator()}</Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );

  const renderUsers = () => {
    if (!users) {
      return null;
    }
    if (users.length === 0) {
      return <div className="fs-3 text-center">No user records</div>;
    }
    return (
      <UserTable
        rows={users}
        onChange={(id) => setEditing({ id, type: "user" })}
        onRemove={removeUser}
      />
    );
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
              <MsTable
                rows={materialSupport[key]}
                additionalColumns={[{ name: "User email", key: "userEmail" }]}
                onChange={(id) => setEditing({ id, key, type: "material-support" })}
                onRemove={(id) => removeMaterialSupport(id, key)}
              />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  const renderCalculator = () => {
    return <Calculator onSave={updateData} />;
  };

  const renderEditForm = () => {
    const onClose = () => setEditing(null);
    switch (editing?.type) {
      case "user":
        return (
          <div className="app-modal">
            <UserForm
              className="p-3 bg-main rounded overflow-auto"
              style={{ width: "350px", maxHeight: "90vh" }}
              user={users.find((u) => u._id === editing.id)}
              onClose={onClose}
              onSubmit={changeUser}
            />
          </div>
        );
      case "material-support":
        return (
          <div className="app-modal">
            <MsForm
              className="p-3 bg-main rounded overflow-auto"
              style={{ width: "350px", maxHeight: "90vh" }}
              materialSupport={materialSupport[editing.key].find((i) => i._id === editing.id)}
              onClose={onClose}
              onSubmit={(ms) => changeMaterialSupport(ms, editing.key)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-grow-1">
      {renderTabs()}
      {renderEditForm()}
    </div>
  );
};

export default AdminModule;
