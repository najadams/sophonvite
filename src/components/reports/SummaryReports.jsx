import React from "react";
import {
  Card,
  Grid,
  Typography,
  Box,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assessment,
} from "@mui/icons-material";
import { formatNumber } from "../../config/Functions";

const SummaryReport = ({ data }) => {
  const {
    totalCashReceived,
    totalCashReceivedAmount,
    summary: { sales, debtPayments, debtsAcquired },
  } = data;
  const totalCash = totalCashReceivedAmount;

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: "#f8f9fa" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "#1a237e",
            mb: 3,
          }}>
          Summary Report
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={2}>
          {/* Total Sales */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 3,
                },
              }}>
              <Box
                sx={{
                  backgroundColor: "#e8f5e9",
                  borderRadius: "50%",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                }}>
                <TrendingUp color="success" sx={{ fontSize: 30 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 1,
                  fontWeight: 500,
                }}>
                Total Sales
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#2e7d32",
                }}>
                ₵{`${formatNumber(sales.totalSales)}`}
              </Typography>
            </Card>
          </Grid>

          {/* Total Debt Payments */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 3,
                },
              }}>
              <Box
                sx={{
                  backgroundColor: "#e3f2fd",
                  borderRadius: "50%",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                <AttachMoney color="primary" sx={{ fontSize: 30 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 1,
                  fontWeight: 500,
                }}>
                Debt Payments
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                }}>
                ₵{formatNumber(debtPayments.totalPaid)}
              </Typography>
            </Card>
          </Grid>

          {/* Total Debts Acquired */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 3,
                },
              }}>
              <Box
                sx={{
                  backgroundColor: "#ffebee",
                  borderRadius: "50%",
                  width: 60,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                <TrendingDown color="error" sx={{ fontSize: 30 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 1,
                  fontWeight: 500,
                }}>
                Debts Acquired
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#d32f2f",
                }}>
                ₵{formatNumber(debtsAcquired.totalDebts)}
              </Typography>
            </Card>
          </Grid>

          {/* Total Cash Received */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip
              title={`Subtracted Discounts: ₵${formatNumber(sales.discounts)}`}
              arrow
              placement="top">
              <Card
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 3,
                  },
                }}>
                <Box
                  sx={{
                    backgroundColor: "#fff3e0",
                    borderRadius: "50%",
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                  <AttachMoney color="secondary" sx={{ fontSize: 30 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#666",
                    mb: 1,
                    fontWeight: 500,
                  }}>
                  Cash Received
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#f57c00",
                  }}>
                  {`₵${formatNumber(totalCash - sales.discounts)}`}
                </Typography>
              </Card>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Breakdown Section */}
      <Paper elevation={0} sx={{ p: 3, backgroundColor: "#f8f9fa" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1a237e",
            mb: 3,
          }}>
          Breakdown
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card elevation={2} sx={{ p: 3, borderRadius: "12px" }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#1a237e",
                  mb: 2,
                  fontWeight: 600,
                }}>
                Sales Breakdown
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Momo:</span>
                  <span style={{ fontWeight: 600, color: "#2e7d32" }}>
                    ₵{formatNumber(sales.momo)}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Cash:</span>
                  <span style={{ fontWeight: 600, color: "#2e7d32" }}>
                    ₵{formatNumber(sales.cash)}
                  </span>
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={2} sx={{ p: 3, borderRadius: "12px" }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#1a237e",
                  mb: 2,
                  fontWeight: 600,
                }}>
                Debt Payments Breakdown
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Momo:</span>
                  <span style={{ fontWeight: 600, color: "#1976d2" }}>
                    ₵{formatNumber(debtPayments.momo)}
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Cash:</span>
                  <span style={{ fontWeight: 600, color: "#1976d2" }}>
                    ₵{formatNumber(debtPayments.cash)}
                  </span>
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SummaryReport;
