import React from "react";
import {
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const useStyles = makeStyles((theme) => ({
//   card: {
//     minWidth: 200,
//     margin: theme.spacing(2),
//   },
// }));

const SummaryCards = ({ salesData }) => {
  // const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Card >
          <CardContent>
            <Typography variant="h6">Total Sales</Typography>
            <Typography variant="h4">₵{salesData.totalSales}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card >
          <CardContent>
            <Typography variant="h6">Total Discounts</Typography>
            <Typography variant="h4">₵{salesData.totalDiscounts}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card >
          <CardContent>
            <Typography variant="h6">Total Amount Paid</Typography>
            <Typography variant="h4">₵{salesData.totalAmountPaid}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card >
          <CardContent>
            <Typography variant="h6">Total Balance</Typography>
            <Typography variant="h4">₵{salesData.totalBalance}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const SalesTable = ({ salesTransactions }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Transaction ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Total Amount</TableCell>
            <TableCell align="right">Discount</TableCell>
            <TableCell align="right">Amount Paid</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesTransactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">₵{transaction.total}</TableCell>
              <TableCell align="right">₵{transaction.discount}</TableCell>
              <TableCell align="right">₵{transaction.amountPaid}</TableCell>
              <TableCell align="right">₵{transaction.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const SalesChart = ({ salesData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const SalesReport = ({ salesData, salesTransactions }) => {
  return (
    <div className="content">
      <Typography variant="h4" gutterBottom>
        Sales Report
      </Typography>
      <SummaryCards salesData={salesData} />
      <SalesChart salesData={salesTransactions} />
      <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
        Sales Transactions
      </Typography>
      <SalesTable salesTransactions={salesTransactions} />
    </div>
  );
};

export default SalesReport;
