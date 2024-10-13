// PaymentDialog.js

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Grid,
} from "@mui/material";
import { capitalizeFirstLetter } from "../../config/Functions";

const PaymentDialog = ({ open, onClose, selectedDebt, onSubmit }) => {
  const [paymentAmount, setPaymentAmount] = useState(0  );
  const [submitting, setSubmitting] = useState(false);

  const calculateBalance = () => {
    return selectedDebt ? selectedDebt.amount - paymentAmount : 0;
  };

  const handlePayment = async () => {
    setSubmitting(true);
    await onSubmit(paymentAmount); // Call the parent function to handle payment
    setSubmitting(false);
    onClose(); // Close the dialog after submission
    setPaymentAmount(0)
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="debt-payment-title"
      aria-describedby="debt-payment-description">
      <DialogTitle
        id="debt-payment-title"
        sx={{ background: "#00796B", color: "white", textAlign: "center" }}>
        Clear Customer Debt
      </DialogTitle>
      <DialogContent sx={{ padding: "34px" }}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Display Customer and Cashier Information */}
          <Grid item xs={6}>
            <Typography
              variant="body1"
              gutterBottom
              //   sx={{ fontWeight: "bold" }}
            >
              <b>Customer:</b>
              {capitalizeFirstLetter(selectedDebt?.customerName)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "bld" }}>
              <b>Cashier:</b> {capitalizeFirstLetter(selectedDebt?.workerName)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "bld" }}>
              <b>Number of Receipts:</b> {selectedDebt?.id}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              sx={{ color: "blue", textTransform: "capitalize" }}>
              View Receipt
            </Button>
          </Grid>
          {/* Display Amount Owed */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Amount Owed"
              type="number"
              fullWidth
              variant="standard"
              value={selectedDebt?.amount || 0}
              InputProps={{
                readOnly: true,
              }}
              //   sx={{ background: "#f0f0f0", borderRadius: 1 }}
            />
          </Grid>
          {/* Input for Amount Paid */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Amount Paid"
              type="number"
              fullWidth
              variant="standard"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              //   sx={{ background: "#f0f0f0", borderRadius: 1 }}
            />
          </Grid>
          {/* Display Balance */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Balance Left"
              type="number"
              fullWidth
              variant="standard"
              value={calculateBalance()}
              InputProps={{
                readOnly: true,
              }}
              //   sx={{ background: "#f0f0f0", borderRadius: 1 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", padding: "16px" }}>
        <Button onClick={onClose} variant="text" sx={{ color: "#00796B" }}>
          Cancel
        </Button>
        {submitting ? (
          <CircularProgress size={24} />
        ) : (
          <Button
            onClick={handlePayment}
            variant="contained"
            sx={{ background: "#00796B", color: "white" }}>
            Submit Payment
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
