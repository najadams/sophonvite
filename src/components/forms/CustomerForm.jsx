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
} from "@mui/material";
import ErrorAlert from "../../utils/Error";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { ActionCreators } from "../../actions/action";
import { tableActions } from "../../config/Functions";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  phone: Yup.array().of(Yup.string()),
  email: Yup.array().of(
    Yup.string().email("Invalid email")
  ),
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
  useEffect(() => { console.log(data) }, [data]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      let error;
      if (data) {
        values.id = data.id;
        error = await tableActions.updateCustomer(values);
        console.log(values)
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
    <div style={{ paddingTop: 20 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ submitForm, isSubmitting, resetForm, values }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  onBlur={(e) => {
                    const trimmedValue = e.target.value.trim();
                    // Update the value to lower case trimmed value
                    e.target.value = trimmedValue.toLowerCase();
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FieldArray name="phone">
                  {({ remove, push }) => (
                    <div>
                      <Typography variant="h6">Phone Numbers</Typography>
                      {values.phone.map((phone, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={1}>
                          <Field
                            component={TextField}
                            name={`phone.${index}`}
                            label={`Phone ${index + 1}`}
                            fullWidth
                          />
                          <IconButton
                            onClick={() => remove(index)}
                            disabled={values.phone.length === 1}>
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <IconButton onClick={() => push("")}>
                        <AddIcon />
                      </IconButton>
                    </div>
                  )}
                </FieldArray>
              </Grid>

              <Grid item xs={12}>
                <FieldArray name="email">
                  {({ remove, push }) => (
                    <div>
                      <Typography variant="h6">Email Addresses</Typography>
                      {values.email.map((email, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={1}>
                          <Field
                            component={TextField}
                            name={`email.${index}`}
                            label={`Email ${index + 1}`}
                            fullWidth
                          />
                          <IconButton
                            onClick={() => remove(index)}
                            disabled={values.email.length === 1}>
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <IconButton onClick={() => push("")}>
                        <AddIcon />
                      </IconButton>
                    </div>
                  )}
                </FieldArray>
              </Grid>

              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="address"
                  label="Address"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="company"
                  label="Company Name"
                  fullWidth
                />
              </Grid>

              {isSubmitting && (
                <Grid item xs={12}>
                  <LinearProgress />
                </Grid>
              )}

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  {done ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        resetForm();
                        setDone(false);
                      }}>
                      Customer Added! Click to Add New Customer
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}>
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
        <ErrorAlert
          message={error}
          onClose={() => setError(null)}
          severity="error"
        />
      )}

      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message={
          data ? "Customer Changed Successfully" : "Customer added successfully"
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </div>
  );
};

export default CustomerForm;
