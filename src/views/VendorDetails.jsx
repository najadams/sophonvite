import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { tableActions } from "../config/Functions";

const VendorDetails = () => {
    console.log("first")
  const { vendorId } = useParams(); // Extract the vendorId from the URL

  // Fetch detailed vendor information
  const {
    data: vendor,
    isLoading,
    isError,
    error,
  } = useQuery(["fetchVendorDetails", vendorId], () =>
    tableActions.fetchSupplierDetails(vendorId)
  );

  if (isLoading) {
    return <div>Loading vendor details...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="content">
      <div className="vendor-details">
        <h1>{vendor.supplierName}</h1>

        {/* Basic Supplier Information */}
        <section className="vendor-section">
          <h2>Basic Supplier Information</h2>
          <p>
            <strong>Company:</strong> {vendor.companyName}
          </p>
          <p>
            <strong>Contact:</strong> {vendor.contact}
          </p>
          <p>
            <strong>Email:</strong> {vendor.email}
          </p>
          <p>
            <strong>Phone:</strong> {vendor.phone}
          </p>
        </section>

        {/* Order and Transaction History */}
        <section className="vendor-section">
          <h2>Order and Transaction History</h2>
          <p>
            <strong>Total Orders:</strong> {vendor.totalOrders}
          </p>
          <p>
            <strong>Last Order Date:</strong> {vendor.lastOrderDate}
          </p>
          <p>
            <strong>Total Amount Spent:</strong> ${vendor.totalSpent}
          </p>
        </section>

        {/* Financial Information */}
        <section className="vendor-section">
          <h2>Financial Information</h2>
          <p>
            <strong>Outstanding Debt:</strong> ${vendor.outstandingDebt}
          </p>
          <p>
            <strong>Payment Terms:</strong> {vendor.paymentTerms}
          </p>
        </section>

        {/* Product/Service Information */}
        <section className="vendor-section">
          <h2>Products/Services Provided</h2>
          <ul>
            {vendor.products.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        </section>

        {/* Supplier Performance Metrics */}
        <section className="vendor-section">
          <h2>Supplier Performance</h2>
          <p>
            <strong>Delivery Accuracy:</strong> {vendor.deliveryAccuracy}%
          </p>
          <p>
            <strong>Quality Rating:</strong> {vendor.qualityRating}/10
          </p>
        </section>
      </div>
    </div>
  );
};

export default VendorDetails;
