import { useState, useContext } from "react";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import LinearProgress from "@mui/material/LinearProgress";
import {
  Typography,
  Snackbar,
  Box,
  Paper,
  Grid,
  InputAdornment,
  Alert,
} from "@mui/material";
import { DialogContext } from "../../context/context";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "../../actions/action";
import { tableActions } from "../../config/Functions";
import { motion } from "framer-motion";
import { alpha } from "@mui/material/styles";
import { useQueryClient } from "react-query";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s-]+$/,
      "Only letters, numbers, spaces, and hyphens are allowed"
    ),
  costPrice: Yup.number()
    .required("Cost price is required")
    .min(0, "Cost price cannot be negative")
    .max(1000000, "Cost price is too high")
    .typeError("Cost price must be a number"),
  salesPrice: Yup.number()
    .required("Sales price is required")
    .min(0, "Sales price cannot be negative")
    .max(1000000, "Sales price is too high")
    .typeError("Sales price must be a number")
    .test(
      "sales-price",
      "Sales price must be higher than cost price",
      function (value) {
        return value > this.parent.costPrice;
      }
    ),
  onhand: Yup.number()
    .required("Quantity is required")
    .min(0, "Quantity cannot be negative")
    .max(1000000, "Quantity is too high")
    .typeError("Quantity must be a number"),
});

const ProductForm = ({ data, editMutation }) => {
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const companyId = useSelector((state) => state.companyState.data.id);
  const handleClose = useContext(DialogContext);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

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
          {data ? "Edit Product" : "Add New Product"}
        </Typography>

        <Formik
          initialValues={
            data || {
              name: "",
              costPrice: "",
              salesPrice: "",
              onhand: "",
            }
          }
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            setSubmitting(true);
            try {
              let error;
              let product;
              if (data) {
                error = await tableActions.updateProduct(values);
              } else {
                const result = await tableActions.addProduct({
                  ...values,
                  companyId,
                });
                if (typeof result === "string") {
                  error = result;
                } else {
                  product = result;
                  dispatch(ActionCreators.fetchInventorySuccess(product));
                  dispatch(ActionCreators.addProduct());
                  setDone(true);
                  queryClient.invalidateQueries(["api/products", companyId]);
                }
              }
              if (error) {
                setError(error);
              } else {
                setOpen(true);
                if (editMutation?.mutate) {
                  editMutation.mutate(values);
                }
                setTimeout(() => {
                  handleClose();
                }, 2000);
              }
            } catch (err) {
              console.error(err);
              setError("An error occurred while saving the product");
            } finally {
              setSubmitting(false);
            }
          }}>
          {({
            submitForm,
            isSubmitting,
            handleChange,
            resetForm,
            values,
            errors,
            touched,
          }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="name"
                    type="text"
                    label="Product Name"
                    fullWidth
                    variant="outlined"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    onBlur={(e) => {
                      const trimmedValue = e.target.value.trim();
                      const lowercaseValue = trimmedValue.toLowerCase();
                      e.target.value = lowercaseValue;
                      handleChange(e);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    type="number"
                    label="Cost Price"
                    name="costPrice"
                    fullWidth
                    variant="outlined"
                    error={touched.costPrice && Boolean(errors.costPrice)}
                    helperText={touched.costPrice && errors.costPrice}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    type="number"
                    label="Sales Price"
                    name="salesPrice"
                    fullWidth
                    variant="outlined"
                    error={touched.salesPrice && Boolean(errors.salesPrice)}
                    helperText={touched.salesPrice && errors.salesPrice}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    type="number"
                    label="Quantity on Hand"
                    name="onhand"
                    fullWidth
                    variant="outlined"
                    error={touched.onhand && Boolean(errors.onhand)}
                    helperText={touched.onhand && errors.onhand}
                    disabled={data}
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
                        Product Added! Click to Add New Product
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          isSubmitting || Object.keys(errors).length > 0
                        }
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
                        {data ? "Save Changes" : "Add Product"}
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 2,
              borderRadius: 1,
            }}>
            {error}
          </Alert>
        )}

        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={() => setOpen(false)}
          message={
            !data
              ? "Product added successfully"
              : "Product Changed Successfully"
          }
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
      </Paper>
    </motion.div>
  );
};

export default ProductForm;
