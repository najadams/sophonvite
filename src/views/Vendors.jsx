import React from "react";
import AddItem from "../hooks/AddItem";
import VendorForm from "../components/forms/VendorForm";
import UsersCard from "../components/UsersCard";

const Vendors = () => {
  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1 style={{fontWeight: 200}}>Vendors</h1>
        </div>
        <AddItem title={"Add New Vendor"}>
          <VendorForm />
        </AddItem>
      </div>
      <UsersCard name={"Najm Adams Lambon"} companyFrom={"coco"} />
    </div>
  );
};

export default Vendors;
