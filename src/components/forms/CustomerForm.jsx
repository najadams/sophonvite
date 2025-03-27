import React, { useState, useContext, useEffect } from "react";
import { DialogContext } from "../../context/context";
import { Formik, Field, Form, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import {
  Typography,
  Snackbar,
  Button,
  LinearProgress,
  IconButton,
  Box,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import ErrorAlert from "../../utils/Error";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { ActionCreators } from "../../actions/action";
import { tableActions } from "../../config/Functions";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  phone: Yup.array().of(Yup.string()),
  email: Yup.array().of(Yup.string().email("Invalid email")),
  address: Yup.string(),
  company: Yup.string(),
});

const CustomerForm = ({ data, editMutation }) => {
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const companyId = useSelector((state) => state.companyState.data.id);
  const handleClose = useContext(DialogContext);
  const dispatch = useDispatch();

  const initialValues = {
    name: data?.name || "",
    phone: Array.isArray(data?.phone) ? data.phone : [data?.phone || ""],
    email: Array.isArray(data?.email) ? data.email : [data?.email || ""],
    address: data?.address || "",
    company: data?.company || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      let error;
      if (data) {
        values.id = data.id;
        error = await tableActions.updateCustomer(values);
      } else {
        const result = await tableActions.addCustomer({ ...values, companyId });
        if (typeof result === "string") {
          error = result;
        } else {
          dispatch(ActionCreators.addCustomer());
          setDone(true);
        }
      }
      if (error) {
        setError(error);
      } else {
        setOpen(true);
        if (editMutation?.mutate) {
          editMutation.mutate(values);
        }
        setTimeout(handleClose, 2000);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: alpha("#fff", 0.8),
          backdropFilter: "blur(10px)",
        }}>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 500,
            color: "primary.main",
            textAlign: "center",
          }}>
          {data ? "Edit Customer" : "Add New Customer"}
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ submitForm, isSubmitting, resetForm, values }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="name"
                    label="Customer Name"
                    fullWidth
                    variant="outlined"
                    onBlur={(e) => {
                      const trimmedValue = e.target.value.trim();
                      e.target.value = trimmedValue.toLowerCase();
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, color: "text.secondary" }}>
                    Phone Numbers
                  </Typography>
                  <FieldArray name="phone">
                    {({ remove, push }) => (
                      <Box>
                        {values.phone.map((phone, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                              p: 2,
                              backgroundColor: alpha("#f5f5f5", 0.5),
                              borderRadius: 1,
                            }}>
                            <Field
                              component={TextField}
                              name={`phone.${index}`}
                              label={`Phone ${index + 1}`}
                              fullWidth
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    📞
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <IconButton
                              onClick={() => remove(index)}
                              disabled={values.phone.length === 1}
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: alpha("#d32f2f", 0.1),
                                },
                              }}>
                              <RemoveIcon />
                            </IconButton>
                          </Box>
                        ))}
                        <Button
                          startIcon={<AddIcon />}
                          onClick={() => push("")}
                          variant="outlined"
                          sx={{ mt: 1 }}>
                          Add Phone Number
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, color: "text.secondary" }}>
                    Email Addresses
                  </Typography>
                  <FieldArray name="email">
                    {({ remove, push }) => (
                      <Box>
                        {values.email.map((email, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 2,
                              p: 2,
                              backgroundColor: alpha("#f5f5f5", 0.5),
                              borderRadius: 1,
                            }}>
                            <Field
                              component={TextField}
                              name={`email.${index}`}
                              label={`Email ${index + 1}`}
                              fullWidth
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    ✉️
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <IconButton
                              onClick={() => remove(index)}
                              disabled={values.email.length === 1}
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: alpha("#d32f2f", 0.1),
                                },
                              }}>
                              <RemoveIcon />
                            </IconButton>
                          </Box>
                        ))}
                        <Button
                          startIcon={<AddIcon />}
                          onClick={() => push("")}
                          variant="outlined"
                          sx={{ mt: 1 }}>
                          Add Email Address
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="address"
                    label="Address"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="company"
                    label="Company Name"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                {isSubmitting && (
                  <Grid item xs={12}>
                    <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    {done ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => {
                          resetForm();
                          setDone(false);
                        }}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                        }}>
                        Customer Added! Click to Add New Customer
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                        size="large"
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.02)",
                          },
                        }}>
                        {data ? "Save Changes" : "Add Customer"}
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

        {error && (
          <Typography
            align="center"
            color="error"
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: alpha("#d32f2f", 0.1),
              borderRadius: 1,
            }}>
            {error}
          </Typography>
        )}

        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={() => setOpen(false)}
          message={
            data
              ? "Customer Changed Successfully"
              : "Customer added successfully"
          }
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
      </Paper>
    </motion.div>
  );
};

export default CustomerForm;
