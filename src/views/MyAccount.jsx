import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Snackbar,
  Divider
} from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../config/Functions";

const StyledField = styled(Field)({
  margin: "10px 0",
});

const Privileges = ({ worker }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Privileges
      </Typography>
      <Divider sx={{mb:3}} />
          <Grid container spacing={3} key={worker._id}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Admin Status:{" "}
                {worker.adminstatus ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Can Make Sales:{" "}
                {worker.privileges.makeSalesOnly ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Can Add Inventory:{" "}
                {worker.privileges.addInventory ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Can Edit Data:{" "}
                {worker.privileges.editData ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Can Access Data:{" "}
                {worker.privileges.accessData ? "Yes" : "No"}
              </Typography>
            </Grid>
          </Grid>
    </>
  );
};

const MyAccount = () => {
  const [open, setOpen] = useState(false)
  const user = useSelector((state) => state.userState.currentUser);
  const company = useSelector((state) => state.companyState.data);
  // useEffect(() => console.log(user))
  return (
    <div className="page">
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          My Account
        </Typography>
        <Formik
          initialValues={{
            user: {
              name: user.name || "",
              username: "",
              phone: "",
              password: "",
            },
            company: {
              email: company.email || "",
              businessName: company.name || "",
              businessAddress: "",
              taxId: "",
              currentPlan: "Premium",
              nextBillingDate: "2024-06-15",
            },
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              console.log(values);
            } catch (error) {
              console.log(error);
            }
          }}>
          {({ values, handleChange }) => (
            <Form>
              <Box mb={4}>
                <Typography variant="h6">Personal Information</Typography>
                <StyledField
                  as={TextField}
                  fullWidth
                  name="user.name"
                  label="Full Name"
                  variant="outlined"
                  value={capitalizeFirstLetter(values.user.name)}
                  onChange={handleChange}
                  disabled
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="user.username"
                  label="Username"
                  variant="outlined"
                  value={capitalizeFirstLetter(values.user.username)}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="user.email"
                  label="Email"
                  variant="outlined"
                  value={values.user.email}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  type="password"
                  name="user.password"
                  label="Password"
                  variant="outlined"
                  value={values.user.password}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="user.phone"
                  label="Phone"
                  variant="outlined"
                  value={values.user.phone}
                  onChange={handleChange}
                />

                <Privileges worker={user} />
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

              {user.adminstatus && (
                <>
                  <Box mb={3}>
                    <Typography variant="h6">
                      Subscription and Billing
                    </Typography>
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
                </>
              )}

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

export default MyAccount;
