import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../config/Functions";

const StyledField = styled(Field)({
  margin: "10px 0",
});

const MyAccount = () => {
  const user = useSelector((state) => state.userState.currentUser);
  const company = useSelector((state) => state.companyState.data);
  useEffect(() => console.log(company))
  return (
    <div className="page">
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          My Account
        </Typography>
        <Formik
          initialValues={{
            fullName: user.name || "",
            username: "",
            email: company.email || "",
            phone: "",
            businessName: company.name || "",
            businessAddress: "",
            taxId: "",
            currentPlan: "Premium",
            nextBillingDate: "2024-06-15",
          }}
          onSubmit={(values) => {
            console.log(values);
          }}>
          {({ values, handleChange }) => (
            <Form>
              <Box mb={3}>
                <Typography variant="h6">Personal Information</Typography>
                <StyledField
                  as={TextField}
                  fullWidth
                  name="fullName"
                  label="Full Name"
                  variant="outlined"
                  value={capitalizeFirstLetter(values.fullName)}
                  onChange={handleChange}
                  disabled
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="username"
                  label="Username"
                  variant="outlined"
                  value={capitalizeFirstLetter(values.username)}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="email"
                  label="Email"
                  variant="outlined"
                  value={values.email}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="phone"
                  label="Phone"
                  variant="outlined"
                  value={values.phone}
                  onChange={handleChange}
                />
              </Box>

              <Box mb={3}>
                <Typography variant="h6">Business Information</Typography>
                <StyledField
                  as={TextField}
                  fullWidth
                  name="businessName"
                  label="Business Name"
                  variant="outlined"
                  value={capitalizeFirstLetter(values.businessName)}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="businessAddress"
                  label="Business Address"
                  variant="outlined"
                  value={values.businessAddress}
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
                    <Button variant="outlined" fullWidth>
                      Manage Locations
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined" fullWidth>
                      Manage Employees
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Box mb={3}>
                <Typography variant="h6">Reports and Analytics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button variant="outlined" fullWidth>
                      View Sales Reports
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined" fullWidth>
                      View Inventory Reports
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Box mb={3}>
                <Typography variant="h6">Support</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button variant="outlined" fullWidth>
                      Help Center
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined" fullWidth>
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

export default MyAccount;
