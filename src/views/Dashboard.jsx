import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import SlidingCard from "../components/SlidingCard";
import { useQuery } from "react-query";
import { tableActions } from "../config/Functions";
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


const DummyCard = ({ children, title, sx }) => {
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "400px", md: "500px" },
        height: { xs: "auto", sm: "400px" },
        margin: 2,
        flexGrow: 1,
        ...sx
      }}>
      <Card sx={{ width: "100%", height: "100%" }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
};

const Widgets = ({ title, count }) => {
  return (
    <Card
      sx={{
        width: { xs: "90px", sm: "120px", lg: "150px" },
        height: { xs: "auto", sm: "80px", lg: "100px" },
        // backgroundColor: "#c5c9d2",
        margin: 1,
        padding: 0,
      }}>
      <CardContent>
        <Typography variant="body" component="div">
          {title}
        </Typography>
        <Typography variant="h4">{count}</Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const companyId = useSelector((state) => state.companyState.data.id);

  // Fetch counts using react-query
  const { data: counts } = useQuery(["counts", companyId], () =>
    tableActions.fetchCounts(companyId)
  );
  const { data: overall, isLoading } = useQuery(["overall", companyId], () =>
    tableActions.fetchSalesData(companyId)
  );

  // Extract counts from the data
  const productCount = counts?.productCount || 0;
  const userCount = counts?.workerCount || 0;
  const customerCount = counts?.customerCount || 0;

  return (
    <div className="page">
      <div className="heading" style={{ background: "none" }}>
        <h1>Dashboard</h1>
      </div>

      <div className="content">
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            flexDirection: "row-reverse",
          }}>
          <Widgets title={"Employees"} count={userCount} />
          <Widgets title={"Products"} count={productCount} />
          <Widgets title={"Customers"} count={customerCount} />
        </div>

        <DummyCard title={"Overall Sales Analysis"}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : overall.sales.length === 0 ? (
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DummyCard>

        <DummyCard title={"Profit Analysis"}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : overall.profit.length === 0 ? (
            <Typography>No Profit data available</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={overall.profit}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalProfit"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DummyCard>

        <DummyCard
          title={"Most Selling Products"}
          sx={{ width: { xs: "100%", sm: "400px", md: "800px" } }}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : overall.topProducts.length === 0 ? (
            <Typography>No product sales data available</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={overall.topProducts}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </DummyCard>

        <DummyCard title={"Customer Analysis"} />
        <SlidingCard />
      </div>
    </div>
  );
};

export default Dashboard;