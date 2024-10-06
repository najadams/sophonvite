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
  Alert,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Input } from "@mui/material";
import * as Yup from "yup";
import { capitalizeFirstLetter, tableActions, updateValuesAfterRestock } from "../../config/Functions";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useQuery } from "react-query";

const validationSchema = Yup.object().shape({
  products: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Product name is required"),
      quantity: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1"),
      costPrice: Yup.number().required("Cost Price is required"),
      salesPrice: Yup.number().required("Sales Price is required"),
    })
  ),
  total: Yup.number().required(),
  amountPaid: Yup.number().required("Amount Paid should not be empty"),
  discount: Yup.number().min(0, "Discount cannot be negative"),
});

const ReceiveInventory = ({
  Products,
  handleProductUpdate,
  setProducts
}) => {
  const worker = useSelector((state) => state.userState.currentUser);
  const workerId = worker._id;
  const companyId = useSelector((state) => state.companyState.data.id);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmittingSupplier, setIsSubmittingSupplier] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const matchesMobile = useMediaQuery("(max-width:600px)");
  const [loading, setLoading] = useState(false);
  
  const [supplierOptions, setSupplierOptions] = useState([
    {
      id: 1,
      name: "<<<< Add New Supplier >>>>",
    },
  ]);
  const [productOptions, setProductOptions] = useState([
    {
      id: 1,
      name: "<<<< Add New Product >>>>",
    },
    ...Products,
  ]);

  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);
  const [newSupplierDialogOpen, setNewSupplierDialogOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductSalesPrice, setNewProductSalesPrice] = useState("");
  const [newProductCostPrice, setNewProductCostPrice] = useState("");
  const [newProductOnhand, setNewProductOnhand] = useState("");

  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierCompany, setNewSupplierCompany] = useState("");
  const [newSupplierContact, setNewSupplierContact] = useState("");
  
  const handleSubmit = async (values, setSubmitting, resetForm) => {
    console.log(values)
    const total = values.products.reduce(
      (sum, product) => sum + product?.totalPrice,
      0
    );
    values.total = total; 
    const balance = values.total - values.amountPaid - values.discount;

    try {
      if (!values.amountPaid) {
        setError("Amount Paid Should not be Empty!");
      } else {
        setLoading(true);
        setSubmitting(true);
        await tableActions.restock(
          { ...values, balance, workerId },
          companyId,
        );
        const newProductsData = updateValuesAfterRestock(productOptions, values)
        console.log(newProductsData)
        // setProducts(newProductsData);
        setOpen(true);
        setTimeout(() => {
          resetForm();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setError(error || error.toString());
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };


  const handleNewProductSubmit = async () => {
    try {
      setIsSubmittingProduct(true)
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
          costPrice: parseFloat(newProductCostPrice) || 0, // Ensure numeric value
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
          costPrice: parseFloat(newProductCostPrice) || 0, // Ensure numeric value
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
  const handleNewSupplierSubmit = async () => {
    try {
      setIsSubmittingSupplier(true);
    const data = await tableActions.addSupplier({
      companyId,
      supplierName: newSupplierName,
      companyName: newSupplierCompany,
      contact: newSupplierContact,
    });

    console.log("Supplier added successfully:", data); // Check if this logs

    const newSupplier = data?.data; // Make sure data is as expected

    // Update supplier options using a functional state update
    setSupplierOptions((prevOptions) => [
      "<<<< Add New Supplier >>>>",
      ...prevOptions.filter(
        (option) => option !== "<<<< Add New Supplier >>>>"
      ),
      newSupplierName,
    ]);

    // Close the dialog
    console.log("this should not work")
    setNewSupplierDialogOpen(false);

    // Clear the input fields
    setNewSupplierName("");
    setNewSupplierCompany("");
    setNewSupplierContact("");
  } catch (error) {
    console.log("Error adding supplier:", error);
    setError("Failed to add new Supplier");
  }
};

 const {
   data: suppliers,
   isLoading: isSuppliersLoading,
   isError: isSuppliersError,
   error: suppliersError, // Capture error
 } = useQuery(
   ["suppliers", companyId],
   () => tableActions.fetchSuppliersNames(companyId),
   {
     enabled: !!companyId,
     onError: (error) => {
       console.error("Error fetching suppliers:", error);
     },
   }
   );
  
  useEffect(() => {
    if (suppliers) {
      setSupplierOptions([
        "<<<< Add New Supplier >>>>",
        ...suppliers
      ]);
    }
  }, [suppliers]);

  return (
    <div>
      <div className="heading" style={{ background: "none" }}>
        <h1 style={{ fontWeight: 200 }}>Receive Items / Restock </h1>
        {open && (
          <Alert
            variant="filled"
            severity={alert.type}
            onClose={() => setOpen(false)}>
            Restock successful
          </Alert>
        )}
      </div>
      <Formik
        initialValues={{
          supplierName: "",
          products: [
            {
              name: "",
              quantity: "",
              totalPrice: 0,
              costPrice: 0,
              salesPrice: 0,
            },
          ],
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
            <Field name="supplierName">
              {({ field, form }) => {
                const hasError = Boolean(
                  form.errors.supplierName && form.touched.supplierName
                );
                return (
                  <Autocomplete
                    {...field}
                    options={capitalizeFirstLetter(supplierOptions)}
                    autoHighlight
                    value={field.value}
                    onChange={(event, newValue) => {
                      if (newValue === "<<<< Add New Supplier >>>>") {
                        setNewSupplierDialogOpen(true);
                        form.setFieldValue(field.name, "");
                      } else {
                        form.setFieldValue(field.name, newValue || "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ paddingBottom: 10 }}
                        label="Supplier Name"
                        fullWidth
                        error={hasError}
                        helperText={hasError ? form.errors.supplierName : ""}
                      />
                    )}
                  />
                );
              }}
            </Field>
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
                                autoHighlight
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
                                      selectedProduct?.costPrice;
                                    setFieldValue(
                                      `products.${index}.totalPrice`,
                                      newTotalPrice
                                    );
                                    setFieldValue(
                                      `products.${index}.costPrice`,
                                      selectedProduct?.costPrice || 0
                                    );
                                    setFieldValue(
                                      `products.${index}.salesPrice`,
                                      selectedProduct?.salesPrice || 0
                                    );
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    style={{
                                      flex: 1,
                                      width: matchesMobile ? 150 : 350,
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
                            as={TextField}
                            fullWidth
                            style={{ minWidth: 120 }}
                            name={`products.${index}.quantity`}
                            label="Quantity"
                            type="number"
                            onChange={(event) => {
                              const newQuantity = parseInt(event.target.value);
                              setFieldValue(
                                `products.${index}.quantity`,
                                newQuantity
                              );

                              const currentCostPrice =
                                values.products[index].costPrice || 0;
                              const newTotalPrice =
                                newQuantity * currentCostPrice;

                              setFieldValue(
                                `products.${index}.totalPrice`,
                                newTotalPrice
                              );
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flex: 1, gap: 10 }}>
                          <Field name={`products.${index}.costPrice`}>
                            {({ field }) => (
                              <TextField
                                {...field}
                                label="Cost Price"
                                type="number"
                                style={{ minWidth: 120 }}
                                fullWidth
                                InputProps={{ style: { textAlign: "right" } }}
                                onChange={(event) => {
                                  const newPrice = parseFloat(
                                    event.target.value
                                  );
                                  setFieldValue(
                                    `products.${index}.costPrice`,
                                    newPrice
                                  );

                                  const currentQuantity =
                                    values.products[index].quantity || 0;
                                  const newTotalPrice =
                                    currentQuantity * newPrice;

                                  setFieldValue(
                                    `products.${index}.totalPrice`,
                                    newTotalPrice
                                  );
                                }}
                              />
                            )}
                          </Field>

                          <Field name={`products.${index}.salesPrice`}>
                            {({ field, form }) => (
                              <TextField
                                {...field}
                                label="Sales Price"
                                type="number"
                                style={{ minWidth: 120 }}
                                fullWidth
                                InputProps={{ style: { textAlign: "right" } }}
                                onChange={(event) => {
                                  const newPrice = parseFloat(
                                    event.target.value
                                  );
                                  setFieldValue(
                                    `products.${index}.salesPrice`,
                                    newPrice
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
                        costPrice: 0,
                        salesPrice: 0,
                      });
                    }}
                    disabled={
                      values.products?.length > 0 &&
                      !Object.values(
                        values.products[values.products?.length - 1]
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
                {loading ? <CircularProgress /> : "Restock"}
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
            label="Cost Price"
            fullWidth
            type="number"
            value={newProductCostPrice}
            onChange={(e) => setNewProductCostPrice(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Sales Price"
            fullWidth
            value={newProductSalesPrice}
            type="number"
            onChange={(e) => setNewProductSalesPrice(e.target.value)}
          />
          {/* <TextField
            margin="dense"
            label="Available Quantity"
            fullWidth
            value={newProductOnhand}
            onChange={(e) => setNewProductOnhand(e.target.value)}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setNewProductDialogOpen(false)}
            color="primary">
            Cancel
          </Button>
          {!isSubmittingProduct ?
            (<Button onClick={handleNewProductSubmit} color="primary">
            Add Product
            </Button>) : (
              <CircularProgress />
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog for adding new supplier */}
      <Dialog
        open={newSupplierDialogOpen}
        onClose={() => setNewSupplierDialogOpen(false)}>
        <DialogTitle>Add Supplier</DialogTitle>
        <DialogContent>
          <DialogContentText>Details of the new Suppler.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Supplier's Company"
            fullWidth
            value={newSupplierCompany}
            onChange={(e) => setNewSupplierCompany(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Suppliers Name"
            fullWidth
            value={newSupplierName}
            onChange={(e) => setNewSupplierName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contact"
            fullWidth
            type="number"
            value={newSupplierContact}
            onChange={(e) => setNewSupplierContact(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setNewSupplierDialogOpen(false)}
            color="primary">
            Cancel
          </Button>
          {isSubmittingSupplier ? (
            <CircularProgress size={24} />
          ) : (
            <Button onClick={handleNewSupplierSubmit} color="primary">
              Add Supplier
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReceiveInventory;
