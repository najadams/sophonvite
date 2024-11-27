import React from "react";
import { Card, Grid, Typography, Box } from "@mui/material";
import { TrendingUp, TrendingDown, AttachMoney } from "@mui/icons-material";
import {formatNumber} from '../../config/Functions'

const SummaryReport = ({ data }) => {
  const { totalSales, debtsPaid, debtsAcquired, dateRange } = data;


  return (
    <div className="content">
      {/* <Box
        sx={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}> */}
        {/* Header */}
        <Typography variant="h4" gutterBottom>
          Summary Report
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {dateRange}
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ marginTop: "20px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: "20px", textAlign: "center" }}>
              <TrendingUp color="success" fontSize="large" />
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4">${formatNumber(totalSales)}</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: "20px", textAlign: "center" }}>
              <AttachMoney color="primary" fontSize="large" />
              <Typography variant="h6">Debts Paid</Typography>
              <Typography variant="h4">${formatNumber(debtsPaid)}</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: "20px", textAlign: "center" }}>
              <TrendingDown color="error" fontSize="large" />
              <Typography variant="h6">Debts Acquired</Typography>
              <Typography variant="h4">
                ${formatNumber(debtsAcquired)}
              </Typography>
            </Card>
          </Grid>

          {/* Add more cards as needed */}
        </Grid>

        {/* Details Section */}
        <Box sx={{ marginTop: "30px" }}>
          <Typography variant="h5" gutterBottom>
            Breakdown
          </Typography>
          <Typography variant="body1" color="textSecondary">
            - Top-performing products or categories
            <br />
            - Percentage change in sales
            <br />- Etc.
          </Typography>
        </Box>
      {/* </Box> */}
    </div>
  );
};

export default SummaryReport;
