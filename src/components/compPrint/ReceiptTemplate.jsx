import React from "react";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../config/Functions";

const ReceiptTemplate = React.forwardRef((props, ref) => {
  const { customerName, products, amountPaid, total, balance } = props;
  const company = useSelector((state) => state.companyState.data);

  return (
    <div ref={ref} style={{ fontFamily: "Arial, sans-serif", margin: 0 }}>
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
      <p style={{ textAlign: "left", marginTop: "30px", display:"flex" }}>
        <strong>Customer:</strong> <h5>{customerName}</h5>
      </p>
      <p>
        <strong>Cashier: </strong>
        {customerName}
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
                  padding: "5x",
                  textAlign: "center",
                }}>
                ₵{product.price.toFixed(2)}
              </td>
              <td
                style={{
                  padding: "5px",
                  textAlign: "center",
                }}>
                ₵{(product.price * product.quantity).toFixed(2)}
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
      <p style={{ textAlign: "right", marginTop: "20px" }}>
        <strong>
          Total: ₵
          {total}
        </strong>
      </p>
      <p style={{ textAlign: "right", marginTop: "20px" }}>
        <strong>Paid: ₵{amountPaid}</strong>
      </p>
      <p style={{ textAlign: "right", marginTop: "20px" }}>
        <strong>
          Balance: ₵
          {balance}
        </strong>
      </p>
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
