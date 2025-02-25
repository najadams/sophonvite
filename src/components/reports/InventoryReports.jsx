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
} from "@mui/material";
import SearchField from "../../hooks/SearchField";
import { StyledTableHead } from "./SalesReport";

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
    <Grid container spacing={2}>
      <Grid item xs={4} sm={3} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Items Sold</Typography>
            <Typography variant="h4">₵{inventoryData?.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={9}>
        {/* Add any additional cards here */}
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

  // Filtering and sorting the inventory items based on search term
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
    <TableContainer sx={{ marginTop: 2 }} component={Paper}>
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
            <TableRow key={item._id}>
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
    <div className="content" style={{ width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Inventory Report
      </Typography>
      <InventorySummaryCards inventoryData={totalCash} />
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <SearchField onSearch={setSearchTerm} />
      </div>
      <InventoryTable inventoryItems={inventoryItems} searchTerm={searchTerm} />
    </div>
  );
};

export default InventoryReports;
