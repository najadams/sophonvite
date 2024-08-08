import React, { lazy, useEffect, useState } from "react";
import AddItem from "../hooks/AddItem";
import SalesOrderForms from "../components/forms/SaleOrderForms";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { serverAid, tableActions } from "../config/Functions";
import CollapsibleTable from "../components/common/CollapsibleTable";
import axios from "../config";
import Loader from "../components/common/Loader";
import { Widgets } from "./Dashboard";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import SearchField from "../hooks/SearchField";
import { TabPanel, a11yProps } from "./ProductCatalogue";

const MakeSales = lazy(() => import("../components/forms/MakeSales"))

const SalesOrders = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [value, setValue] = React.useState(0);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [totalSales, setTotalSales] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await tableActions.fetchCustomersNames(companyId);
      setCustomerOptions(response);
    };

    fetchCustomers();
  }, [companyId]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await tableActions.fetchProductNames(companyId);
      setProductOptions(response);
    };

    fetchProducts();
  }, [companyId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchReceipts = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
      const response = await axios.get(
        `/api/receipts/${companyId}?date=${formattedDate}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching receipts:", error);
      throw error;
    }
  };

  const {
    data: receipts,
    isLoading,
    isError,
    refetch,
  } = useQuery(["receipts", companyId, selectedDate], fetchReceipts, {
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (receipts) {
      const total = receipts
        .filter((receipt) => !receipt.flagged)
        .reduce((total, receipt) => total + receipt.total, 0);
      setTotalSales(total);
    }
  }, [receipts]);

  const handleSearch = (term) => {
    console.log(term);
    
    setSearchTerm(term);
  };

  const handleFlaggedChange = () => {
    refetch();
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const filteredReceipts = receipts
    ? receipts.filter((receipt) =>
        receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isLoading) return <Loader />;

  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1 style={{ fontWeight: 200 }}>Sales</h1>
        </div>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example">
          <Tab label="Sales" {...a11yProps(0)} />
          <Tab label="Make Sales" {...a11yProps(1)} />
          {/* <Tab label="Groups" {...a11yProps(1)} /> */}
        </Tabs>
        <AddItem title={"Make Sales"}>
          <SalesOrderForms
            customers={customerOptions}
            Products={productOptions}
          />
        </AddItem>
      </div>

      <TabPanel value={value} index={0}>
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
            <Widgets title={"Sales"} count={`₵${totalSales}`} />
            <div className={`filter-options ${showFilters ? "visible" : ""}`}>
              <span style={{ padding: 10 }}>
                <label
                  htmlFor="dateInput"
                  style={{ marginLeft: 10, fontSize: "larger", font: "icon" }}>
                  Select Date:
                </label>
                <input
                  className="date-input"
                  type="date"
                  id="dateInput"
                  value={selectedDate.toISOString().split("T")[0]} // Format date to YYYY-MM-DD
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </span>
              <SearchField
                onSearch={handleSearch} // Update search term state
                placeholder={"Search Customer Name"}
              />
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
          {!isLoading && !isError && receipts && receipts.length > 0 ? (
            <div style={{ width: "100%" }}>
              <CollapsibleTable
                receipts={receipts}
                searchTerm={searchTerm} // Pass search term to CollapsibleTable
                onFlagChange={handleFlaggedChange}
              />
            </div>
          ) : (
            <div>
              {selectedDate.toISOString().split("T")[0] ===
              new Date().toISOString().split("T")[0] ? (
                <h2 style={{ paddingTop: "50%" }}>No Sales Made Today </h2>
              ) : (
                <h2 style={{ paddingTop: "50%" }}>
                  No Sales Made on {selectedDate.toISOString().split("T")[0]}
                </h2>
              )}
            </div>
          )}
        </div>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <MakeSales customers={customerOptions} Products={productOptions} />
      </TabPanel>
    </div>
  );
};

export default SalesOrders;
