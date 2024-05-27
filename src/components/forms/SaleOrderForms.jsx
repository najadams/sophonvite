import React, { useState, useRef } from "react";
import { Formik, Field, FieldArray, Form } from "formik";
import {
  Button,
  TextField,
  Typography,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Input } from "@mui/material";
import * as Yup from "yup";
import { capitalizeFirstLetter, tableActions } from "../../config/Functions";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import ReceiptTemplate from "../compPrint/ReceiptTemplate";
import { useReactToPrint } from "react-to-print";

const validationSchema = Yup.object().shape({
  customerName: Yup.string().required("Customer name is required"),
  products: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Product name is required"),
      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1"),
      price: Yup.number().required("Price is required"),
    })
  ),
  total: Yup.number().required(),
});

const SalesOrderForms = ({ customerOptions, Products, handleClose }) => {
  const workerId = useSelector((state) => state.userState.currentUser);
  const companyId = useSelector((state) => state.companyState.data.id);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const matchesMobile = useMediaQuery("(max-width:600px)");
  const [loading, setLoading] = useState(false);
  const printRef = useRef();
  const [printValues, setPrintValues] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleSubmit = async (values, setSubmitting, resetForm) => {
    const total = values.products.reduce(
      (sum, product) => sum + product?.totalPrice,
      0
    );
    values.total = total;
    try {
      setSubmitting(true);
      await tableActions.addReceipt(values, companyId, workerId);
      setOpen(true);
      setPrintValues(values); // Store values for printing
      setTimeout(() => {
        // handleClose();
      }, 5000);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          customerName: "",
          products: [{ name: "", quantity: "", totalPrice: 0, price: 0 }],
          total: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleSubmit(values, setSubmitting, resetForm);
        }}>
        {({ values, submitForm, setFieldValue, isSubmitting, resetForm }) => (
          <Form className="form" style={{ margin: 10 }}>
            <Field name="customerName">
              {({ field, form }) => {
                const hasError = Boolean(
                  form.errors.customerName && form.touched.customerName
                );
                return (
                  <Autocomplete
                    {...field}
                    options={capitalizeFirstLetter(customerOptions)}
                    value={field.value}
                    onChange={(event, newValue) => {
                      form.setFieldValue(field.name, newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ paddingBottom: 10 }}
                        label="Customer Name"
                        fullWidth
                        error={hasError}
                        helperText={hasError ? form.errors.customerName : ""}
                      />
                    )}
                  />
                );
              }}
            </Field>

            <hr
              style={{ height: 5, backgroundColor: "black", marginBottom: 20 }}
            />
            <FieldArray name="products">
              {({ push, remove }) => (
                <div
                  style={{ display: "flex", gap: 10, flexDirection: "column" }}>
                  {values.products.map((product, index) => {
                    const productOptions = Products.map((p) => p.name);
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flex: 1,
                          gap: 10,
                          flexWrap: "wrap",
                          flexDirection: matchesMobile ? "column" : "row",
                        }}>
                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "row",
                            gap: "1rem",
                          }}>
                          <Field name={`products.${index}.name`}>
                            {({ field, form }) => (
                              <Autocomplete
                                options={productOptions}
                                value={product.name}
                                onChange={(event, newValue) => {
                                  form.setFieldValue(field.name, newValue);
                                  const selectedProduct = Products.find(
                                    (p) => p.name === newValue
                                  );
                                  const newTotalPrice =
                                    product.quantity *
                                    selectedProduct?.salesPrice;
                                  setFieldValue(
                                    `products.${index}.totalPrice`,
                                    newTotalPrice
                                  );
                                  setFieldValue(
                                    `products.${index}.price`,
                                    selectedProduct?.salesPrice || 0
                                  ); // Update price
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    style={{
                                      flex: 1,
                                      width: matchesMobile ? 200 : 300,
                                    }}
                                    {...params}
                                    label="Product Name"
                                    fullWidth
                                  />
                                )}
                                autoSelect // Automatically select the first option
                              />
                            )}
                          </Field>

                          <Field
                            style={{ paddingRight: 10, flex: 1, width: 150 }}
                            as={TextField}
                            name={`products.${index}.quantity`}
                            label="Quantity"
                            type="number"
                            validate={(value) => {
                              const selectedProduct = Products.find(
                                (p) => p.name === product.name
                              );
                              if (value > selectedProduct?.onhand) {
                                return `Quantity cannot exceed available stock (${selectedProduct?.onHand})`;
                              }
                            }}
                            onChange={(event) => {
                              const newValue = parseInt(event.target.value);
                              setFieldValue(
                                `products.${index}.quantity`,
                                newValue
                              );
                              const selectedProduct = Products.find(
                                (p) => p.name === product.name
                              );
                              const newTotalPrice =
                                newValue * selectedProduct?.salesPrice;
                              setFieldValue(
                                `products.${index}.totalPrice`,
                                newTotalPrice
                              );
                            }}
                            onBlur={(event) => {
                              const value = parseInt(event.target.value);
                              const selectedProduct = Products.find(
                                (p) => p.name === product.name
                              );
                              if (value > selectedProduct?.onhand) {
                                alert(
                                  `Quantity cannot exceed available stock (${selectedProduct?.onhand})`
                                );
                              }
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flex: 1, gap: 10 }}>
                          <Field name={`products.${index}.price`}>
                            {({ field }) => (
                              <Input
                                value={
                                  Products.find((p) => p.name === product.name)
                                    ?.salesPrice
                                }
                                label="Price"
                                readOnly
                                inputProps={{
                                  style: { textAlign: "right" },
                                }}
                              />
                            )}
                          </Field>

                          <Field name={`products.${index}.totalPrice`}>
                            {({ field }) => (
                              <Input
                                value={product.totalPrice}
                                label="Total Price"
                                readOnly
                                inputProps={{
                                  style: { textAlign: "right" },
                                }}
                              />
                            )}
                          </Field>
                          <Button
                            style={{ height: "80%", marginTop: 10 }}
                            variant="contained"
                            color="error"
                            onClick={() => remove(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={() => {
                      push({
                        name: "",
                        quantity: "",
                        totalPrice: 0,
                        price: 0,
                      });
                    }}
                    disabled={
                      values.products.length > 0 &&
                      !Object.values(
                        values.products[values.products.length - 1]
                      ).every(Boolean)
                    }>
                    Add Product
                  </Button>
                </div>
              )}
            </FieldArray>
            <Field name="total">
              {({ field }) => (
                <Input
                  value={values.products.reduce(
                    (sum, product) => sum + product?.totalPrice,
                    0
                  )}
                  label="Total"
                  readOnly
                  inputProps={{
                    style: { textAlign: "right" },
                  }}
                />
              )}
            </Field>

            <div style={{ display: "flex", gap: 20 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setLoading(true); // Set loading state to true
                  submitForm(); // Trigger form submission
                }}
                disabled={loading || isSubmitting} // Disable button when loading or submitting
              >
                {loading ? <CircularProgress /> : "Save"}
              </Button>

              <Button
                variant="contained"
                color="info"
                onClick={async () => {
                  setLoading(true);
                  await submitForm();
                  handlePrint();
                }}
                disabled={loading || isSubmitting} // Disable button when loading or submitting
              >
                {loading ? <CircularProgress /> : "Save & Print"}
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
        message={"Sales successfully Recorded"}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      {/* Receipt Template for printing */}
      {printValues && (
        <div style={{ display: "none" }}>
          <ReceiptTemplate
            ref={printRef}
            customerName={printValues.customerName}
            products={printValues.products}
          />
        </div>
      )}
    </div>
  );
};

export default SalesOrderForms;
 