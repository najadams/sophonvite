import React, { useState, useEffect } from "react";
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
  const user = useSelector((state) => state.userState.currentUser);
  const userId = user._id;
  const company = useSelector((state) => state.companyState.data);
  useEffect(() => console.log(user._id))
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
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const submissionData = { userId, ...values };
              console.log(submissionData);
              // Here you would send submissionData to your API
            } catch (error) {
              console.log(error);
            }
            setSubmitting(false);
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
