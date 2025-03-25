import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Box, Grid, useTheme, useMediaQuery } from "@mui/material";
import SlidingCard from "../components/common/SlidingCard";
import { useQuery } from "react-query";
import { formatNumber, tableActions } from "../config/Functions";
import MyPie from "../utils/MyPie";
import Loader from "../components/common/Loader";
import {
  Bar,
  BarChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const DummyCard = ({ children, title, sx }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}>
    <Box
      sx={{
        width: "100%",
        height: "100%",
        margin: { xs: 0.5, sm: 1, md: 1.5 },
        ...sx,
      }}>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
          },
        }}>
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: "#333",
            }}>
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    </Box>
  </motion.div>
);

export const Widgets = ({ title, count }) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          },
        }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: "#666",
              }}>
              {title}
            </Typography>
            <IconButton
              onClick={toggleVisibility}
              sx={{
                height: 24,
                width: 24,
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}>
              {isVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#2196f3",
              textAlign: "center",
            }}>
            {isVisible ? count : "#".repeat(count.toString().length)}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const companyId = useSelector((state) => state.companyState.data?.id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: counts,
    isLoading: isCountsLoading,
    isError: isCountsError,
  } = useQuery(
    ["counts", companyId],
    () => tableActions.fetchCounts(companyId),
    {
      enabled: !!companyId,
    }
  );

  const {
    data: overall,
    isLoading: isOverallLoading,
    isError: isOverallError,
  } = useQuery(
    ["overall", companyId],
    () => tableActions.fetchSalesData(companyId),
    {
      enabled: !!companyId,
    }
  );

  const productCount = counts?.productCount || 0;
  const userCount = counts?.workerCount || 0;
  const customerCount = counts?.customerCount || 0;

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <div className="heading" style={{ background: "none" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            color: "#333",
            mb: 2,
          }}>
          Dashboard
        </Typography>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Widgets title="Sales" count={formatNumber(userCount)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Widgets title="Employees" count={formatNumber(userCount)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Widgets title="Products" count={formatNumber(productCount)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Widgets title="Customers" count={formatNumber(customerCount)} />
        </Grid>

        <Grid item xs={12} md={6}>
          <DummyCard title="Revenue">
            {isOverallLoading ? (
              <Loader type={2} />
            ) : isOverallError ? (
              <Typography>Error loading sales data</Typography>
            ) : overall?.sales.length === 0 ? (
              <Typography>No Sales made this month</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={overall.sales}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalSales"
                    stroke="#2196f3"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </DummyCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DummyCard title="Sales Profit">
            {isOverallLoading ? (
              <Loader type={2} />
            ) : isOverallError ? (
              <Typography>Error loading Revenue data</Typography>
            ) : overall?.profit.length === 0 ? (
              <Typography>No Revenue data available</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={overall.profit}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalProfit"
                    stroke="#4caf50"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </DummyCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <DummyCard title="Most Selling Products">
            {isOverallLoading ? (
              <Loader type={2} />
            ) : isOverallError ? (
              <Typography>Error loading product sales data</Typography>
            ) : overall?.topProductsByQuantity.length === 0 ? (
              <Typography>No product sales data available</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={overall.topProductsByQuantity}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="quantity" fill="#00caff" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </DummyCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DummyCard title="Top Profitable Products">
            {isOverallLoading ? (
              <Loader type={2} />
            ) : isOverallError ? (
              <Typography>Error loading product sales data</Typography>
            ) : overall?.topProductsByProfit.length === 0 ? (
              <Typography>No product sales data available</Typography>
            ) : (
              <MyPie
                data={overall.topProductsByProfit}
                dataKey="profit"
                nameKey="name"
              />
            )}
          </DummyCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DummyCard title="Top 10 Customers By Sale">
            {isOverallLoading ? (
              <Loader type={2} />
            ) : isOverallError ? (
              <Typography>Error loading customer data</Typography>
            ) : overall?.topCustomers.length === 0 ? (
              <Typography>No customer data available</Typography>
            ) : (
              <MyPie
                data={overall.topCustomers}
                dataKey="totalSales"
                nameKey="name"
              />
            )}
          </DummyCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SlidingCard />
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Dashboard;
