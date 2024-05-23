import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../config/Functions";
import { tableActions } from "../config/Functions";
import Loader from "../components/Loader";
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
  Snackbar
} from "@mui/material";
import { styled } from "@mui/system";

const StyledField = styled(Field)({
  margin: "10px 0",
});


const Settings = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const storename = useSelector((state) => state.companyState.data.name);
  const [open, setOpen] = useState(false);
  const {
    data: workers,
    isLoading,
    error,
  } = useQuery(["api/workers", companyId], () =>
    tableActions.fetchWorkers(companyId)
  );
  return (
    <div className="page">
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Formik
          initialValues={{
            // General Settings
            storeName: "",
            storeEmail: "",
            storePhone: "",
            storeAddress: "",
            // Payment Settings
            paymentMethod: "",
            paymentProvider: "",
            currency: "",
            // Tax Settings
            taxRate: "",
            taxId: "",
            // Notification Settings
            emailNotifications: true,
            smsNotifications: false,
            company: {
              email: "",
              businessName: "",
              businessAddress: "",
              taxId: "",
              currentPlan: "Standard",
              nextBillingDate: "2024-06-15",
            },
          }}
          onSubmit={(values) => {
            console.log(values);
          }}>
          {({ values, handleChange }) => (
            <Form>
              <Box mb={3}>
                <Typography variant="h6">General Settings</Typography>
                <StyledField
                  as={TextField}
                  fullWidth
                  name="storeName"
                  label="Store Name"
                  variant="outlined"
                  value={values.storeName}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="storeEmail"
                  label="Store Email"
                  variant="outlined"
                  value={values.storeEmail}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="storePhone"
                  label="Store Phone"
                  variant="outlined"
                  value={values.storePhone}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="storeAddress"
                  label="Store Address"
                  variant="outlined"
                  value={values.storeAddress}
                  onChange={handleChange}
                />
              </Box>

              <Box mb={3}>
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
                <Typography variant="h6">Business Information</Typography>
                <StyledField
                  as={TextField}
                  fullWidth
                  name="company.businessName"
                  label="Business Name"
                  variant="outlined"
                  value={capitalizeFirstLetter(values.company.businessName)}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="company.businessAddress"
                  label="Business Address"
                  variant="outlined"
                  value={values.company.businessAddress}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="company.taxId"
                  label="Tax ID"
                  variant="outlined"
                  value={values.company.taxId}
                  onChange={handleChange}
                />
              </Box>

              <Box mb={3}>
                <Typography variant="h6">Subscription and Billing</Typography>
                <StyledField
                  as={TextField}
                  fullWidth
                  name="company.currentPlan"
                  label="Current Plan"
                  variant="outlined"
                  value={values.company.currentPlan}
                  onChange={handleChange}
                  disabled
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="company.nextBillingDate"
                  label="Next Billing Date"
                  variant="outlined"
                  value={values.company.nextBillingDate}
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
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message={"Feature Not Implemented!"}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </div>
  );
};

export default Settings;
