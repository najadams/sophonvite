import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../config/Functions";

const ReceiptTemplate = React.forwardRef((props, ref) => {
  const { customerName, products, amountPaid } = props;
  const company = useSelector((state) => state.companyState.data);

  useEffect(() => {
    console.log(company);
  }, [company]);

  return (
    <div ref={ref} style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}>
        <h4 style={{ fontSize: 20,fontFamily:"sans-serif"}}>{capitalizeFirstLetter(company.name)}</h4>
        {company.email && <h5>Email: {company.email}</h5>}
        {company.contact && <h5>Contact: {company.contact}</h5>}
        {company.momo && <h5>Momo: {company.momo}</h5>}
      </div>
      <p style={{ textAlign: "left", marginTop: "30px" }}>
        <strong>Customer:</strong> {customerName}
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
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Product
            </th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>
              Quantity
            </th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>Price</th>
            <th style={{ border: "1px solid #000", padding: "8px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {product.name}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "right",
                }}>
                {product.quantity}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "right",
                }}>
                ${product.price.toFixed(2)}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  textAlign: "right",
                }}>
                ${(product.price * product.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ textAlign: "right", marginTop: "20px" }}>
        <strong>Tax %: {company.taxRate}</strong>
      </p>
      <p style={{ textAlign: "right", marginTop: "20px" }}>
        <strong>Amount Paid: ${amountPaid}</strong>
      </p>
      <p style={{ textAlign: "right", marginTop: "20px" }}>
        <strong>
          Total: $
          {products
            .reduce((sum, product) => sum + product.price * product.quantity, 0)
            .toFixed(2)}
        </strong>
      </p>
    </div>
  );
});

export default ReceiptTemplate;
