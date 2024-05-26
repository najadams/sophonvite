import React from "react";

const ReceiptTemplate = React.forwardRef((props, ref) => {
    const { customerName, products } = props;

  return (
    <div ref={ref} style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Receipt</h2>
      <p>
        <strong>Customer Name:</strong> {customerName}
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
