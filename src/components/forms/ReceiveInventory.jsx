import React, { useState,useEffect } from "react";
import { Formik, Field, FieldArray, Form } from "formik";
import {
  Button,
  TextField,
  Typography,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Input } from "@mui/material";
import * as Yup from "yup";
import { capitalizeFirstLetter, tableActions } from "../../config/Functions";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";

const validationSchema = Yup.object().shape({
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
  amountPaid: Yup.number().required("Amount Paid should not be empty"),
  discount: Yup.number().min(0, "Discount cannot be negative"),
});

const ReceiveInvetory = ({
  Products,
  handleProductUpdate,
}) => {
  const worker = useSelector((state) => state.userState.currentUser);
  const workerId = worker._id;
  const companyId = useSelector((state) => state.companyState.data.id);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const matchesMobile = useMediaQuery("(max-width:600px)");
  const [loading, setLoading] = useState(false);
  const today = new Date().toLocaleDateString();
  // const [productOptions, setProductOptions] = useState([
  //   {
  //     id: 1,
  //     name: "<<<< Add New Product >>>>",
  //   },
  //   ...Products,
  // ]);

  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductSalesPrice, setNewProductSalesPrice] = useState("");
  const [newProductCostPrice, setNewProductCostPrice] = useState("");
  const [newProductOnhand, setNewProductOnhand] = useState("");

  const handleSubmit = async (values, setSubmitting, resetForm) => {
    const total = values.products.reduce(
      (sum, product) => sum + product?.totalPrice,
      0
    );
    values.total = total; // Maintain total before discount
    const balance = values.total - values.amountPaid - values.discount;

    try {
      if (!values.amountPaid) {
        setError("Amount Paid Should not be Empty!");
      } else {
        setLoading(true);
        setSubmitting(true);
        await tableActions.addReceipt(
          { ...values, balance },
          companyId,
          workerId
        );
        setOpen(true);
        setPrintValues({ ...values, balance }); // Store values for printing
        setTimeout(() => {
          resetForm();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };


  const handleNewProductSubmit = async () => {
    try {
      const data = await tableActions.addProduct({
        name: newProductName,
        costPrice: newProductCostPrice,
        salesPrice: newProductSalesPrice,
        onHhand: newProductOnhand,
        companyId,
      });

      const newProduct = data.data;

      // Update product options using a functional state update
      setProductOptions((prevOptions) => [
        {
          id: 1,
          name: "<<<< Add New Product >>>>",
        },
        ...prevOptions.filter(
          (option) => option.name !== "<<<< Add New Product >>>>"
        ),
        {
          name: newProductName,
          salesPrice: parseFloat(newProductSalesPrice) || 0, // Ensure numeric value
          onhand: parseInt(newProductOnhand, 10) || 0, // Ensure numeric value
        },
      ]);

      handleProductUpdate((prevOptions) => [
        {
          id: 1,
          name: "<<<< Add New Product >>>>",
        },
        ...prevOptions.filter(
          (option) => option.name !== "<<<< Add New Product >>>>"
        ),
        {
          name: newProductName,
          salesPrice: parseFloat(newProductSalesPrice) || 0, // Ensure numeric value
          onhand: parseInt(newProductOnhand, 10) || 0, // Ensure numeric value
        },
      ]);

      setNewProductDialogOpen(false); // Close the dialog
      setNewProductName(""); // Clear the input fields
      setNewProductSalesPrice("");
      setNewProductCostPrice("");
      setNewProductOnhand("");
    } catch (error) {
      console.log(error);
      setError("Failed to add new product");
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          products: [{ name: "", quantity: "", totalPrice: 0, price: 0 }],
          total: 0,
          amountPaid: "",
          discount: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleSubmit(values, setSubmitting, resetForm);
        }}>
        {({ values, submitForm, setFieldValue, isSubmitting, resetForm }) => (
          <Form className="form" style={{ margin: 10 }}>
            <FieldArray name="products">
              {({ push, remove }) => (
                <div
                  style={{ display: "flex", gap: 10, flexDirection: "column" }}>
                  {values.products.map((product, index) => {
                    const productItems = productOptions.map(
                      (p) => p?.name || ""
                    );
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
                                options={productItems}
                                value={product.name}
                                onChange={(event, newValue) => {
                                  if (
                                    newValue === "<<<< Add New Product >>>>"
                                  ) {
                                    setNewProductDialogOpen(true);
                                    form.setFieldValue(field.name, "");
                                  } else {
                                    form.setFieldValue(field.name, newValue);
                                    const selectedProduct = productOptions.find(
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
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    style={{
                                      flex: 1,
                                      width: matchesMobile ? 150 : 400,
                                    }}
                                    {...params}
                                    label="Product Name"
                                    fullWidth
                                  />
                                )}
                                autoSelect // not working : supposed to autoselect the first name
                              />
                            )}
                          </Field>

                          <Field
                            style={{
                              paddingRight: 0,
                              flex: 1,
                              width: "50%",
                              minWidth: 150,
                            }}
                            as={TextField}
                            name={`products.${index}.quantity`}
                            label="Quantity"
                            type="number"
                            validate={(value) => {
                              const selectedProduct = productOptions.find(
                                (p) => p.name === product.name
                              );
                              // if (value > selectedProduct?.onhand) {
                              //   return `Quantity cannot exceed available stock (${selectedProduct?.onHand})`;
                              // }
                            }}
                            onChange={(event) => {
                              const newValue = parseInt(event.target.value);
                              setFieldValue(
                                `products.${index}.quantity`,
                                newValue
                              );
                              const selectedProduct = productOptions.find(
                                (p) => p.name === product.name
                              );
                              console.log(selectedProduct);

                              const newTotalPrice =
                                newValue * selectedProduct?.salesPrice;
                              setFieldValue(
                                `products.${index}.totalPrice`,
                                newTotalPrice
                              );
                            }}
                            onBlur={(event) => {
                              const value = parseInt(event.target.value);
                              const selectedProduct = productOptions.find(
                                (p) => p.name === product.name
                              );
                              if (value > selectedProduct?.onhand) {
                                setModalMessage(
                                  `Quantity cannot exceed available stock (${selectedProduct?.onhand})`
                                );
                                setModalOpen(true);
                              }
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flex: 1, gap: 10 }}>
                          <Field name={`products.${index}.price`}>
                            {({ field, form }) => (
                              <TextField
                                {...field}
                                label="Price"
                                type="number"
                                style={{ minWidth: 150 }}
                                fullWidth
                                InputProps={{ style: { textAlign: "right" } }}
                                onChange={(event) => {
                                  const newPrice = parseFloat(
                                    event.target.value
                                  );
                                  setFieldValue(
                                    `products.${index}.price`,
                                    newPrice
                                  );
                                  const newTotalPrice =
                                    product.quantity * newPrice;
                                  setFieldValue(
                                    `products.${index}.totalPrice`,
                                    newTotalPrice
                                  );
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
            <Field name="amountPaid">
              {({ field, form }) => {
                const hasError = Boolean(
                  form.errors.amountPaid && form.touched.amountPaid
                );
                return (
                  <TextField
                    {...field}
                    label="Amount Paid"
                    type="number"
                    placeholder="Amount Paid"
                    fullWidth
                    error={hasError}
                    helperText={hasError ? form.errors.amountPaid : ""}
                    onChange={(event) => {
                      setFieldValue("amountPaid", event.target.value);
                    }}
                  />
                );
              }}
            </Field>

            <Field name="discount">
              {({ field, form }) => {
                const hasError = Boolean(
                  form.errors.discount && form.touched.discount
                );
                return (
                  <TextField
                    {...field}
                    label="Discount"
                    type="number"
                    placeholder="Discount"
                    fullWidth
                    error={hasError}
                    helperText={hasError ? form.errors.discount : ""}
                    onChange={(event) => {
                      setFieldValue("discount", event.target.value);
                    }}
                  />
                );
              }}
            </Field>

            <div className="bottom_left">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  submitForm(); // Trigger form submission
                }}
                disabled={loading || isSubmitting} // Disable button when loading or submitting
              >
                {loading ? <CircularProgress /> : "Save and Print"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  submitForm(); // Trigger form submission
                }}
                disabled={loading || isSubmitting} // Disable button when loading or submitting
              >
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
        message={"Sales successfully Recorded"}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      {/* Modal for insufficient inventory */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"Insufficient Inventory"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {modalMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding new products */}
      <Dialog
        open={newProductDialogOpen}
        onClose={() => setNewProductDialogOpen(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details of the new product.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            fullWidth
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Sales Price"
            fullWidth
            value={newProductSalesPrice}
            onChange={(e) => setNewProductSalesPrice(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Cost Price"
            fullWidth
            value={newProductCostPrice}
            onChange={(e) => setNewProductCostPrice(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Available Quantity"
            fullWidth
            value={newProductOnhand}
            onChange={(e) => setNewProductOnhand(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setNewProductDialogOpen(false)}
            color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewProductSubmit} color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default ReceiveInvetory;
