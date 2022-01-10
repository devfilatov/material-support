import { Table, Button } from "react-bootstrap";

import Helper, { DEFAULT_VALUE } from "../lib/helper";

const UserTable = ({ rows, onChange, onRemove, ...props }) => {
  const hasNumberColumn = () => {
    return rows.length > 1;
  };

  const hasActionsColumn = () => {
    return onChange || onRemove;
  };

  const renderHead = () => (
    <thead>
      <tr>
        {hasNumberColumn() && <th>№</th>}
        <th>Full name</th>
        <th>Email</th>
        <th>Birthdate</th>
        <th>Role</th>
        <th>Group</th>
        <th>Course</th>
        <th>Group leader</th>
        {hasActionsColumn() && <th>Actions</th>}
      </tr>
    </thead>
  );

  const renderBody = () => (
    <tbody>
      {rows.map((user, index) => (
        <tr key={user._id}>
          {hasNumberColumn() && <td>{index + 1}</td>}
          <td>{user.fullName}</td>
          <td>{user.email}</td>
          <td>{Helper.formatDate(user.birthdate)}</td>
          <td>{user.role || DEFAULT_VALUE}</td>
          <td>{user.group || DEFAULT_VALUE}</td>
          <td>{user.course || DEFAULT_VALUE}</td>
          <td>{user.isGroupLeader ? "yes" : "no"}</td>
          {hasActionsColumn() && (
            <td>
              {onChange && (
                <Button
                  size="sm"
                  variant="outline-dark"
                  className="m-1"
                  onClick={() => onChange(user._id)}
                >
                  Change
                </Button>
              )}
              {onRemove && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="m-1"
                  onClick={() => onRemove(user._id)}
                >
                  Remove
                </Button>
              )}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );

  return (
    <Table striped bordered {...props}>
      {renderHead()}
      {renderBody()}
    </Table>
  );
};

export default UserTable;
