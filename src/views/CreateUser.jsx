import React, { useState } from "react";
import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  LinearProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { ROLES } from "../context/userRoles";
import { tableActions } from "../config/Functions";
import { useSelector } from "react-redux";

const StyledTextField = styled(TextField)({
  margin: "10px 0",
});

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  contact: Yup.string().required("Required"),
});

const MyTextField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleBlur = (event) => {
    const lowercaseValue = event.target.value.toLowerCase();
    helpers.setValue(lowercaseValue); 
    field.onBlur(event); 
  };

  return (
    <>
      <StyledTextField
        label={label}
        {...field}
        {...props}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
        onBlur={handleBlur} // Use the custom onBlur handler
      />
    </>
  );
};

const CreateUser = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="page">
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Create User
        </Typography>
        <Formik
          initialValues={{
            name: "",
            username: "",
            role: "",
            email: "",
            password: "",
            contact: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            setError(""); // Reset error message
            try {
              await tableActions.addWorker({ companyId, ...values });
              setShowAlert(true);
              setTimeout(() => {
                setShowAlert(false);
                resetForm();
              }, 1000);
            } catch (err) {
              // Capture error message from the server
              setError(
                err ||
                  "An error occurred while creating the user."
              );
              setTimeout(() => {
                setError("")
              }, 2000);
              console.log(err);
            }
            setSubmitting(false); // Ensure submitting is stopped
          }}> 
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <Box mb={4}>
                <MyTextField
                  name="name"
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                />
                <MyTextField
                  name="username"
                  label="Username"
                  variant="outlined"
                  fullWidth
                />
                <Field name="role">
                  {({ field, form, meta }) => (
                    <Autocomplete
                      options={Object.values(ROLES)}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Role"
                          variant="outlined"
                          error={meta.touched && Boolean(meta.error)}
                          helperText={meta.touched && meta.error}
                        />
                      )}
                      onChange={(event, value) => {
                        setFieldValue("role", value);
                      }}
                      value={values.role}
                      disableClearable
                    />
                  )}
                </Field>
                <MyTextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                />
                <MyTextField
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                />
                <MyTextField
                  name="contact"
                  label="Contact"
                  variant="outlined"
                  fullWidth
                />
              </Box>
              {isSubmitting && <LinearProgress />}
              <Box mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth>
                  Create User
                </Button>
              </Box>
              {/* Error Alert */}
              {error && (
                <div
                  style={{
                    position: "fixed",
                    top: "80px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                  }}>
                  <Alert variant="filled" severity="error">
                    {error}
                  </Alert>
                </div>
              )}
              {/* Success Alert */}
              {showAlert && !error && (
                <div
                  style={{
                    position: "fixed",
                    top: "80px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                  }}>
                  <Alert variant="filled" severity="success">
                    User created successfully!
                  </Alert>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default CreateUser;
