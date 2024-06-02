import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Tooltip } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
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

function Row({ row }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const handleNavigate = () => {
    navigate(`/receipts/${row._id}`); // Adjust the path as needed
  };

  return (
    <React.Fragment>
      <Tooltip title={formatDate(row.date)} placement="top" arrow>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" style={{ width: "30%" }}>
            {row.customerName}
          </TableCell>
          <TableCell align="left">{row.workerName}</TableCell>
          <TableCell align="right">{row.total}</TableCell>
          <TableCell align="right">{row.detail.length}</TableCell>
          <TableCell align="right">
            <IconButton
              aria-label="more options"
              size="small"
              onClick={handleNavigate}>
              <MoreVertIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      </Tooltip>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detail
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Quantity</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Total Price</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.detail.map((item) => (
                    <StyledTableRow key={item.name}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.totalPrice}</TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


Row.propTypes = {
  row: PropTypes.object.isRequired,
};

export default function CollapsibleTable({ receipts }) {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <StyledTableCell>Customer Name</StyledTableCell>
            <StyledTableCell>Worker Name</StyledTableCell>
            <StyledTableCell align="right">Total</StyledTableCell>
            <StyledTableCell align="right">Items Count</StyledTableCell>
            <StyledTableCell align="right">Options</StyledTableCell>{" "}
            {/* New header for the options column */}
          </TableRow>
        </TableHead>
        <TableBody>
          {receipts.map((receipt) => (
            <Row key={receipt._id} row={receipt} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
