import React from "react";
import AddItem from "../hooks/AddItem";
import VendorForm from "../components/forms/VendorForm";
import UsersCard from "../components/UsersCard";
import { useQuery } from "react-query";
import { tableActions } from "../config/Functions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // For navigation
import Loader from "../components/common/Loader";

const Vendors = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const navigate = useNavigate();

  // Fetching vendors data from the server
  const {
    data: vendors,
    isLoading,
    isError,
    error,
  } = useQuery(["fetchVendors", companyId], () =>
    tableActions.fetchSuppliers(companyId)
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div className="content">Error: {error.message}</div>;
  }

  const handleCardClick = (vendorId) => {
    // Navigate to the vendor details page with the vendor's ID
    console.log(vendorId)
    navigate(`/vendors/${vendorId}`);
  };

  return (
    <div className="page">
      <div className="heading">
        <h1 style={{ fontWeight: 200 }}>Vendors</h1>
        <AddItem title={"Add New Vendor"}>
          <VendorForm />
        </AddItem>
      </div>

      <div className="vendors-list">
        {vendors && vendors.length > 0 ? (
          vendors.map((vendor) => (
            <UsersCard
              key={vendor.id}
              main={vendor.supplierName}
              sub={vendor.companyName}
              contact={`0${vendor.contact}`}
              onClick={() => handleCardClick(vendor._id)} // Navigate on card click
            />
          ))
        ) : (
          <div>No vendors found.</div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
