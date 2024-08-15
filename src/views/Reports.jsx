import React, { useState, useEffect, lazy } from "react";
import { Box, Tabs, Tab, CircularProgress, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import SearchField from "../hooks/SearchField";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { fetchReportData, getNextDayDate } from "../config/Functions";

// Lazy-loaded components
const PurchasesReport = lazy(() =>
  import("../components/reports/PurchaseReport")
);
const InventoryReport = lazy(() =>
  import("../components/reports/InventoryReports")
);
const DebtsReport = lazy(() => import("../components/reports/DebtsReports"));
const SalesReport = lazy(() => import("../components/reports/SalesReport"));

// Fetch report data using Axios


const Reports = () => {
  const [value, setValue] = useState(0);
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: getNextDayDate(),
  });
  const companyId = useSelector((state) => state.companyState.data.id);
  const matchesMobile = useMediaQuery("(max-width:600px)");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const salest = [
    {
      customerName: "John Doe",
      date: "2024-08-01",
      receipts: [
        {
          receiptId: "123",
          totalAmountPaid: 100,
          balance: 20,
          discount: 10,
          date: "2024-08-01",
        },
      ],
    },
    {
      customerName: "Jane Smith",
      date: "2024-08-02",
      receipts: [
        {
          receiptId: "124",
          totalAmountPaid: 200,
          balance: 30,
          discount: 15,
          date: "2024-08-02",
        },
      ],
    },
  ];


  const {
    data: salesData,
    isLoading: isSalesLoading,
    isError: isSalesError,
  } = useQuery(
    ["sales", companyId, filters],
    () => fetchReportData(companyId, "sales", filters),
    { enabled: value === 0, keepPreviousData: true }
  );

  const {
    data: purchasesData,
    isLoading: isPurchasesLoading,
    isError: isPurchasesError,
  } = useQuery(
    ["purchases", companyId, filters],
    () => fetchReportData(companyId, "purchases", filters),
    { enabled: value === 1, keepPreviousData: true }
  );

  const {
    data: inventoryData,
    isLoading: isInventoryLoading,
    isError: isInventoryError,
  } = useQuery(
    ["inventory", companyId, filters],
    () => fetchReportData(companyId, "inventory", filters),
    { enabled: value === 2, keepPreviousData: true }
  );

  const {
    data: debtsData,
    isLoading: isDebtsLoading,
    isError: isDebtsError,
  } = useQuery(
    ["debts", companyId, filters],
    () => fetchReportData(companyId, "debts", filters),
    { enabled: value === 3, keepPreviousData: true }
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDateChange = (e, type) => {
    setFilters({ ...filters, [type]: e.target.value });
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderContent = () => {
    switch (value) {
      case 0:
        if (isSalesLoading) return <CircularProgress />;
        if (isSalesError)
          return (
            <Typography color="error">Error loading sales report</Typography>
          );
        if (!salesData) return <Typography>No sales data available</Typography>;
        return <SalesReport salesData={salesData.sales} salesTransactions={salesData.salesTransactions}/>;
      case 1:
        if (isPurchasesLoading) return <CircularProgress />;
        if (isPurchasesError)
          return (
            <Typography color="error">
              Error loading purchases report
            </Typography>
          );
        if (!purchasesData)
          return <Typography>No purchases data available</Typography>;
        return <PurchasesReport data={purchasesData.purchases} />;
      case 2:
        if (isInventoryLoading) return <CircularProgress />;
        if (isInventoryError)
          return (
            <Typography color="error">
              Error loading inventory report
            </Typography>
          );
        if (!inventoryData)
          return <Typography>No inventory data available</Typography>;
        return <InventoryReport data={inventoryData.inventory} />;
      case 3:
        if (isDebtsLoading) return <CircularProgress />;
        if (isDebtsError)
          return (
            <Typography color="error">Error loading debts report</Typography>
          );
        if (!debtsData) return <Typography>No debts data available</Typography>;
        return <DebtsReport data={debtsData.debts} />;
      default:
        return null;
    }
  };

  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1 style={{ fontWeight: 200 }}>Reports</h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "60%",
            justifyContent: "center",
          }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example">
            <Tab label="Sales" />
            <Tab label="Purchases" />
            <Tab label="Inventory" />
            <Tab label="Debts" />
          </Tabs>
        </div>
        <div style={{ padding: 20 }}>.</div>
      </div>
      <div className="content">
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 10,
          }}>
          <div className={`filter-options ${showFilters ? "visible" : ""}`}>
            <SearchField onSearch={handleSearch} />
            <span style={{ padding: 10 }}>
              <label
                htmlFor="startDate"
                style={{ marginLeft: 10, fontSize: "larger", font: "icon" }}>
                Start Date:
              </label>
              <input
                className="date-input"
                type="date"
                id="startDate"
                value={filters.startDate}
                onChange={(e) => handleDateChange(e, "startDate")}
              />
            </span>
            <span style={{ padding: 10 }}>
              <label
                htmlFor="endDate"
                style={{ marginLeft: 10, fontSize: "larger", font: "icon" }}>
                End Date:
              </label>
              <input
                className="date-input"
                type="date"
                id="endDate"
                value={filters.endDate}
                onChange={(e) => handleDateChange(e, "endDate")}
              />
            </span>
          </div>
          <div className="filter-icon-container">
            <i
              className="bx bx-filter filter-icon"
              onClick={toggleFilters}
              style={{
                fontSize: 40,
                borderRadius: 10,
                backgroundColor: "white",
                padding: 5,
                cursor: "pointer",
              }}></i>
            <span className="filter-text">Filters</span>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Reports;