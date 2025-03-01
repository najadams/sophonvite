import { Card, Typography, Grid, Divider } from "@mui/material";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import { capitalizeFirstLetter } from "../config/Functions";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const ViewReceipt = () => {
  const company = useSelector((state) => state.companyState.data);
  const location = useLocation();
  const { row } = location.state || {}; // Destructure row from location.state

  // Ensure that row exists before proceeding
  if (!row) {
    return <Typography variant="h6">No receipt details available</Typography>;
  }

  const {
    customerName,
     customerCompany,
    detail,
    amountPaid,
    total,
    balance,
    workerName,
    date,
    discount,
  } = row; // Destructure the receipt data from row

  // Define colors
  const primaryColor = "#00796B"; // A pleasant greenish-blue color
const secondaryColor = "#004D40"; // Darker shade for contrast
//   const primaryColor = "#1976d2 ";
//   const secondaryColor = "#1976d2 "; // Darker shade for contrast

  return (
    <div className="page">
      <Card
        style={{
          padding: "20px",
          backgroundColor: "#E0F2F1", // Light shade of green
          borderRadius: "10px",
          //   maxWidth: "60  0px",
          margin: "0 auto",
          fontFamily: "'Roboto', sans-serif", // Modern font family
        }}>
        {/* Company Info */}
        <Typography
          variant="h4"
          style={{
            textAlign: "center",
            color: primaryColor,
            fontWeight: "bold",
            marginBottom: "10px",
          }}>
          {capitalizeFirstLetter(company?.companyName)}
        </Typography>

        {company?.tinNumber && (
          <Typography variant="body1" align="center" color="textSecondary">
            Tin Number: {company.tinNumber.toUpperCase()}
          </Typography>
        )}

        {company?.contact && (
          <Typography variant="body1" align="center" color="textSecondary">
            Contact: {company.contact}
          </Typography>
        )}

        {company?.momo && (
          <Typography variant="body1" align="center" color="textSecondary">
            Momo: {company.momo}
          </Typography>
        )}

        <Divider
          style={{ margin: "20px 0", backgroundColor: secondaryColor }}
        />

        {/* Customer Info */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={4}>
            <Typography variant="subtitle1" color={primaryColor}>
              Customer:
            </Typography>
            <Typography variant="body1">
              {capitalizeFirstLetter(customerName)} - {capitalizeFirstLetter(customerCompany)} 
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            <Typography variant="subtitle1" color={primaryColor}>
              Cashier:
            </Typography>
            <Typography variant="body1">
              {capitalizeFirstLetter(workerName)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle1" color={primaryColor}>
              Date:
            </Typography>
            <Typography variant="body1">
              {format(new Date(date), "dd/MM/yyyy")}
              {/* Format date */}
            </Typography>
          </Grid>
        </Grid>

        <Divider
          style={{ margin: "20px 0", backgroundColor: secondaryColor }}
        />

        {/* Products Info */}
        <Typography
          variant="h5"
          style={{
            textAlign: "center",
            color: primaryColor,
            marginBottom: "10px",
          }}>
          Purchased Products
        </Typography>

        <table style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: secondaryColor, color: "white" }}>
              <th style={{ padding: "10px" }}>Qty</th>
              <th style={{ padding: "10px" }}>Product</th>
              <th style={{ padding: "10px" }}>Price</th>
              <th style={{ padding: "10px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {detail.map((product, index) => (
              <tr key={index} style={{ textAlign: "center" }}>
                <td style={{ padding: "8px" }}>{product.quantity}</td>
                <td style={{ padding: "8px" }}>
                  {capitalizeFirstLetter(product.name)}
                </td>
                <td style={{ padding: "8px" }}>
                  ₵{product.price || product.salesPrice}
                </td>
                <td style={{ padding: "8px" }}>
                  ₵
                  {product.price
                    ? Math.ceil(product.price * product.quantity)
                    : Math.ceil(product.salesPrice * product.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Info */}
        <Divider
          style={{ margin: "20px 0", backgroundColor: secondaryColor }}
        />

        <Grid container spacing={2}>
          {company.taxRate && (
            <Grid item xs={6}>
              <Typography variant="subtitle1" color={primaryColor}>
                Tax (%):
              </Typography>
              <Typography variant="body1">{company.taxRate}</Typography>
            </Grid>
          )}
          {discount !== undefined && discount !== null && discount !== 0 && (
            <Grid item xs={6}>
              <Typography variant="subtitle1" color={primaryColor}>
                Discount:
              </Typography>
              <Typography variant="body1">₵{discount}</Typography>
            </Grid>
          )}
          <Grid item xs={6}>
            <Typography variant="subtitle1" color={primaryColor}>
              Total:
            </Typography>
            <Typography variant="body1">₵{total}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color={primaryColor}>
              Paid:
            </Typography>
            <Typography variant="body1">₵{amountPaid}</Typography>
          </Grid>
          {balance !== undefined && balance !== null && balance !== 0 && (
            <Grid item xs={6}>
              <Typography variant="subtitle1" color={primaryColor}>
                Balance:
              </Typography>
              <Typography variant="body1">₵{balance}</Typography>
            </Grid>
          )}
        </Grid>

        <Divider
          style={{ margin: "20px 0", backgroundColor: secondaryColor }}
        />

        {/* Footer Message */}
        <Typography
          variant="body2"
          style={{
            textAlign: "center",
            color: secondaryColor,
            marginTop: "10px",
          }}>
          Goods Sold Are Not Returnable
        </Typography>
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            color: primaryColor,
            fontWeight: "bold",
            marginTop: "10px",
          }}>
          Thank you for shopping with us!
        </Typography>
      </Card>
    </div>
  );
};

export default ViewReceipt;
