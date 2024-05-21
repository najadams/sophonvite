import React from 'react'
import AddItem from '../components/AddItem';
import VendorForm from '../components/VendorsForm';

const Vendors = () => {
  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1>Vendors</h1>
        </div>
        <AddItem>
          <VendorForm />
        </AddItem>
      </div>
    </div>
  );
}

export default Vendors