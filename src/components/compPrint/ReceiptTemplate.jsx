import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { capitalizeFirstLetter } from "../../config/Functions";
import { Receipt } from "@mui/icons-material";

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
    handlePrint();
  }, []);

  return (
    <div ref={printRef} style={{ fontFamily: "monospace", margin: 0 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: 3,
        }}>
        <h4 style={{ fontSize: 20, fontFamily: "sans-serif" }}>
          {capitalizeFirstLetter(company.companyName)}!
        </h4>
        {/* {company.tinNumber && (
          <h5>Tin Number: {company.tinNumber.toUpperCase()}</h5>
        )} */}
        {company.contact && <h4>Contact: {company.contact}</h4>}
        {company.momo && <h4>Momo: {company.momo}</h4>}
        {/* {company.email && <h5>Email: {company.email}</h5>} */}
      </div>
      {<p style={{ textAlign: "left", marginTop: "30px", display: "flex" }}>
        <strong>Customer:</strong> <strong>{capitalizeFirstLetter(customerName)}</strong>
      </p>}
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
          marginTop: "10px",
        }}>
        <thead>
          <tr>
            <th style={{ padding: "5px", font: "icon", border: '1px solid' }}>Qty</th>
            <th style={{ padding: "8px", font: "icon", border: '1px solid' }}>Product</th>
            <th style={{ padding: "5px", font: "icon", border: '1px solid' }}>Price</th>
            <th style={{ padding: "5px", font: "icon", border: '1px solid' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} style={{font: 'revert'}}>
              <td
                style={{
                  margin: "2px",
                  textAlign: "center",
                  border: '0.3px solid'
                }}>
                {product.quantity}
              </td>
              <td style={{ padding: "5px", textAlign: "center", border: '1px solid'}}>
                {capitalizeFirstLetter(product.name)}
              </td>
              <td
                style={{
                  margin: "2px",
                  textAlign: "center",
                  border: '0.3px solid'
                }}>
                ₵{product.price ? product.price : product.salesPrice}
              </td>
              <td
                style={{
                  margin: "2px",
                  textAlign: "center",
                  border: '0.3px solid'
                }}>
                ₵
                {product.price
                  ? Math.ceil(product.price * product.quantity)
                  : Math.ceil(product.salesPrice * product.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr style={{ height: 5, backgroundColor: "black" }} />
      <div style={{ fontSize: 15 }}>
        {/* {company.taxRate && (
          <p style={{ textAlign: "left", marginTop: "10px" }}>
            <strong>Tax %: {company.taxRate}</strong>
          </p>
        )} */}
        {discount !== undefined && discount !== null && discount !== 0 && (
          <p style={{ textAlign: "left", marginTop: "10px" }}>
            <strong>Discount: ₵{discount}</strong>
          </p>
        )}
        <p style={{ textAlign: "left", marginTop: "10px" }}>
          <strong>Total: ₵{total}</strong>
        </p>
        <p style={{ textAlign: "left", marginTop: "10px" }}>
          <strong>Paid: ₵{amountPaid}</strong>
        </p>
        {balance !== undefined && balance !== null && balance !== 0 && (
          <p style={{ textAlign: "left", marginTop: "10px" }}>
            <strong>Balance: ₵{balance}</strong>
          </p>
        )}
      </div>
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
