import React, { useState, useMemo } from "react";
import {
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableSortLabel,
} from "@mui/material";
import SearchField from "../../hooks/SearchField";
import { capitalizeFirstLetter, formatNumber } from "../../config/Functions";
import {styled} from "@mui/material/styles"

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "black",
  "& th": {
    color: "white",
    fontWeight: "bold",
  },
  "& th .MuiTableSortLabel-root": {
    fontSize: "1rem", // Default font size
    fontWeight: "bold", // Default weight
  },
  "& th .MuiTableSortLabel-root.Mui-active": {
    fontSize: "1.2rem", // Larger size when active
    fontWeight: "bolder", // Bolder weight when active
    color: "white", // Ensure it stays white
  },
  "& th:hover": {
    fontSize: "1.1rem", // Slightly larger font on hover
    fontWeight: "bolder", // Bolder text on hover
  },
  // Hover effect for TableSortLabel inside the header
  "& th .MuiTableSortLabel-root:hover": {
    fontSize: "1.1rem", // Slightly larger on hover
    fontWeight: "bolder", // Bolder text on hover
    color: "white", // Ensure it remains white
  },
}));

// SummaryCards Component
const SummaryCards = ({ salesData }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={6} md={3}>
        <Card sx={{ backgroundColor: "#d8fede" }}>
          <CardContent>
            <Typography variant="h6">Total Sales</Typography>
            <Typography variant="h4">
              ₵{formatNumber(salesData?.totalSales.toFixed(2))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={6} md={3}>
        <Card sx={{ backgroundColor: "#e3f2fd" }}>
          <CardContent>
            <Typography variant="h6">Total Amount Paid</Typography>
            <Typography variant="h4">
              ₵{formatNumber(salesData?.totalAmountPaid.toFixed(2))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={6} md={3}>
        <Card sx={{ backgroundColor: "#ffebee" }}>
          <CardContent>
            <Typography variant="h6">Balance Owed</Typography>
            <Typography variant="h4">
              ₵{formatNumber(salesData?.totalBalance.toFixed(2))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={6} md={3}>
        <Card sx={{ backgroundColor: "#3e3eff0f"}}>
          <CardContent>
            <Typography variant="h6">Total Discounts</Typography>
            <Typography variant="h4">
              ₵{formatNumber(salesData?.totalDiscounts.toFixed(2))}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// SalesTable Component
// SalesTable Component
const SalesTable = ({ salesTransactions = [] }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Sort the transactions
  const sortedTransactions = [...salesTransactions].sort((a, b) => {
    let comparator = 0;

    if (orderBy === "date") {
      comparator = new Date(a.date) - new Date(b.date);
    } else if (orderBy === "customerName") {
      comparator = a.customerName.localeCompare(b.customerName);
    } else if (orderBy === "balance") {
      comparator = a.balance - b.balance;
    } else if (orderBy === "totalAmountPaid") {
      comparator = a.totalAmountPaid -b.totalAmountPaid
    } else if (orderBy === "totalAmount") {
      comparator = a.totalAmountPaid -b.totalAmountPaid
    }

    return comparator * (order === "asc" ? 1 : -1);
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "date"}
                direction={orderBy === "date" ? order : "asc"}
                onClick={() => handleRequestSort("date")}>
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "customerName"}
                direction={orderBy === "customerName" ? order : "asc"}
                onClick={() => handleRequestSort("customerName")}>
                Customer Name
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Cashier</TableCell>
            {/* <TableCell align="right">Total Amount</TableCell> */}
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "totalAmount"}
                direction={orderBy === "totalAmount" ? order : "asc"}
                onClick={() => handleRequestSort("totalAmount")}>
                Total Amount
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "totalAmountPaid"}
                direction={orderBy === "totalAmountPaid" ? order : "asc"}
                onClick={() => handleRequestSort("totalAmountPaid")}>
                Total Amount Paid
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Discount</TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "balance"}
                direction={orderBy === "balance" ? order : "asc"}
                onClick={() => handleRequestSort("balance")}>
                Balance
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {sortedTransactions.map((transaction) => (
            <TableRow key={transaction.receiptId}>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {capitalizeFirstLetter(transaction.customerName)}
              </TableCell>
              <TableCell align="right">
                {capitalizeFirstLetter(transaction.workerName)}
              </TableCell>
              <TableCell align="right">
                ₵{formatNumber(transaction.totalAmount.toFixed(2))}
              </TableCell>
              <TableCell align="right">
                ₵{formatNumber(transaction.totalAmountPaid.toFixed(2))}
              </TableCell>
              <TableCell align="right">
                ₵{formatNumber(transaction.discount)}
              </TableCell>
              <TableCell align="right">
                ₵{formatNumber(transaction.balance.toFixed(2))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// SalesReport Component
const SalesReport = ({ salesData, salesTransactions }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filter transactions based on search term
  const filteredTransactions = useMemo(() => {
    return salesTransactions.filter((transaction) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.customerName.toLowerCase().includes(searchLower) ||
        transaction.workerName.toLowerCase().includes(searchLower) ||
        transaction.customerCompany.toLowerCase().includes(searchLower)
      );s
    });
  }, [salesTransactions, searchTerm]);

  return (
    <div className="content">
      <Typography variant="h4" gutterBottom>
        Sales Report
      </Typography>
      <SummaryCards salesData={salesData} />
      {/* <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
        Sales Transactions
      </Typography> */}
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <SearchField onSearch={handleSearch} />
      </div>
      <SalesTable salesTransactions={filteredTransactions} />
    </div>
  );
};

export default SalesReport;
