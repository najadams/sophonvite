import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../config/Functions";
import { tableActions } from "../config/Functions";
import Loader from "../components/Loader";
// src/views/Settings.js
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
} from "@mui/material";
import { styled } from "@mui/system";

const StyledField = styled(Field)({
  margin: "10px 0",
});

const WorkerInfo = ({ workers }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Workers Information
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {workers.length > 0 ? (
        workers.map((worker) => (
          <Grid container spacing={3} key={worker._id}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Name:</strong> {capitalizeFirstLetter(worker.name)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Username:</strong> {worker.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Contact:</strong> {worker.contact}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Admin Status:</strong>{" "}
                {worker.adminstatus ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Can Make Sales:</strong>{" "}
                {worker.privileges.makeSalesOnly ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Can Add Inventory:</strong>{" "}
                {worker.privileges.addInventory ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Can Edit Data:</strong>{" "}
                {worker.privileges.editData ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Can Access Data:</strong>{" "}
                {worker.privileges.accessData ? "Yes" : "No"}
              </Typography>
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography variant="body1">
          Your Company has no worker except the Admin
        </Typography>
      )}
    </Paper>
  );
};

const Settings = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const storename = useSelector((state) => state.companyState.data.name);
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
    </div>
  );
};

export default Settings;
