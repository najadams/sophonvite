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
  Box,
} from "@mui/material";
import SearchField from "../../hooks/SearchField";
import { capitalizeFirstLetter, formatNumber } from "../../config/Functions";
import { styled } from "@mui/material/styles";
import {
  TrendingUp,
  AttachMoney,
  AccountBalance,
  Discount,
} from "@mui/icons-material";

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#1a237e",
  "& th": {
    color: "white",
    fontWeight: "bold",
    padding: "16px",
  },
  "& th .MuiTableSortLabel-root": {
    color: "white",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  "& th .MuiTableSortLabel-root.Mui-active": {
    color: "white",
    fontSize: "1rem",
    fontWeight: "700",
  },
  "& th:hover": {
    backgroundColor: "#283593",
  },
  "& th .MuiTableSortLabel-root:hover": {
    color: "white",
  },
}));

// SummaryCards Component
const SummaryCards = ({ salesData }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={2}
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 3,
            },
          }}>
          <Box
            sx={{
              backgroundColor: "#e8f5e9",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
            <TrendingUp color="success" sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              mb: 1,
              fontWeight: 500,
            }}>
            Total Sales
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#2e7d32",
            }}>
            ₵{formatNumber(salesData?.totalSales.toFixed(2))}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={2}
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 3,
            },
          }}>
          <Box
            sx={{
              backgroundColor: "#e3f2fd",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
            <AttachMoney color="primary" sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              mb: 1,
              fontWeight: 500,
            }}>
            Total Amount Paid
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1976d2",
            }}>
            ₵{formatNumber(salesData?.totalAmountPaid.toFixed(2))}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={2}
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 3,
            },
          }}>
          <Box
            sx={{
              backgroundColor: "#ffebee",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
            <AccountBalance color="error" sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              mb: 1,
              fontWeight: 500,
            }}>
            Balance Owed
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#d32f2f",
            }}>
            ₵{formatNumber(salesData?.totalBalance.toFixed(2))}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={2}
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 3,
            },
          }}>
          <Box
            sx={{
              backgroundColor: "#fff3e0",
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
            <Discount color="secondary" sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              mb: 1,
              fontWeight: 500,
            }}>
            Total Discounts
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#f57c00",
            }}>
            ₵{formatNumber(salesData?.totalDiscounts.toFixed(2))}
          </Typography>
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

  const sortedTransactions = [...salesTransactions].sort((a, b) => {
    let comparator = 0;

    if (orderBy === "date") {
      comparator = new Date(a.date) - new Date(b.date);
    } else if (orderBy === "customerName") {
      comparator = a.customerName.localeCompare(b.customerName);
    } else if (orderBy === "balance") {
      comparator = a.balance - b.balance;
    } else if (orderBy === "totalAmountPaid") {
      comparator = a.totalAmountPaid - b.totalAmountPaid;
    } else if (orderBy === "totalAmount") {
      comparator = a.totalAmountPaid - b.totalAmountPaid;
    }

    return comparator * (order === "asc" ? 1 : -1);
  });

  return (
    <TableContainer
      component={Paper}
      elevation={2}
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
      }}>
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
            <TableRow
              key={transaction.receiptId}
              sx={{
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {capitalizeFirstLetter(
                  `${transaction.customerName} - ${transaction.customerCompany}`
                )}
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

  const filteredTransactions = useMemo(() => {
    return salesTransactions.filter((transaction) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.customerName.toLowerCase().includes(searchLower) ||
        transaction.workerName.toLowerCase().includes(searchLower) ||
        transaction.customerCompany.toLowerCase().includes(searchLower)
      );
    });
  }, [salesTransactions, searchTerm]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: "#f8f9fa" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#1a237e",
            mb: 3,
          }}>
          Sales Report
        </Typography>
        <SummaryCards salesData={salesData} />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, backgroundColor: "#f8f9fa" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1a237e",
            }}>
            Sales Transactions
          </Typography>
          <SearchField onSearch={handleSearch} />
        </Box>
        <SalesTable salesTransactions={filteredTransactions} />
      </Paper>
    </Box>
  );
};

export default SalesReport;
