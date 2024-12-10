import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { capitalizeFirstLetter } from "../../config/Functions";
import { format } from "date-fns";

const PaymentDisplayDialog = ({ open, onClose, paymentData }) => {
  if (!paymentData) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Payments</DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ background: "#00796B", color: "white" }}>
        Payment Details
      </DialogTitle>
      <DialogContent>
        {paymentData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount Paid</TableCell>
                  <TableCell>Worker Name</TableCell>
                  <TableCell>Payment Method</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentData.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      {format(new Date(payment.date), "dd-MM-yyyy hh:mm a")}
                    </TableCell>
                    <TableCell>{payment.amountPaid}</TableCell>
                    <TableCell>{capitalizeFirstLetter(payment.workerName) || "N/A"}</TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No payments found.</Typography>
        )}
      </DialogContent>
      <Button onClick={onClose} variant="contained" sx={{ m: 2 }}>
        Close
      </Button>
    </Dialog>
  );
};

export default PaymentDisplayDialog;
