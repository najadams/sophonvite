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

// SummaryCards Component
const SummaryCards = ({ salesData }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Sales</Typography>
            <Typography variant="h4">
              ₵{salesData?.totalSales.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Discounts</Typography>
            <Typography variant="h4">
              ₵{salesData?.totalDiscounts.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Amount Paid</Typography>
            <Typography variant="h4">
              ₵{salesData?.totalAmountPaid.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Balance</Typography>
            <Typography variant="h4">
              ₵{salesData?.totalBalance.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

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
    if (orderBy === "date") {
      return (new Date(a.date) - new Date(b.date)) * (order === "asc" ? 1 : -1);
    }
    if (orderBy === "customerName") {
      return (
        a.customerName.localeCompare(b.customerName) *
        (order === "asc" ? 1 : -1)
      );
    }
    return 0;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
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
            <TableCell align="right">Total Amount</TableCell>
            <TableCell align="right">Total Amount Paid</TableCell>
            <TableCell align="right">Discount</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTransactions.map((transaction) => (
            <TableRow key={transaction.receiptId}>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{transaction.customerName}</TableCell>
              <TableCell align="right">{transaction.workerName}</TableCell>
              <TableCell align="right">{transaction.totalAmount}</TableCell>
              <TableCell align="right">
                ₵{transaction.totalAmountPaid.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                ₵{transaction.discount.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                ₵{transaction.balance.toFixed(2)}
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
        transaction.workerName.toLowerCase().includes(searchLower)
      );
    });
  }, [salesTransactions, searchTerm]);

  return (
    <div className="content">
      <Typography variant="h4" gutterBottom>
        Sales Report
      </Typography>
      <SummaryCards salesData={salesData} />
      <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
        Sales Transactions
      </Typography>
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <SearchField onSearch={handleSearch} />
      </div>
      <SalesTable salesTransactions={filteredTransactions} />
    </div>
  );
};

export default SalesReport;
