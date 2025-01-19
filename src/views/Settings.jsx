import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../config/Functions";
import { tableActions } from "../config/Functions";
import Loader from "../components/common/Loader";
import { useState } from "react";
import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useDispatch } from "react-redux";
import { ActionCreators } from "../actions/action";

const StyledField = styled(Field)({
  margin: "10px 0",
});

const Settings = () => {
  const company = useSelector((state) => state.companyState.data);
  const companyId = useSelector((state) => state.companyState.data.id);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const dispatch = useDispatch();

  const {
    data: workers,
    isLoading,
    error,
  } = useQuery(["api/workers", companyId], () =>
    tableActions.fetchWorkers(companyId)
  );

  const handleBlur = (event, setFieldValue) => {
    const { name, value } = event.target;
    setFieldValue(name, capitalizeFirstLetter(value));
  };

  const handleSnackbarClose = () => {
    setOpen(false);
    setSnackbarMessage("");
  };

  return (
    <ErrorBoundary>
      <div className="page">
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom>
            Settings
          </Typography>
          <Formik
            initialValues={{
              companyName: capitalizeFirstLetter(company.companyName) || "",
              email: company.email || "",
              contact: company.contact || "",
              momo: company.momo || "",
              address: company.address || "",
              paymentMethod: "",
              location: company.location || "",
              paymentProvider: "",
              currency: "cedis  ₵",
              tinNumber: company.tinNumber || "",
              taxRate: company.taxRate || "",
              taxId: company.taxId || "",
              emailNotifications: company.emailNotifications || true,
              smsNotifications: company.smsNotifications || false,
              currentPlan: company.currentPlan ||  "Standard",
              nextBillingDate: company.nextBillingDate ||  "2024-06-15",
            }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              setSubmitting(true);
              const processedValues = {
                ...values,
                companyName: values.companyName.trim().toLowerCase(),
                email: values.email.trim().toLowerCase(),
                contact: values.contact.trim(),
                momo: values.momo.trim().toLowerCase(),
                address: values.address.trim().toLowerCase(),
              };
              try {
                 const submissionData = { companyId, ...processedValues };
                await tableActions.updateCompanyData(
                  submissionData
                );
                dispatch(ActionCreators.fetchCompanySuccess({id : companyId, ...submissionData}))
                setSnackbarMessage("Company details updated successfully!");
                setOpen(true);
              } catch (error) {
                console.error(error);
                setErrors({
                  submit: error?.message?.data || "Failed to update company details. Please try again.",
                });
                setSnackbarMessage(
                  "Failed to update company details. Please try again."
                );
                setOpen(true);
              }
              setSubmitting(false);
            }}>
            {({ values, handleChange, setFieldValue, errors }) => (
              <Form>
                <Box mb={3}>
                  <Typography variant="h6">General Settings</Typography>
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="companyName"
                    label="Store Name"
                    variant="outlined"
                    value={values.companyName}
                    onChange={handleChange}
                    onBlur={(event) => handleBlur(event, setFieldValue)}
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="email"
                    label="Store Email"
                    variant="outlined"
                    value={values.email}
                    onChange={handleChange}
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="contact"
                    label="Store Phone"
                    variant="outlined"
                    value={values.contact}
                    onChange={handleChange}
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="momo"
                    label="Momo Number"
                    variant="outlined"
                    value={values.momo}
                    onChange={handleChange}
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="address"
                    label="Store Digital Address"
                    variant="outlined"
                    value={values.address}
                    onChange={handleChange}
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="location"
                    label="Store Location"
                    variant="outlined"
                    value={values.location}
                    onChange={handleChange}
                  />
                </Box>

                <Box mb={3} style={{ display: "none" }}>
                  <Typography variant="h6">Payment Settings</Typography>
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="paymentMethod"
                    label="Payment Method"
                    variant="outlined"
                    value={values.paymentMethod}
                    onChange={handleChange}
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="paymentProvider"
                    label="Payment Provider"
                    variant="outlined"
                    value={values.paymentProvider}
                    onChange={handleChange}
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="currency"
                    label="Currency"
                    variant="outlined"
                    value={values.currency}
                    onChange={handleChange}
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Tax Settings</Typography>
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="tinNumber"
                    label="Tin Number"
                    variant="outlined"
                    value={values.tinNumber}
                    onChange={handleChange}
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="taxRate"
                    label="Tax Rate (%)"
                    variant="outlined"
                    value={values.taxRate}
                    onChange={handleChange}
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="taxId"
                    label="Tax ID"
                    variant="outlined"
                    value={values.taxId}
                    onChange={handleChange}
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Subscription and Billing</Typography>
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="currentPlan"
                    label="Current Plan"
                    variant="outlined"
                    value={values.currentPlan}
                    onChange={handleChange}
                    disabled
                  />
                  <StyledField
                    as={TextField}
                    fullWidth
                    name="nextBillingDate"
                    label="Next Billing Date"
                    variant="outlined"
                    value={values.nextBillingDate}
                    onChange={handleChange}
                    disabled
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Store Settings</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        onClick={() => setOpen(true)}
                        fullWidth>
                        Manage Locations
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        onClick={() => setOpen(true)}
                        fullWidth>
                        Manage Employees
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Reports and Analytics</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        onClick={() => setOpen(true)}
                        fullWidth>
                        View Sales Reports
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        onClick={() => setOpen(true)}
                        fullWidth>
                        View Inventory Reports
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Support</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        onClick={() => setOpen(true)}
                        fullWidth>
                        Help Center
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        onClick={() => setOpen(true)}
                        fullWidth>
                        Contact Support
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Activity Log</Typography>
                  <TextField
                    fullWidth
                    label="Recent Activity"
                    variant="outlined"
                    value="Last Login: May 22, 2024, 10:00 AM"
                    disabled
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Notifications</Typography>
                  <TextField
                    fullWidth
                    label="System Update"
                    variant="outlined"
                    value="Scheduled for May 25, 2024"
                    disabled
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">Notification Settings</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="emailNotifications"
                        checked={values.emailNotifications}
                        onChange={handleChange}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="smsNotifications"
                        checked={values.smsNotifications}
                        onChange={handleChange}
                      />
                    }
                    label="SMS Notifications"
                  />
                </Box>

                <Box mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth>
                    Save Changes
                  </Button>
                  {errors.submit && (
                    <Typography color="error" variant="body2">
                      {errors.submit}
                    </Typography>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Container>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Settings;
