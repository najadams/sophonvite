import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
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
  Pie,
  PieChart,
} from "recharts";

const DummyCard = ({ children, title, sx }) => (
  <Box
    sx={{
      width: { xs: "100%", sm: "400px", md: "450px" },
      height: { xs: "auto", sm: "400px" },
      margin: {xs : .4, sm : .5, md: .5, lg: .7},
      flexGrow: 1,
      ...sx,
    }}>
    <Card sx={{ width: "100%", height: "100%" ,margin:0, padding: 0}}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  </Box>
);

export const Widgets = ({ title, count }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Card
      sx={{
        width: { xs: "45%", sm: "23%", mymd: "23%",md: "23%", lg: "272px" },
        height: { xs: "90px", sm: "auto",md: "90px", lg: "100px" },
        margin: 1,
        padding: 0,
      }}>
      <CardContent>
        <span style={{ display: "flex", gap: 10 }}>
          <Typography variant="body" component="div">
            {title}
          </Typography>
          <IconButton sx={{ height: 10, width: 10 }} onClick={toggleVisibility}>
            {isVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </span>
        <Typography variant="h4">
          {isVisible ? count : "#".repeat(count.toString().length)}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const companyId = useSelector((state) => state.companyState.data?.id);

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
    <div className="page">
      <div className="heading" style={{ background: "none" }}>
        <h1 style={{ fontWeight: 200 }}>Dashboard</h1>
      </div>

      <div className="content">
        <div className="widgets">
          <Widgets title={"Sales "} count={formatNumber(userCount)} />
          <Widgets title={"Employees"} count={formatNumber(userCount)} />
          <Widgets title={"Products"} count={formatNumber(productCount)} />
          <Widgets title={"Customers"} count={formatNumber(customerCount)} />
        </div>

        <DummyCard title={"Revenue"}>
          {isOverallLoading ? (
            <Loader type={2}/>
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

        <DummyCard title={"Sales Profit"}>
          {isOverallLoading ? (
            <Loader type={2}/>
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
          sx={{ width: { xs: "100%", sm: "300px", md: "600px" } }}>
          {isOverallLoading ? (
            <Loader type={2}/>
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#00caff" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </DummyCard>

        <DummyCard
          title={"Top Profitable Products"}
          sx={{ width: { xs: "100%", sm: "300px" ,md: '420px'} }}>
          {isOverallLoading ? (
            <Loader type={2}/>
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

        <DummyCard
          title={"Top 10 Customers By Sale"}
          sx={{ width: { xs: "100%", sm: "300px", md: "420px" } }}>
          {isOverallLoading ? (
            <Loader type={2}/>
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

        <DummyCard title={"Cookie"} />
        <SlidingCard />
      </div>
    </div>
  );
};

export default Dashboard;
