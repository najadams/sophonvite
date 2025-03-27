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
  Box,
} from "@mui/material";
import { capitalizeFirstLetter, tableActions } from "../../config/Functions";
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
    await onSubmit(paymentAmount);
    setSubmitting(false);
    onClose();
    setPaymentAmount(0);
  };

  const handleViewReceipt = async () => {
    setSubmittingView(true);
    const data = await tableActions.fetchReceiptsById({
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
    setPaymentData(data);
    setPaymentDisplayDialogOpen(true);
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
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          },
        }}>
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #00796B 0%, #009688 100%)",
            color: "white",
            textAlign: "center",
            py: 2,
            "& .MuiTypography-root": {
              fontSize: "1.5rem",
              fontWeight: 600,
            },
          }}>
          Clear Customer Debt
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e9ecef",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#00796B",
                    bgcolor: "#f0f7f5",
                  },
                }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}>
                  Customer
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#2c3e50" }}>
                  {selectedDebt?.customerCompany !== "NoCompany" ? (
                    capitalizeFirstLetter(
                      `${selectedDebt?.customerName} - ${selectedDebt?.customerCompany}`
                    )
                  ) : (
                    capitalizeFirstLetter(selectedDebt?.customerName)
                  )}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e9ecef",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#00796B",
                    bgcolor: "#f0f7f5",
                  },
                }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}>
                  Cashier
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#2c3e50" }}>
                  {capitalizeFirstLetter(selectedDebt?.workerName)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                onClick={handleViewPayment}
                startIcon={
                  <i
                    className="bx bx-history"
                    style={{ fontSize: "1.2rem" }}></i>
                }
                sx={{
                  color: "#00796B",
                  borderColor: "#00796B",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#00796B",
                    bgcolor: "rgba(0, 121, 107, 0.04)",
                  },
                }}>
                View Payments
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                onClick={handleViewReceipt}
                startIcon={
                  <i
                    className="bx bx-receipt"
                    style={{ fontSize: "1.2rem" }}></i>
                }
                sx={{
                  color: "#00796B",
                  borderColor: "#00796B",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#00796B",
                    bgcolor: "rgba(0, 121, 107, 0.04)",
                  },
                }}>
                View Receipt
              </Button>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Amount Owed"
                type="number"
                fullWidth
                variant="outlined"
                value={selectedDebt?.amount || 0}
                InputProps={{
                  readOnly: true,
                  sx: {
                    bgcolor: "#f8f9fa",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e9ecef",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Amount Paid"
                type="number"
                fullWidth
                variant="outlined"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                InputProps={{
                  sx: {
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#00796B",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#00796B",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Balance Left"
                type="number"
                fullWidth
                variant="outlined"
                value={calculateBalance()}
                InputProps={{
                  readOnly: true,
                  sx: {
                    bgcolor: "#f8f9fa",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e9ecef",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            justifyContent: "space-between",
            borderTop: "1px solid #e9ecef",
          }}>
          <Button
            onClick={onClose}
            variant="text"
            sx={{
              color: "#666",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}>
            Cancel
          </Button>
          {submitting ? (
            <CircularProgress size={24} sx={{ color: "#00796B" }} />
          ) : (
            <Button
              onClick={handlePayment}
              variant="contained"
              startIcon={
                <i className="bx bx-check" style={{ fontSize: "1.2rem" }}></i>
              }
              sx={{
                bgcolor: "#00796B",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                "&:hover": {
                  bgcolor: "#00695C",
                },
              }}>
              Submit Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {receiptData && (
        <ReceiptDialog
          open={receiptDialogOpen}
          onClose={handleCloseReceiptDialog}
          receiptData={receiptData}
        />
      )}

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
