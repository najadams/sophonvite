import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { capitalizeFirstLetter } from "../../config/Functions";

const ReceiptTemplate = React.forwardRef((props, ref) => {
  const {
    customerName,
    products,
    amountPaid,
    total,
    balance,
    workerName,
    date,
    discount,
  } = props;
  const company = useSelector((state) => state.companyState.data);
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  useEffect(() => {
    console.log("coco")
    handlePrint();
  }, []);

  return (
    <div ref={printRef} style={{ fontFamily: "Arial, sans-serif", margin: 0 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}>
        <h4 style={{ fontSize: 20, fontFamily: "sans-serif" }}>
          {capitalizeFirstLetter(company.companyName)}
        </h4>
        {company.tinNumber && (
          <h5>Tin Number: {company.tinNumber.toUpperCase()}</h5>
        )}
        {company.contact && <h5>Contact: {company.contact}</h5>}
        {company.momo && <h5>Momo: {company.momo}</h5>}
        {/* {company.email && <h5>Email: {company.email}</h5>} */}
      </div>
      <p style={{ textAlign: "left", marginTop: "30px", display: "flex" }}>
        <strong>Customer:</strong> <h5>{customerName}</h5>
      </p>
      <p>
        <strong>Cashier: </strong>
        {capitalizeFirstLetter(workerName)}
      </p>
      <p>
        <strong>Date: </strong>
        {new Date(date).toLocaleDateString()} {/* Ensure only date is shown */}
      </p>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}>
        <thead>
          <tr>
            <th style={{ padding: "5px" }}>Qty</th>
            <th style={{ padding: "8px" }}>Product</th>
            <th style={{ padding: "5px" }}>Price</th>
            <th style={{ padding: "5px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td
                style={{
                  padding: "5px",
                  textAlign: "center",
                }}>
                {product.quantity}
              </td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                {product.name}
              </td>
              <td
                style={{
                  padding: "5px",
                  textAlign: "center",
                }}>
                ₵{product.price ? product.price : product.salesprice}
              </td>
              <td
                style={{
                  padding: "5px",
                  textAlign: "center",
                }}>
                ₵{product.price ? product.price * product.quantity : product.salesprice * product.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr style={{ height: 5, backgroundColor: "black" }} />
      {company.taxRate && (
        <p style={{ textAlign: "right", marginTop: "20px" }}>
          <strong>Tax %: {company.taxRate}</strong>
        </p>
      )}
      {discount !== undefined && discount !== null && (
        <p style={{ textAlign: "right", marginTop: "20px" }}>
          <strong>Discount: ₵{discount}</strong>
        </p>
      )}
      <p style={{ textAlign: "right", marginTop: "20px" }}>
        <strong>Total: ₵{total}</strong>
      </p>
      <p style={{ textAlign: "right", marginTop: "20px" }}>
        <strong>Paid: ₵{amountPaid}</strong>
      </p>
      {balance !== undefined && balance !== null && balance !== 0 && (
        <p style={{ textAlign: "right", marginTop: "20px" }}>
          <strong>Balance: ₵{balance}</strong>
        </p>
      )}
      <hr style={{ height: 5, backgroundColor: "black" }} />
      <div
        style={{
          paddingTop: 5,
          marginBottom: 35,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}>
        Goods Sold Are Not Returnable
        <br />
        <h4>Thanks for shopping with us</h4>
      </div>
    </div>
  );
});

export default ReceiptTemplate;
