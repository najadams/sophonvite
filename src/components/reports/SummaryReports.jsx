import React from "react";
import { Card, Grid, Typography, Box, Divider } from "@mui/material";
import { TrendingUp, TrendingDown, AttachMoney } from "@mui/icons-material";
import { formatNumber } from "../../config/Functions";

const SummaryReport = ({ data }) => {
  const { totalSales, debtsPaid, debtsAcquired, dateRange } = data;

  return (
    <div
      className="content"
      sx={{ padding: "10px", backgroundColor: "#f4f5f7" }}>
      <Typography variant="h4" gutterBottom>
        Summary Report
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ marginTop: "0px" }}>
        {/* Total Sales */}
        <Grid item xs={6} sm={6} md={3}>
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
              ${formatNumber(totalSales)}
            </Typography>
          </Card>
        </Grid>

        {/* Debts Paid */}
        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
            }}>
            <AttachMoney color="primary" fontSize="large" />
            <Typography variant="h6" mt={1}>
              Debts Paid
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              ${formatNumber(debtsPaid)}
            </Typography>
          </Card>
        </Grid>

        {/* Debts Acquired */}
        <Grid item xs={6} sm={6} md={3}>
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
              ${formatNumber(debtsAcquired)}
            </Typography>
          </Card>
        </Grid>

        {/* Placeholder for additional metrics */}
        <Grid item xs={6} sm={6} md={3}>
          <Card
            sx={{
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#f3e5f5",
              borderRadius: "8px",
            }}>
            <TrendingDown color="error" fontSize="large" />
            <Typography variant="h6" mt={1}>
              Additional Metric
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              Coming Soon
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* <Box
        sx={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}> */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Breakdown
      </Typography>
      <Divider sx={{ marginBottom: "20px" }} />
      <Typography variant="body1" color="textSecondary" mb={2}>
        - **Top-performing products or categories**: Highlight items driving the
        most sales.
        <br />
        - **Percentage change in sales**: Visualize trends compared to previous
        periods.
        <br />- **Other Insights**: Add more data points or insights as
        needed.l;ask'dfl
        <br />
        - **Percentage change in sales**: Visualize trends compared to previous
        periods.
        <br />- **Other Insights**: Add more data points or insights as
        needed.l;ask'dfl
        <br />
        - **Percentage change in sales**: Visualize trends compared to previous
        periods.
        <br />- **Other Insights**: Add more data points or insights as
        needed.l;ask'dfl
        <br />
        - **Percentage change in sales**: Visualize trends compared to previous
        periods.
        <br />- **Other Insights**: Add more data points or insights as
        needed.l;ask'dfl
      </Typography>
      {/* </Box> */}
    </div>
  );
};

export default SummaryReport;
