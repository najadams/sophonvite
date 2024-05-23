import React from "react";
import AddItem from "../hooks/AddItem";
import VendorForm from "../components/forms/VendorForm";

const Transactions = () => {
  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1>Transactions</h1>
        </div>
        <AddItem title={"Add New Vendor"}>
          <VendorForm />
        </AddItem>
      </div>
    </div>
  );
};

export default Transactions;
