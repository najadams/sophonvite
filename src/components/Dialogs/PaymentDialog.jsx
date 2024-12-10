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
import { capitalizeFirstLetter, tableActions } from "../../config/Functions";
import { useSelector } from "react-redux";
import ReceiptDialog from "./ReceiptDialog";
import PaymentDisplayDialog from "./PaymentDisplayDialog";

const PaymentDialog = ({ open, onClose, selectedDebt, onSubmit }) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submittingView, setSubmittingView] = useState(false);
  const [paymentDisplayDialogOpen, setPaymentDisplayDialogOpen] =
    useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const calculateBalance = () => {
    return selectedDebt ? selectedDebt.amount - paymentAmount : 0;
  };

  const handlePayment = async () => {
    setSubmitting(true);
    await onSubmit(paymentAmount); // Call the parent function to handle payment
    setSubmitting(false);
    onClose();
    setPaymentAmount(0);
  };

  const handleViewReceipt = async () => {
    setSubmittingView(true);
    const  data = await tableActions.fetchReceiptsById({
      receiptId: selectedDebt?.id,
    });
    setReceiptData(data);
    setReceiptDialogOpen(true);
    setSubmittingView(false);
  };

  const handleViewPayment = async () => {
    setSubmittingView(true);
    const data = await tableActions.fetchPaymentsById({
      debtId: selectedDebt?.id,
    });
    console.log(data)
    setPaymentData(data);
    setPaymentDisplayDialogOpen(true); // Open the payment display dialog
    setSubmittingView(false);
  };

  const handleCloseReceiptDialog = () => {
    setReceiptDialogOpen(false);
    setReceiptData(null);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDisplayDialogOpen(false);
    setPaymentData(null);
  };

  return (
    <>
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
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <b>Customer:</b>{" "}
                {capitalizeFirstLetter(selectedDebt?.customerName)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                <b>Cashier:</b>{" "}
                {capitalizeFirstLetter(selectedDebt?.workerName)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                onClick={handleViewPayment}
                sx={{ color: "blue", textTransform: "capitalize" }}>
                View Payments
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                onClick={handleViewReceipt}
                sx={{ color: "blue", textTransform: "capitalize" }}>
                View Receipt
              </Button>
            </Grid>
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
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Amount Paid"
                type="number"
                fullWidth
                variant="standard"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
              />
            </Grid>
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "space-between", padding: "16px" }}>
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

      {/* Receipt Dialog */}
      {receiptData && (
        <ReceiptDialog
          open={receiptDialogOpen}
          onClose={handleCloseReceiptDialog}
          receiptData={receiptData}
        />
      )}

      {/* Payment Display Dialog */}
      {paymentData && (
        <PaymentDisplayDialog
          open={paymentDisplayDialogOpen}
          onClose={handleClosePaymentDialog}
          paymentData={paymentData}
          customerName={selectedDebt?.customerName}
        />
      )}
    </>
  );
};

export default PaymentDialog;
