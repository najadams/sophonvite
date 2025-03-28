import React, { useState, useEffect } from "react";
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
import { StyledTableHead } from "./SalesReport";
import { Inventory, TrendingUp, AttachMoney } from "@mui/icons-material";

const capitalizeFirstLetter = (str) => {
  if (typeof str === "string") {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return str;
};

// Inventory Summary Cards Component
const InventorySummaryCards = ({ inventoryData }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
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
            <Inventory color="primary" sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              mb: 1,
              fontWeight: 500,
            }}>
            Total Items Sold
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1976d2",
            }}>
            ₵{inventoryData?.toFixed(2)}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
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
            Total Sales Value
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#2e7d32",
            }}>
            ₵{inventoryData?.toFixed(2)}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
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
            <AttachMoney color="secondary" sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              mb: 1,
              fontWeight: 500,
            }}>
            Average Price
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#f57c00",
            }}>
            ₵{(inventoryData / 100).toFixed(2)}
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
};

// Inventory Table Component
const InventoryTable = ({ inventoryItems = [], searchTerm }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const items = Array.isArray(inventoryItems) ? inventoryItems : [];

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparator = 0;
    if (orderBy === "name") {
      comparator = a.name.localeCompare(b.name);
    } else if (orderBy === "amountSold") {
      comparator = a.totalQuantity - b.totalQuantity;
    } else if (orderBy === "totalSalesPrice") {
      comparator = a.totalSalesPrice - b.totalSalesPrice;
    } else if (orderBy === "onhand") {
      comparator = a.onhand - b.onhand;
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
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleRequestSort("name")}>
                Item Name
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "amountSold"}
                direction={orderBy === "amountSold" ? order : "asc"}
                onClick={() => handleRequestSort("amountSold")}>
                Amount Sold
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "totalSalesPrice"}
                direction={orderBy === "totalSalesPrice" ? order : "asc"}
                onClick={() => handleRequestSort("totalSalesPrice")}>
                Total Sales Price
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "onhand"}
                direction={orderBy === "onhand" ? order : "asc"}
                onClick={() => handleRequestSort("onhand")}>
                Amount Remaining
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow
              key={item._id}
              sx={{
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}>
              <TableCell>{capitalizeFirstLetter(item.name)}</TableCell>
              <TableCell align="right">{item.totalQuantity || 0}</TableCell>
              <TableCell align="right">
                ₵{item.totalSalesPrice?.toFixed(2)}
              </TableCell>
              <TableCell align="right">{item.onhand || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// InventoryReports Component
const InventoryReports = ({ inventoryItems }) => {
  const [totalCash, setTotalCash] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (inventoryItems) {
      const total = inventoryItems.reduce(
        (total, data) => total + data.totalSalesPrice,
        0
      );
      setTotalCash(total);
    }
  }, [inventoryItems]);

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
          Inventory Report
        </Typography>
        <InventorySummaryCards inventoryData={totalCash} />
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
            Inventory Items
          </Typography>
          <SearchField onSearch={setSearchTerm} />
        </Box>
        <InventoryTable
          inventoryItems={inventoryItems}
          searchTerm={searchTerm}
        />
      </Paper>
    </Box>
  );
};

export default InventoryReports;
