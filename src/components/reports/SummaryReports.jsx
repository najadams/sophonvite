import React from "react";
import {
  Card,
  Grid,
  Typography,
  Box,
  Divider,
  Paper,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assessment,
} from "@mui/icons-material";
import { formatNumber } from "../../config/Functions";

const SummaryReport = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    totalCashReceived,
    totalCashReceivedAmount,
    summary: { sales, debtPayments, debtsAcquired },
  } = data;
  const totalCash = totalCashReceivedAmount;

  return (
    <Box sx={{ p: { xs: 0.5, sm: 2 }, maxWidth: "100%", overflow: "hidden" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 3,
          backgroundColor: "#f8f9fa",
          maxWidth: "100%",
          overflow: "hidden",
        }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "#1a237e",
            mb: 2,
            fontSize: { xs: "1.25rem", sm: "1.75rem" },
          }}>
          Summary Report
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={{ xs: 1, sm: 1.5 }}>
          {/* Total Sales */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={2}
              sx={{
                p: { xs: 1.5, sm: 2 },
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                transition: "transform 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: 2,
                },
              }}>
              <Box
                sx={{
                  backgroundColor: "#e8f5e9",
                  borderRadius: "50%",
                  width: { xs: 40, sm: 45 },
                  height: { xs: 40, sm: 45 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}>
                <TrendingUp
                  color="success"
                  sx={{ fontSize: { xs: 20, sm: 24 } }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 0.5,
                  fontWeight: 500,
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                }}>
                Total Sales
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#2e7d32",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
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
                p: { xs: 1.5, sm: 2 },
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                transition: "transform 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: 2,
                },
              }}>
              <Box
                sx={{
                  backgroundColor: "#e3f2fd",
                  borderRadius: "50%",
                  width: { xs: 40, sm: 45 },
                  height: { xs: 40, sm: 45 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}>
                <AttachMoney
                  color="primary"
                  sx={{ fontSize: { xs: 20, sm: 24 } }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 0.5,
                  fontWeight: 500,
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                }}>
                Debt Payments
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1976d2",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
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
                p: { xs: 1.5, sm: 2 },
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                transition: "transform 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: 2,
                },
              }}>
              <Box
                sx={{
                  backgroundColor: "#ffebee",
                  borderRadius: "50%",
                  width: { xs: 40, sm: 45 },
                  height: { xs: 40, sm: 45 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}>
                <TrendingDown
                  color="error"
                  sx={{ fontSize: { xs: 20, sm: 24 } }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 0.5,
                  fontWeight: 500,
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                }}>
                Debts Acquired
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#d32f2f",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
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
                  p: { xs: 1.5, sm: 2 },
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  transition: "transform 0.2s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 2,
                  },
                }}>
                <Box
                  sx={{
                    backgroundColor: "#fff3e0",
                    borderRadius: "50%",
                    width: { xs: 40, sm: 45 },
                    height: { xs: 40, sm: 45 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                  }}>
                  <AttachMoney
                    color="secondary"
                    sx={{ fontSize: { xs: 20, sm: 24 } }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#666",
                    mb: 0.5,
                    fontWeight: 500,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  }}>
                  Cash Received
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#f57c00",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}>
                  {`₵${formatNumber(totalCash - sales.discounts)}`}
                </Typography>
              </Card>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Breakdown Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          backgroundColor: "#f8f9fa",
          maxWidth: "100%",
          overflow: "hidden",
        }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1a237e",
            mb: 2,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}>
          Breakdown
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid item xs={12} sm={6}>
            <Card
              elevation={2}
              sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: "8px" }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#1a237e",
                  mb: 1.5,
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}>
                Sales Breakdown
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Momo:</span>
                  <span style={{ fontWeight: 600, color: "#2e7d32" }}>
                    ₵{formatNumber(sales.momo)}
                  </span>
                </Typography>
                <Typography
                  variant="body2"
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
            <Card
              elevation={2}
              sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: "8px" }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#1a237e",
                  mb: 1.5,
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}>
                Debt Payments Breakdown
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Typography
                  variant="body2"
                  sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Momo:</span>
                  <span style={{ fontWeight: 600, color: "#1976d2" }}>
                    ₵{formatNumber(debtPayments.momo)}
                  </span>
                </Typography>
                <Typography
                  variant="body2"
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
