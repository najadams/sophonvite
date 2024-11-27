import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Tooltip, Menu, MenuItem } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { capitalizeFirstLetter } from "../../config/Functions";
import ReceiptTemplate from "../compPrint/ReceiptTemplate";
import axios from "../../config/index";
import { formatNumber } from "../../config/Functions";

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

const StyledTableRow = styled(TableRow)(({ theme, flagged }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: flagged ? "#ffebee" : "#fff",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  backgroundColor: flagged ? "#ffebee" : "inherit",
}));

function Row({ row, onFlagChange, setValue }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
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

  const handleView = () => {
    handleMenuClose();
    navigate(`/receipts/${row._id}`, { state: { row } });
  };

  // Updated handleEdit to use onEdit prop
  const handleEdit = () => {
    navigate(`/sales/${row._id}`, { state: { row} })
    handleMenuClose();
    setValue(1)
  };

  const handleFlag = async () => {
    handleMenuClose();
    const updatedFlag = !row.flagged;

    try {
      await axios.patch(`/api/receipts/${row._id}/flag`, {
        flagged: updatedFlag,
      });
      onFlagChange(row._id, updatedFlag);
    } catch (error) {
      console.error("Failed to update the flag status:", error);
    }
  };

  const handlePrintClick = () => {
    setPrintValues({
      customerName: `${row.customerName} - ${row.customerCompany}`,
      products: row.detail,
      total: row.total,
      balance: row.balance,
      discount: row.discount,
      amountPaid: row.amountPaid,
      date: formatDate(row.date),
      workerName: row.workerName,
    });
    setTimeout(() => {
      setPrintValues(null);
    }, 2000);
    setAnchorEl(null)
  };

  return (
    <React.Fragment>
      {printValues && (
        <div style={{ display: "none" }}>
          <ReceiptTemplate
            ref={printRef}
            customerName={printValues.customerName}
            products={printValues.products}
            total={printValues.total}
            balance={printValues.balance}
            amountPaid={printValues.amountPaid}
            date={printValues.date}
            workerName={printValues.workerName}
            discount={printValues.discount}
          />
        </div>
      )}
      <Tooltip title={formatDate(row.date)} placement="top" arrow>
        <StyledTableRow
          sx={{ "& > *": { borderBottom: "unset" } }}
          flagged={row.flagged}>
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
          <TableCell align="left">
            {capitalizeFirstLetter(row.workerName)}
          </TableCell>
          <TableCell align="right">{formatNumber(row.total)}</TableCell>
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
              <MenuItem onClick={handlePrintClick}>Print</MenuItem>
              <MenuItem onClick={handleView}>View</MenuItem>
              <MenuItem onClick={handleFlag}>
                {row.flagged ? "Unflag" : "Flag"}
                {row.flagged ? (
                  <FlagIcon fontSize="small" />
                ) : (
                  <OutlinedFlagIcon fontSize="small" />
                )}
              </MenuItem>
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
            </Menu>
          </TableCell>
        </StyledTableRow>
      </Tooltip>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{ margin: 1, background: "#f5f5f5", fontFamily: "poppins" }}>
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
                        {capitalizeFirstLetter(item.name)}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.salesPrice}</TableCell>
                      <TableCell align="right">
                        {formatNumber(Math.ceil(item.salesPrice * item.quantity))}
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
  onFlagChange: PropTypes.func.isRequired,
};

export default Row;
