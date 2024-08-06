import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Row from "./Row";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#262626",
    color: theme.palette.primary.contrastText,
    fontSize: "16px",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function CollapsibleTable({ receipts, onFlagChange }) {
  const [updatedReceipts, setUpdatedReceipts] = useState(receipts);

  const handleFlagChange = (id, flagged) => {
    setUpdatedReceipts((prevReceipts) =>
      prevReceipts.map((receipt) =>
        receipt._id === id ? { ...receipt, flagged } : receipt
      )
    );
    onFlagChange();
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "61vh" }}>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <StyledTableCell>Customer Name</StyledTableCell>
            <StyledTableCell>Cashier</StyledTableCell>
            <StyledTableCell align="right">Total</StyledTableCell>
            <StyledTableCell align="right">Items Count</StyledTableCell>
            <StyledTableCell align="right">Options</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {updatedReceipts.map((receipt) => (
            <Row
              key={receipt._id}
              row={receipt}
              onFlagChange={handleFlagChange}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CollapsibleTable.propTypes = {
  receipts: PropTypes.array.isRequired,
};

export default CollapsibleTable;
