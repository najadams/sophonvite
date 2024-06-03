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
      const response = await axios.get(`/api/receipts/${companyId}`);
      const todaysReceipts = serverAid.filterReceiptsForToday(response.data);
      return todaysReceipts;
    } catch (error) {
      console.error("Error fetching receipts:", error);
      throw error;
    }
  };

  const {
    data: receipts,
    isLoading,
    isError,
  } = useQuery(["receipts", companyId], fetchReceipts, {
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1>Sales Order</h1>
        </div>
        <AddItem>
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
            count={`₵${receipts.reduce(
              (total, receipts) => total + receipts.total,
              0
            )}` || 0}
          />
        </div>
        {!isLoading && !isError && receipts && receipts.length > 0 ? (
          <CollapsibleTable receipts={receipts} />
        ) : (
          <div className="content">
            <h2>No Sales Made Today</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOrders;
