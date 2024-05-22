import React, { useState } from "react";
import { Formik, Field, FieldArray, Form } from "formik";
import {
  Button,
  TextField,
  Typography,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import * as Yup from "yup";
import { tableActions } from "../../config/Functions";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  representativeName: Yup.string(),
  contact: Yup.string().required("Contact is required"),
  tinNumber: Yup.string().required("TIN number is required"),
  address: Yup.string().required("Address is required"),
  products: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Product name is required"),
      quantity: Yup.number().required("Quantity is required"),
      sellingPrice: Yup.number().required("Selling price is required"),
      costPrice: Yup.number().required("Cost price is required"),
    })
  ),
  invoiceImage: Yup.mixed().required("Invoice image is required"),
});

const VendorForm = ({ customerOptions, Products, handleClose }) => {
  const workerId = useSelector((state) => state.userState.currentUser);
  const companyId = useSelector((state) => state.companyState.data.id);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const matchesMobile = useMediaQuery("(max-width:600px)");
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Formik
        initialValues={{
          companyName: "",
          representativeName: "",
          contact: "",
          tinNumber: "",
          address: "",
          products: [{ name: "", quantity: 0, sellingPrice: 0, costPrice: 0 }],
          invoiceImage: null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            setSubmitting(true);
            await tableActions.addReceipt(values, companyId, workerId);
            setOpen(true);
            setTimeout(() => {
              handleClose();
            }, 5000);
          } catch (error) {
            console.log(error);
            setError(error);
          } finally {
            setSubmitting(false);
            setLoading(false);
          }
        }}>
        {({ values, submitForm, setFieldValue, isSubmitting, resetForm }) => (
          <Form className="form" style={{ margin: 10 }}>
            <Field name="companyName">
              {({ field, form }) => {
                const hasError = Boolean(
                  form.errors.companyName && form.touched.companyName
                );
                return (
                  <TextField
                    {...field}
                    style={{ paddingBottom: 10 }}
                    label="Company Name"
                    fullWidth
                    error={hasError}
                    helperText={hasError ? form.errors.companyName : ""}
                  />
                );
              }}
            </Field>

            <Field name="representativeName">
              {({ field }) => (
                <TextField
                  {...field}
                  style={{ paddingBottom: 10 }}
                  label="Representative Name"
                  fullWidth
                />
              )}
            </Field>

            <Field name="contact">
              {({ field, form }) => {
                const hasError = Boolean(
                  form.errors.contact && form.touched.contact
                );
                return (
                  <TextField
                    {...field}
                    style={{ paddingBottom: 10 }}
                    label="Contact"
                    fullWidth
                    error={hasError}
                    helperText={hasError ? form.errors.contact : ""}
                  />
                );
              }}
            </Field>

            <Field name="tinNumber">
              {({ field, form }) => {
                const hasError = Boolean(
                  form.errors.tinNumber && form.touched.tinNumber
                );
                return (
                  <TextField
                    {...field}
                    style={{ paddingBottom: 10 }}
                    label="TIN Number"
                    fullWidth
                    error={hasError}
                    helperText={hasError ? form.errors.tinNumber : ""}
                  />
                );
              }}
            </Field>

            <Field name="address">
              {({ field, form }) => {
                const hasError = Boolean(
                  form.errors.address && form.touched.address
                );
                return (
                  <TextField
                    {...field}
                    style={{ paddingBottom: 10 }}
                    label="Address"
                    fullWidth
                    error={hasError}
                    helperText={hasError ? form.errors.address : ""}
                  />
                );
              }}
            </Field>

            <Field name="invoiceImage">
              {({ field, form }) => {
                const hasError = Boolean(
                  form.errors.invoiceImage && form.touched.invoiceImage
                );
                return (
                  <div>
                    <input
                      id="invoiceImage"
                      name="invoiceImage"
                      type="file"
                      onChange={(event) => {
                        setFieldValue(
                          "invoiceImage",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    {hasError && (
                      <Typography color="error">
                        {form.errors.invoiceImage}
                      </Typography>
                    )}
                  </div>
                );
              }}
            </Field>

            <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setLoading(true);
                  submitForm();
                }}
                disabled={loading || isSubmitting}>
                {loading ? <CircularProgress /> : "Save"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      {error && (
        <Typography align="center" color="red">
          {error}
        </Typography>
      )}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message={"Vendor information successfully recorded"}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </div>
  );
};

export default VendorForm;
