import { Table, Button } from "react-bootstrap";

import Helper, { MS_TYPES, DEFAULT_VALUE } from "../lib/helper";

const MsTable = ({ rows, additionalColumns = [], onChange, onRemove, ...props }) => {
  const hasNumberColumn = () => {
    return rows.length > 1;
  };

  const hasActionsColumn = () => {
    return onChange || onRemove;
  };

  const getTypeName = (type) => {
    return MS_TYPES[type] || DEFAULT_VALUE;
  };

  const getConclusion = ({ amount }) => {
    if (parseFloat(amount) > 0) return <div className="text-success">Resolved</div>;
    return <div className="text-danger">Rejected</div>;
  };

  const renderHead = () => (
    <thead>
      <tr>
        {hasNumberColumn() && <th>№</th>}
        <th>Type</th>
        <th>Amount</th>
        <th>Approval status</th>
        {additionalColumns.map(({ name }, index) => (
          <th key={index}>{name}</th>
        ))}
        <th>Conclusion</th>
        {hasActionsColumn() && <th>Actions</th>}
      </tr>
    </thead>
  );

  const renderBody = () => (
    <tbody>
      {rows.map((ms, index) => (
        <tr key={ms._id}>
          {hasNumberColumn() && <td>{index + 1}</td>}
          <td>{getTypeName(ms.type)}</td>
          <td>{Helper.formatAmount(ms.amount)}</td>
          <td>{String(ms.approvalStatus)}</td>
          {additionalColumns.map(({ key }, index) => (
            <td key={index}>{ms[key]}</td>
          ))}
          <th>{getConclusion(ms)}</th>
          {hasActionsColumn() && (
            <td>
              {onChange && (
                <Button
                  size="sm"
                  variant="outline-dark"
                  className="m-1"
                  onClick={() => onChange(ms._id)}
                >
                  Change
                </Button>
              )}
              {onRemove && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="m-1"
                  onClick={() => onRemove(ms._id)}
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

export default MsTable;
