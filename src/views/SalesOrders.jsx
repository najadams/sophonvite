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

const SalesOrders = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  if (isLoading) return <Loader />;

  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1 style={{ fontWeight: 200}}>Sales Order</h1>
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
          }}>
          <Widgets
            title={"Sales"}
            count={
              `₵${receipts.reduce(
                (total, receipts) => total + receipts.total,
                0
              )}` || 0
            }
          />
          <div style={{ marginRight: "20px", position:'relative', top: '65px' }}>
            <label htmlFor="dateInput" style={{ marginRight: "10px" }}>
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
        </div>
        {!isLoading && !isError && receipts && receipts.length > 0 ? (
          <CollapsibleTable receipts={receipts} />
        ) : (
          <div className="content">
            {selectedDate.toISOString().split("T")[0] ===
            new Date().toISOString().split("T")[0] ? (
              <h2>No Sales Made Today</h2>
            ) : (
              <h2>
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
