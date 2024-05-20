import React from "react";
import { useQuery } from "react-query";
import TableCreater from "../components/TableCreater";
import AddItem from "../components/AddItem";
import { useSelector } from "react-redux";
import CustomerForm from "../components/CustomerForm";
import { tableActions } from "../config/Functions";
import Loader from "../components/Loader";

const Customers = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery(["api/customers", companyId], () =>
    tableActions.fetchCustomers(companyId)
  );

  if (isLoading) return <Loader />;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1>Customers</h1>
        </div>
        <AddItem>
          <CustomerForm />
        </AddItem>
      </div>

      <div className="content">
        {customers.length > 0 ? (
          <TableCreater companyId={companyId} type="customers" />
        ) : (
          <div className="content">
            <h2>Add Customers to Get Started</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
