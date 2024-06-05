import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Tooltip, Menu, MenuItem } from "@mui/material";
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
import { capitalizeFirstLetter } from "../../config/Functions";

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
  const [anchorEl, setAnchorEl] = useState(null); // State for managing menu anchor
  const printRef = useRef();
  const [printValues, setPrintValues] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleView = () => {
    handleMenuClose();
    navigate(`/receipts/${row._id}`);
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
            {capitalizeFirstLetter(row.customerName)}
          </TableCell>
          <TableCell align="left">{capitalizeFirstLetter(row.workerName)}</TableCell>
          <TableCell align="right">{row.total}</TableCell>
          <TableCell align="right">{row.detail.length}</TableCell>
          <TableCell align="right">
            <IconButton
              aria-label="more options"
              size="small"
              onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}>
              <MenuItem onClick={handlePrint}>Print</MenuItem>
              <MenuItem onClick={handleView}>View</MenuItem>
            </Menu>
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
                      <strong>Unit Price</strong>
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
                      <TableCell align="right">{item.salesprice}</TableCell>
                      <TableCell align="right">
                        {item.salesprice * item.quantity}
                      </TableCell>
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
    <TableContainer component={Paper} sx={{ maxHeight: "75vh" }}>
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
 