import React, { useState, useEffect, lazy } from "react";
import { Tabs, Tab, CircularProgress, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { fetchReportData, getNextDayDate } from "../config/Functions";
import SummaryReport from "../components/reports/SummaryReports";

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
  // const matchesMobile = useMediaQuery("(max-width:600px)");
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useQuery(
    ["summary", companyId, filters],
    () => fetchReportData(companyId, "summary", filters),
    { enabled: value === 0, keepPreviousData: true }
    );
  
  const {
    data: salesData,
    isLoading: isSalesLoading,
    isError: isSalesError,
  } = useQuery(
    ["sales", companyId, filters],
    () => fetchReportData(companyId, "sales", filters),
    { enabled: value === 1, keepPreviousData: true }
  );

  const {
    data: purchasesData,
    isLoading: isPurchasesLoading,
    isError: isPurchasesError,
  } = useQuery(
    ["purchases", companyId, filters],
    () => fetchReportData(companyId, "purchases", filters),
    { enabled: value === 3, keepPreviousData: true }
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
    { enabled: value === 4, keepPreviousData: true }
  );

  const handleDateChange = (e, type) => {
    setFilters({ ...filters, [type]: e.target.value });
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const summasryData = {
    totalSales: 15000.75, // Total sales value in dollars
    debtsPaid: 3000.5, // Total value of debts paid
    debtsAcquired: 1200.0, // Total value of debts acquired
    // dateRange: "01 Nov 2024 - 07 Nov 2024", // Date range for the summary report
  };

  const renderContent = () => {
    if (value === 0) {
      // if (isSummaryLoading) return <CircularProgress />;
      // if (isSummaryError)
      //   return (
      //     <Typography color="error">Error loading sales report</Typography>
      //   );
      if (!summaryData) return <Typography>No summary available</Typography>;
      return (
        <SummaryReport
          data={summaryData}
          />
      );
    }
    if (value === 1) {
      if (isSalesLoading) return <CircularProgress />;
      if (isSalesError)
        return (
          <Typography color="error">Error loading sales report</Typography>
        );
      if (!salesData) return <Typography>No sales data available</Typography>;
      return (
        <SalesReport
          salesData={salesData.sales}
          salesTransactions={salesData.salesTransactions}
        />
      );
    }

       if (value === 2) {
         if (isInventoryLoading) return <CircularProgress />;
         if (isInventoryError)
           return (
             <Typography color="error">
               Error loading inventory report
             </Typography>
           );
         if (!inventoryData)
           return <Typography>No inventory data available</Typography>;
         return (
           <InventoryReport inventoryItems={inventoryData.aggregatedData} />
         );
       }

    if (value === 3) {
      if (isPurchasesLoading) return <CircularProgress />;
      if (isPurchasesError)
        return (
          <Typography color="error">Error loading purchases report</Typography>
        );
      if (!purchasesData)
        return <Typography>No purchases data available</Typography>;
      return <PurchasesReport data={purchasesData.purchases} />;
    }

    if (value === 4) {
      if (isDebtsLoading) return <CircularProgress />;
      if (isDebtsError)
        return (
          <Typography color="error">Error loading debts report</Typography>
        );
      if (!debtsData) return <Typography>No debts data available</Typography>;
      return <DebtsReport data={debtsData.debts} />;
    }

    return null;
  };

  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1 style={{ fontWeight: 200 }}>Reports</h1>
        </div>
        <div className="tabs">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example">
            <Tab label="Summary" />
            <Tab label="Sales" />
            <Tab label="Inventory" />
            <Tab label="Purchases" />
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
          <div style={{display: 'flex'}} className={`filter-options ${showFilters ? "visible" : ""}`}>
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