import React, { useState,useEffect } from "react";
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
import { Padding } from "@mui/icons-material";

// Inventory Summary Cards Component
const InventorySummaryCards = ({ inventoryData }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Items Sold</Typography>
            <Typography variant="h4">
              ₵{inventoryData?.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={9}>
        {/* <Card>
          <CardContent>
            <Typography variant="h6">Total Items</Typography>
            <Typography variant="h4">{inventoryData?.totalItems}</Typography>
          </CardContent>
        </Card> */}
      </Grid>
    </Grid>
  );
};

// Inventory Table Component
const InventoryTable = ({ inventoryItems = [] }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const items = Array.isArray(inventoryItems) ? inventoryItems : [];

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filtering and sorting the inventory items
  const filteredItems = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (orderBy === "name") {
      return a.name.localeCompare(b.name) * (order === "asc" ? 1 : -1);
    }
    if (orderBy === "amountSold") {
      return (a.amountSold - b.amountSold) * (order === "asc" ? 1 : -1);
    }
    return 0;
  });

  return (
    <TableContainer sx={{marginTop: 2}} component={Paper}>
      <Table>
        <TableHead>
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
            <TableCell align="right">Total Sales Price</TableCell>
            <TableCell align="right">Amount Remaining</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
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
  useEffect(() => {
    if (inventoryItems) {
      const total = inventoryItems.reduce(
        (total, data) => total + data.totalSalesPrice,
        0
      );
      console.log(total)
      setTotalCash(total);
    }
  }, [inventoryItems]); // Add inventoryItems as a dependency

  return (
    <div className="content" style={{ width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Inventory Report
      </Typography>
      <InventorySummaryCards inventoryData={totalCash} />
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        {/* <SearchField onSearch={setSearchTerm} /> */}
      </div>
      <InventoryTable inventoryItems={inventoryItems} />
    </div>
  );
};

export default InventoryReports;
