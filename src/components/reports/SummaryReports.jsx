import React from "react";
import { Card, Grid, Typography, Box, Divider } from "@mui/material";
import { TrendingUp, TrendingDown, AttachMoney } from "@mui/icons-material";
import { formatNumber } from "../../config/Functions";

const SummaryReport = ({ data }) => {
  const {
    totalCashReceived,
    totalCashReceivedAmount,
    summary: { sales, debtPayments, debtsAcquired },
  } = data;
  // const totalCash = totalCashReceived?.cash + totalCashReceived?.momo;
  const totalCash = totalCashReceivedAmount

// 
  return (
    <div className="content">
      <Typography variant="h4" gutterBottom>
        Summary Report
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        {/* Total Sales */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#e8f5e9",
              borderRadius: "8px",
            }}>
            <TrendingUp color="success" fontSize="large" />
            <Typography variant="h6" mt={1}>
              Total Sales
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              ₵{formatNumber(sales.totalSales)}
            </Typography>
          </Card>
        </Grid>

        {/* Total Debt Payments */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
            }}>
            <AttachMoney color="primary" fontSize="large" />
            <Typography variant="h6" mt={1}>
              Total Debt Payments
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              ₵{formatNumber(debtPayments.totalPaid)}
            </Typography>
          </Card>
        </Grid>

        {/* Total Debts Acquired */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#ffebee",
              borderRadius: "8px",
            }}>
            <TrendingDown color="error" fontSize="large" />
            <Typography variant="h6" mt={1}>
              Debts Acquired
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              ₵{formatNumber(debtsAcquired.totalDebts)}
            </Typography>
          </Card>
        </Grid>

        {/* Total Cash Received */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#fff3e0",
              borderRadius: "8px",
            }}>
            <AttachMoney color="secondary" fontSize="large" />
            <Typography variant="h6" mt={1}>
              Total Cash Received
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {/* Momo: ${formatNumber(totalCashReceived.momo)} <br />
              Cash: ${formatNumber(totalCashReceived.cash)} */}
              ₵{formatNumber(totalCash)}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Breakdown Section */}
      <Typography variant="h5" fontWeight="bold" mt={4} gutterBottom>
        Breakdown
      </Typography>
      <Divider sx={{ marginBottom: "20px" }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Sales Breakdown:</strong> <br />
            Momo: ₵{formatNumber(sales.momo)} <br />
            Cash: ₵{formatNumber(sales.cash)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Debt Payments Breakdown:</strong> <br />
            Momo: ₵{formatNumber(debtPayments.momo)} <br />
            Cash: ₵{formatNumber(debtPayments.cash)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default SummaryReport;
