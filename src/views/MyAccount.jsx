import React, { useState } from "react";
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
  LinearProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { capitalizeFirstLetter, updateAccount } from "../config/Functions";
import { ActionCreators } from "../actions/action";
import { rolePermissions, ROLES } from "../context/userRoles";
import bcrypt from "bcryptjs";

const StyledField = styled(Field)({
  margin: "10px 0",
});

const Privileges = ({ user }) => {
  const userRole = user.role;
  const userPermissions = rolePermissions[userRole] || [];

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const permissionChunks = chunkArray(userPermissions, 2);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Privileges
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Grid>
      {permissionChunks.map((chunk, index) => (
        <React.Fragment key={index}>
          {chunk.map((permission) => (
            <Grid item xs={6} key={permission}>
              <Typography variant="body1">
                {capitalizeFirstLetter(permission.split("_").join(" "))}
              </Typography>
            </Grid>
          ))}
        </React.Fragment>
      ))}
    </Grid>
  );
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  username: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
  contact: Yup.string(),
  email: Yup.string().email("Invalid email"),
  password: Yup.string(),
});

const MyAccount = () => {
  const user = useSelector((state) => state.userState.currentUser);
  const userId = user._id;
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // const handleSubmit = async (values, { setSubmitting }) => {
  //   try {
  //     const processedValues = {
  //       ...values,
  //       name: values.name.trim().toLowerCase(),
  //       username: values.username.trim().toLowerCase(),
  //       email: values.email.trim().toLowerCase(),
  //       contact: values.contact.trim(),
  //       role: values.role.trim().toLowerCase(),
  //     };

  //     if (values.password && values.password.trim() !== "") {
  //       processedValues.password = await bcrypt.hash(values.password, 10);
  //     } else {
  //       delete processedValues.password; // Ensure it's not included in the update
  //     }

  //     const submissionData = { userId, ...processedValues };
  //     await updateAccount(submissionData);
  //     dispatch(
  //       ActionCreators.setCurrentUser({
  //         _id: userId,
  //         ...processedValues,
  //       })
  //     );

  //     setAlert({
  //       show: true,
  //       message: "Account updated successfully!",
  //       type: "success",
  //     });

  //     console.log(submissionData);
  //   } catch (error) {
  //     setAlert({
  //       show: true,
  //       message: "Error updating account.",
  //       type: "error",
  //     });
  //     console.error(error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {

      console.log(user)
      // Process only changed values while keeping existing ones
      const processedValues = {
        name: values.name?.trim()?.toLowerCase() || user.name,
        username:
          values.username?.trim()?.toLowerCase() || user.username,
        email: values.email?.trim()?.toLowerCase() || user.email,
        contact: values.contact?.trim() || user.contact,
        role: values.role?.trim()?.toLowerCase() || user.role,
      };

      // Only hash and update password if it's provided
      if (values.password && values.password.trim() !== "") {
        processedValues.password = await bcrypt.hash(values.password, 10);
      }

      const submissionData = { userId, ...processedValues };
      await updateAccount(submissionData);

      // Merge with the existing user data and update Redux state
      dispatch(
        ActionCreators.setCurrentUser({
          _id: userId,
          ...user, // Preserve unchanged fields
          ...processedValues, // Update only changed fields
        })
      );

      setAlert({
        show: true,
        message: "Account updated successfully!",
        type: "success",
      });

      console.log(submissionData);
    } catch (error) {
      setAlert({
        show: true,
        message: "Error updating account.",
        type: "error",
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          My Account
        </Typography>
        <Formik
          initialValues={{
            name: capitalizeFirstLetter(user.name) || "",
            username: capitalizeFirstLetter(user.username) || "",
            role: user.role || "",
            contact: user.contact || "",
            email: user.email || "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit} // ✅ Corrected Formik submission
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              <Box mb={4}>
                <Typography variant="h6">Personal Information</Typography>
                <StyledField
                  as={TextField}
                  fullWidth
                  name="name"
                  label="Full Name"
                  variant="outlined"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={(event) => {
                    handleBlur(event);
                    setFieldValue(
                      "name",
                      capitalizeFirstLetter(event.target.value)
                    );
                  }}
                />
                <StyledField
                  as={TextField}
                  fullWidth
                  name="username"
                  label="Username"
                  variant="outlined"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={(event) => {
                    handleBlur(event);
                    setFieldValue(
                      "username",
                      capitalizeFirstLetter(event.target.value)
                    );
                  }}
                />
                <Autocomplete
                  options={Object.values(ROLES)}
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
                  isOptionEqualToValue={(option, value) => option === value}
                  disableClearable
                  disabled={!!user.role} // ✅ Prevent role change if already set
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
                <Privileges user={user} />
              </Box>

              <br />
              {alert.show && (
                <Alert
                  severity={alert.type}
                  onClose={() => setAlert({ show: false })}>
                  {alert.message}
                </Alert>
              )}
              {isSubmitting && <LinearProgress />}
              <Box mt={3}>
                <Button
                  type="submit" // ✅ Corrected to allow Formik to handle submission
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
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
