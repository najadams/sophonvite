import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { capitalizeFirstLetter, updateAccount } from "../config/Functions";
import { ActionCreators } from "../actions/action";

const StyledField = styled(Field)({
  margin: "10px 0",
});

const Privileges = ({ worker }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Privileges
    </Typography>
    <Divider sx={{ mb: 3 }} />
    <Grid container spacing={3} key={worker._id}>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1">
          Admin Status: {worker.adminstatus ? "Yes" : "No"}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1">
          Can Make Sales: {worker.privileges.makeSalesOnly ? "Yes" : "No"}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1">
          Can Add Inventory: {worker.privileges.addInventory ? "Yes" : "No"}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1">
          Can Edit Data: {worker.privileges.editData ? "Yes" : "No"}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1">
          Can Access Data: {worker.privileges.accessData ? "Yes" : "No"}
        </Typography>
      </Grid>
    </Grid>
  </>
);

const ROLES = [
  "super_admin",
  "store_manager",
  "sales_associate",
  "inventory_manager",
  "hr",
  "it_support",
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
  contact: Yup.number().required("Required").typeError("Must be a number"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string(),
});

const disapbleRole = (user) => {
  return user.role !== undefined;
};

const MyAccount = () => {
  const user = useSelector((state) => state.userState.currentUser);
  const userId = user._id;
  const dispatch = useDispatch();

  return (
    <div className="page">
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          My Account
        </Typography>
        <Formik
          initialValues={{
            name: user.name || "",
            username: user.username || "",
            role: user.role || "",
            contact: user.contact || "",
            email: user.email || "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const processedValues = {
              ...values,
              name: values.name.trim().toLowerCase(),
              username: values.username.trim().toLowerCase(),
              email: values.email.trim().toLowerCase(),
              contact: values.contact.trim(),
              role: values.role.trim().toLowerCase(),
            };

            try {
              const submissionData = { userId, ...processedValues };
              await updateAccount(submissionData);
              dispatch(
                ActionCreators.setCurrentUser({
                  _id: userId,
                  ...processedValues,
                })
              );
              console.log(submissionData);
            } catch (error) {
              console.log(error);
            }
            setSubmitting(false);
          }}>
          {({ values, handleChange, setFieldValue }) => (
            <Form>
              <Box mb={4}>
                <Typography variant="h6">Personal Information</Typography>
                <StyledField
                  as={TextField}
                  fullWidth
                  name="name"
                  label="Full Name"
                  variant="outlined"
                  value={capitalizeFirstLetter(values.name)}
                  onChange={handleChange}
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
                <Autocomplete
                  options={ROLES}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Role"
                      name="role"
                      variant="outlined"
                      required
                    />
                  )}
                  value={values.role}
                  onChange={(event, value) => {
                    setFieldValue("role", value);
                  }}
                  disableClearable
                  disabled={disapbleRole(user)}
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
                  type="password"
                  name="password"
                  label="Password"
                  variant="outlined"
                  value={values.password}
                  onChange={handleChange}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="contact"
                  label="Contact"
                  variant="outlined"
                  value={values.contact}
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
