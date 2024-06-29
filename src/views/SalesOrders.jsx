import React, { useEffect, useState } from "react";
import AddItem from "../hooks/AddItem";
import SalesOrderForms from "../components/forms/SaleOrderForms";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { serverAid, tableActions } from "../config/Functions";
import CollapsibleTable from "../components/common/CollapsibleTable";
import axios from "../config";
import Loader from "../components/common/Loader";
import { Widgets } from "./Dashboard";
import SearchField from "../hooks/SearchField";

const SalesOrders = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

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
  } = useQuery(["receipts", companyId, selectedDate], fetchReceipts, {
    refetchOnWindowFocus: true,
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
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
          <h1 style={{ fontWeight: 200 }}>Sales Order</h1>
        </div>
        <AddItem title={"Make Sales"}>
          <SalesOrderForms
            customerOptions={customerOptions}
            Products={productOptions}
          />
        </AddItem>
      </div>

      <div className="content">
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            flexDirection: "row-reverse",
            alignItems: "flex-end",
          }}>
          <Widgets
            title={"Sales"}
            count={
              `₵${filteredReceipts.reduce(
                (total, receipt) => total + receipt.total,
                0
              )}` || 0
            }
          />
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="dateInput" style={{ marginLeft: 10, fontSize: 'larger', font: "icon" }}>
              Select Date:
            </label>
            <input
              className="date-input"
              type="date"
              id="dateInput"
              value={selectedDate.toISOString().split("T")[0]} // Format date to YYYY-MM-DD
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>
          <SearchField onSearch={handleSearch} placeholder={'Search Customer Name'} />
        </div>
        {!isLoading &&
        !isError &&
        filteredReceipts &&
        filteredReceipts.length > 0 ? (
          <CollapsibleTable receipts={filteredReceipts} />
        ) : (
          <div className="content">
            {selectedDate.toISOString().split("T")[0] ===
            new Date().toISOString().split("T")[0] ? (
              <h2 style={{ paddingTop: "50%" }}>No Sales Made Today</h2>
            ) : (
              <h2 style={{ paddingTop: "50%" }}>
                No Sales Made on {selectedDate.toISOString().split("T")[0]}
              </h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOrders;
