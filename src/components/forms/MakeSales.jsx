import React, { useState, useRef, useEffect } from "react";
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
import ErrorAlert from "../../utils/Error";
import { Autocomplete } from "@mui/material";
import { Input } from "@mui/material";
import * as Yup from "yup";
import {
  capitalizeFirstLetter,
  tableActions,
  updateOnhandAfterSale,
} from "../../config/Functions";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import ReceiptTemplate from "../compPrint/ReceiptTemplate";
import { useLocation } from "react-router-dom";
import Loader from "../common/Loader";
const validationSchema = Yup.object().shape({
  customerName: Yup.string().required("Customer name is required"),
  // products: Yup.array().of(
  //   Yup.object().shape({
  //     name: Yup.string().required("Product name is required"),
  //     quantity: Yup.number().required("Quantity is required"),
  //     // .test(
  //     //   "is-valid-fraction",
  //     //   "Quantity must be a valid number or fraction (e.g., 1/2, 1/4)",
  //     //   (value) => {
  //     //     if (value < 0.1) return false; // Ensure at least 1/4 (0.25) as the minimum
  //     //     return true;
  //     //   }
  //     // )
  //     // .min(0.1, "Quantity must be at least 1/10"), // Allow for fractional quantities like 1/4 (0.25)
  //     price: Yup.number().required("Price is required"),
  //   })
  // ),
  total: Yup.number().required(),
  amountPaid: Yup.number().required("Amount Paid should not be empty"),
  discount: Yup.number().min(0, "Discount cannot be negative"),
});

const MakeSales = ({
  customers,
  Products,
  handleCustomerUpdate,
  handleProductUpdate,
  editData,
}) => {
  const checkDebt = true;
  const location = useLocation();
  const { row } = location.state || {};
  const worker = useSelector((state) => state.userState.currentUser);
  const workerId = worker._id;
  const companyId = useSelector((state) => state.companyState.data.id);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [detailError, setDetailErrors] = useState({});
  const [owesDebt, setOwesDebt] = useState(false);
  const [open, setOpen] = useState(false);
  const [print, setPrint] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const matchesMobile = useMediaQuery("(max-width:600px)");
  const [loading, setLoading] = useState(false);
  const printRef = useRef();
  const [printValues, setPrintValues] = useState(null);
  const today = new Date().toLocaleDateString();
  const [customerError, setCustomerError] = useState("");
  const [submittingForm, setSubmittingForm] = useState(false);
  const [customerOptions, setCustomerOptions] = useState([
    "<<<< Add New Customer >>>>",
    ...customers.sort().filter((options) => options !== "<<<< Add New Customer >>>>"),
  ]);
  const [productOptions, setProductOptions] = useState([
    {
      id: 1,
      name: "<<<< Add New Product >>>>",
    },

    ...Products.sort((a, b) => a.name.localeCompare(b.name)).filter(
      (option) =>
        option !== "<<<< Add New Product >>>>" 
    ),
  ]);

  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false);
  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerCompany, setNewCustomerCompany] = useState("");
const [newProduct, setNewProduct] = useState({
  name: "",
  salesPrice: "",
  costPrice: "",
  onhand: "",
});  const getInitialValues = () => {
    // Default empty form values
    return {
      customerName: "",
      products: [{ name: "", quantity: "", totalPrice: 0, price: 0 }],
      total: 0,
      amountPaid: "",
      discount: 0,
    };
};
  
  const validateReceiptDetail = (values) => {
    let detailErrors = {};

    console.log(values.products);
    const details = values.products;

    if (details) {
      details.forEach((detail, index) => {
        console.log(detail.name, detail.quantity, detail.price);

        if (!detail.name) {
          detailErrors[`products.${index}.product`] =
            `Product ${index+1}'s name is required`;
        }
        if (!detail.quantity) {
          detailErrors[`products.${index}.quantity`] = `Product ${index+1}'s quantity is required`;
        }
        if (!detail.price) {
          detailErrors[`products.${index}.price`] = `Product ${
            index + 1
          }'s price is required`;;
        }
      });
    }

    setDetailErrors(detailErrors);
    return detailErrors; // Return the error object
  };



  // const handleSubmit = async (values, setSubmitting, resetForm) => {
  //   const total = values.products.reduce(
  //     (sum, product) => sum + product?.totalPrice,
  //     0
  //   );
  //   values.total = total; // Maintain total before discount
  //   const balance = values.total - values.amountPaid - values.discount;

  //   try {
  //     const errors = validateReceiptDetail(values);
  //     if (Object.keys(errors).length > 0) {
  //       setError("Please correct the errors before submitting.");
  //       throw new Error("Validation error");
  //     }
  //     if (!values.customerName) {
  //       setError("Customer Name should not be empty");
  //     } else if (!values.amountPaid) {
  //       setError("Amount Paid should not be empty!");
  //     } else {
  //       setLoading(true);
  //       setSubmitting(true);

  //       // Call the API to add receipt and check for debt
  //       const results = await tableActions.addReceipt(
  //         { ...values, balance },
  //         companyId,
  //         workerId,
  //         checkDebt
  //       );

  //       // Check if debt exists in the response
  //       if (results.existingDebt) {
  //         setOwesDebt(true);
  //         setModalMessage(
  //           `Customer has existing debt of ${results.existingDebt.amount}.`
  //         );
  //         setOpen(true); // Open modal to show debt information
  //       } else {
  //         setModalMessage("Receipt added successfully!");
  //         setOpen(true);
  //       }

  //       // Update inventory onhand after sale
  //       const newData = updateOnhandAfterSale(productOptions, values);
  //       setProductOptions(newData);

  //       // Store values for printing if applicable
  //       if (print) {
  //         setPrintValues({ ...values, balance });
  //       }
  //       // Reset form after a short delay
  //       setTimeout(() => {
  //         resetForm();
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setError(error.message || "An error occurred");
  //   } finally {
  //     setSubmitting(false);
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (values, setSubmitting, resetForm) => {
  //   const total = values.products.reduce(
  //     (sum, product) => sum + (product?.totalPrice || 0),
  //     0
  //   );
  //   values.total = total; // Maintain total before discount
  //   const balance = values.total - values.amountPaid - values.discount;

  //   try {
  //     const errors = validateReceiptDetail(values);
  //     if (errors) {
  //       console.log(errors)
  //       setError(detailError.name || detailError.quantity || detailError.price);
  //       return; // Stop execution if validation fails
  //     }

  //     if (!values.customerName) {
  //       setError("Customer Name should not be empty");
  //       return;
  //     }

  //     if (!values.amountPaid) {
  //       setError("Amount Paid should not be empty!");
  //       return;
  //     }

  //     setLoading(true);
  //     setSubmitting(true);

  //     // Call the API to add receipt and check for debt
  //     const results = await tableActions.addReceipt(
  //       { ...values, balance },
  //       companyId,
  //       workerId,
  //       checkDebt
  //     );

  //     // Check if debt exists in the response
  //     if (results.existingDebt) {
  //       setOwesDebt(true);
  //       setModalMessage(
  //         `Customer has existing debt of ${results.existingDebt.amount}.`
  //       );
  //       setOpen(true); // Open modal to show debt information
  //     } else {
  //       setModalMessage("Receipt added successfully!");
  //       setOpen(true);
  //     }

  //     // Update inventory onhand after sale
  //     const newData = updateOnhandAfterSale(productOptions, values);
  //     setProductOptions(newData);

  //     // Store values for printing if applicable
  //     if (print) {
  //       setPrintValues({ ...values, balance });
  //     }

  //     // Reset form after a short delay
  //     setTimeout(() => {
  //       resetForm();
  //     }, 1000);
  //   } catch (error) {
  //     console.log(error);
  //     setError(error.message || "An error occurred");
  //   } finally {
  //     setSubmitting(false);
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (values, setSubmitting, resetForm) => {
    // Calculate total price
    const total = values.products.reduce(
      (sum, product) => sum + (product?.totalPrice || 0),
      0
    );
    values.total = total; // Maintain total before discount
    const balance = values.total - values.amountPaid - values.discount;

    try {
      // Validate product details
      const errors = validateReceiptDetail(values);
      if (Object.keys(errors).length > 0) {
        console.log(errors);
        setError("Please fill in all required fields correctly.");
        return; // Stop execution if validation fails
      }

      // Validate customer name
      if (!values.customerName?.trim()) {
        setError("Customer Name should not be empty");
        return;
      }

      // Validate amount paid
      if (values.amountPaid === undefined || values.amountPaid === "") {
        setError("Amount Paid should not be empty!");
        return;
      }

      setLoading(true);
      setSubmitting(true);

      // Call API to add receipt and check for debt
      const results = await tableActions.addReceipt(
        { ...values, balance },
        companyId,
        workerId,
        checkDebt
      );

      // Handle existing debt scenario
      if (results.existingDebt) {
        setOwesDebt(true);
        setModalMessage(
          `Customer has an existing debt of ${results.existingDebt.amount}.`
        );
        setOpen(true);
      } else {
        setModalMessage("Receipt added successfully!");
        setOpen(true);
      }

      // Update inventory onhand after sale
      const newData = updateOnhandAfterSale(productOptions, values);
      setProductOptions(newData);

      // Store values for printing, if applicable
      if (print) {
        setPrintValues({ ...values, balance });
      }

      // Reset form after a short delay
      setTimeout(() => {
        resetForm();
      }, 1000);
    } catch (error) {
      console.log(error);
      setError(error.message || "An error occurred");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleNewCustomerSubmit = async () => {
    try {
      setSubmittingForm(true);
      setCustomerError(""); // Reset error state

      // Input validation
      if (!newCustomerName.trim()) {
        setCustomerError("Customer name is required");
        return;
      }

      const formattedName = newCustomerName.trim().toLowerCase();

      // Create customer object with company
      const customerData = {
        name: formattedName,
        company: newCustomerCompany.trim(),
        companyId,
      };

      // Make the API call
      const response = await tableActions.addCustomer(customerData);

      // Validate API response
      if (!response || typeof response !== "object") {
        setError(response)
        setSubmittingForm(false)
        return;
      }

      // if (!response.name) {
      //   throw new Error("Customer name is missing in server response");
      // }

      // Format the display name only after confirming we have valid data
      let displayName;
      if (response.company && response.company.trim()) {
        displayName = `${capitalizeFirstLetter(response.company)} - ${
          capitalizeFirstLetter(response.name)
        }`;
      } else {
        displayName = capitalizeFirstLetter(response.name); // Remove the "None -" prefix
      }

      // Update customer options only if we have a valid displayName
      if (displayName) {
        // Update customer options
        setCustomerOptions((prevOptions) => {
          const filteredOptions = prevOptions.filter(
            (option) =>
              option !== "<<<< Add New Customer >>>>" && option !== displayName // Remove any existing entry for this customer
          );
          return [
            "<<<< Add New Customer >>>>",
            displayName,
            ...filteredOptions,
          ].sort((data) => data.name);
        });

        // Update parent component's customer list
        handleCustomerUpdate((prevOptions) => {
          const filteredOptions = prevOptions.filter(
            (option) =>
              option !== "<<<< Add New Customer >>>>" && option !== displayName
          );
          return [...filteredOptions, displayName].sort();
        });

        // Reset form and close dialog
        setSubmittingForm(false);
        setNewCustomerDialogOpen(false);
        setNewCustomerName("");
        setNewCustomerCompany("");
        setCustomerError("");
      } else {
        setSubmittingForm(false);
        setCustomerError(error.message || "Duplicate customer details");
        throw new Error("Failed to format customer name");
      }
    } catch (error) {
      setSubmittingForm(false);
      if (error.response) {
        console.log("error part")
        setError(error.response.message || "Failed to add new customer");
      }
      <ErrorAlert error={error} onClose={() => setError(null)} />;
      console.error("Error adding new customer:", error);
      setSubmittingForm(false)
      setCustomerError(error.message || "Failed to add new customer");
      // Don't close the dialog when there's an error
    }
  };

  const handleNewProductSubmit = async () => {
    try {
      if (!validateFields()) return; // Validate the input fields
      setSubmittingForm(true);
      // Ensure the product 
      // name is properly formatted
      const formattedProductName = newProduct.name.trim().toLowerCase();

      // Send request to add product
      const data = await tableActions.addProduct({
        ...newProduct,
        name: formattedProductName,
        companyId,
      });

      if (!data || !data.data) throw new Error(data);

      const addedProduct = data.data;

      // Update product options properly
      setProductOptions((prevOptions) => {
        const filteredOptions = prevOptions.filter(
          (option) => option.name !== "<<<< Add New Product >>>>"
        );
        return [
          { id: 1, name: "<<<< Add New Product >>>>" },
          ...filteredOptions,
          {
            name: capitalizeFirstLetter(addedProduct.name),
            salesPrice: addedProduct.salesPrice || 0,
            onhand: addedProduct.onhand || 0,
          },
        ].sort((a, b) => a.name.localeCompare(b.name));
      });

      // Update parent component's product list
      handleProductUpdate((prevOptions) => [
        { id: 1, name: "<<<< Add New Product >>>>" },
        {
          name: capitalizeFirstLetter(addedProduct.name),
          salesPrice: addedProduct.salesPrice || 0,
          onhand: addedProduct.onhand || 0,
        },
        ...prevOptions.filter(
          (option) => option.name !== "<<<< Add New Product >>>>"
        ),
      ]);

      // Close dialog and reset form
      setNewProductDialogOpen(false);
      setSubmittingForm(false);
      setNewProduct({ name: "", salesPrice: "", costPrice: "", onhand: "" });
    } catch (error) {
      setSubmittingForm(false)
      setError(error.message|| "Failed to add new product");
    }
  };


  // handle new product creation
  // Handle input change for new product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFields = () => {
    let newErrors = {};
    if (!newProduct.name.trim()) newErrors.name = "Product Name is required";
    if (!newProduct.salesPrice || newProduct.salesPrice <= 0)
      newErrors.salesPrice = "Sales Price must be a positive number";
    if (!newProduct.costPrice || newProduct.costPrice <= 0)
      newErrors.costPrice = "Cost Price must be a positive number";
    if (!newProduct.onhand || newProduct.onhand < 0)
      newErrors.onhand = "Available Quantity must be at least 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  return (
    <div>
      <Formik
        initialValues={getInitialValues()}
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
                    autoHighlight
                    options={capitalizeFirstLetter(customerOptions)}
                    value={field.value}
                    onChange={(event, newValue) => {
                      if (newValue === "<<<< Add New Customer >>>>") {
                        setNewCustomerDialogOpen(true);
                        form.setFieldValue(field.name, "");
                      } else {
                        form.setFieldValue(field.name, newValue || "");
                      }
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
                  {values.products?.map((product, index) => {
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
                                autoHighlight
                                options={productItems}
                                value={capitalizeFirstLetter(product.name)}
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
                                      Math.ceil(newTotalPrice)
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
                                    error={
                                      !!detailError?.[
                                        `products.${index}.product`
                                      ]
                                    }
                                    helperText={
                                      detailError?.[
                                        `products.${index}.product`
                                      ] || ""
                                    }
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
                            error={
                              !!detailError?.[`products.${index}.quantity`]
                            }
                            helperText={
                              detailError?.[`products.${index}.quantity`] || ""
                            }
                            name={`products.${index}.quantity`}
                            label="Quantity"
                            type="number" // Use "number" to ensure numeric keyboard on mobile
                            step="any" // Allow for decimal values
                            onChange={(event) => {
                              const value = event.target.value;
                              const newQuantity = parseFloat(value);

                              // First, set the new quantity value
                              setFieldValue(
                                `products.${index}.quantity`,
                                newQuantity
                              );

                              // Find the selected product
                              const selectedProduct = productOptions.find(
                                (p) => p.name === product.name
                              );

                              // Ensure we have a valid selected product
                              if (selectedProduct) {
                                // Get the current price from the field or fallback to the selected product's sales price
                                const currentPrice =
                                  values.products[index].price ||
                                  selectedProduct.salesPrice;

                                // Calculate the new total price based on quantity and price
                                const newTotalPrice = Math.ceil(
                                  newQuantity * currentPrice
                                );

                                // Set the new total price
                                setFieldValue(
                                  `products.${index}.totalPrice`,
                                  newTotalPrice
                                );
                              }
                            }}
                            onBlur={(event) => {
                              const value = parseFloat(event.target.value);
                              const selectedProduct = productOptions.find(
                                (p) => p.name === product.name
                              );

                              // Check if the quantity exceeds available stock
                              if (
                                selectedProduct &&
                                value > selectedProduct.onhand
                              ) {
                                setModalMessage(
                                  `Quantity cannot exceed available stock (${selectedProduct?.onhand})`
                                );
                                setModalOpen(true);
                              }
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", flex: 1, gap: 10 }}>
                          {/* <Field name={`products.${index}.price`}>
                            {({ field }) => (
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

                                  // First, set the new price in the form state
                                  setFieldValue(
                                    `products.${index}.price`,
                                    newPrice
                                  );

                                  // Then calculate and set the new total price
                                  const newTotalPrice =
                                    product.quantity * newPrice;
                                  setFieldValue(
                                    `products.${index}.totalPrice`,
                                    Math.ceil(newTotalPrice)
                                  );
                                }}
                              />
                            )}
                          </Field> */}
                          <Field name={`products.${index}.price`}>
                            {({ field }) => (
                              <TextField
                                {...field}
                                label="Price"
                                type="number"
                                style={{ minWidth: 150 }}
                                fullWidth
                                error={
                                  !!detailError?.[`products.${index}.price`]
                                }
                                helperText={
                                  detailError?.[`products.${index}.price`] || ""
                                }
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
                                    Math.ceil(newTotalPrice)
                                  );
                                  validateReceiptDetail(values);
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
              {() => (
                <Input
                  value={values.products?.reduce(
                    (sum, product) => sum + (product?.totalPrice || 0),
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}>
              <Field name="amountPaid">
                {({ field, form }) => {
                  const hasError = Boolean(
                    form.errors.amountPaid && form.touched.amountPaid
                  );
                  return (
                    <TextField
                      style={{ flex: 1 }}
                      {...field}
                      label="Amount Paid"
                      type="number"
                      placeholder="Amount Paid"
                      fullWidth
                      error={hasError}
                      helperText={hasError ? form.errors.amountPaid : ""}
                      onChange={(event) => {
                        setFieldValue("amountPaid", event.target.value || 0);
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
                      style={{ width: "50%" }}
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
            </div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <Typography
                sx={{ fontSize: "20px", textDecoration: "underline", pt: 2 }}>
                {" "}
                Balance
              </Typography>
              <Field name="balance">
                {() => (
                  <Input
                    value={
                      values.products?.reduce(
                        (sum, product) => sum + (product?.totalPrice || 0),
                        0
                      ) -
                      values.amountPaid -
                      values.discount
                    }
                    label="Balance"
                    readOnly
                    inputProps={{
                      style: { textAlign: "right" },
                    }}
                    style={{ flex: 1 }}
                  />
                )}
              </Field>
            </div>

            <div className="bottom_left">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setPrint(true);
                  submitForm(); // Trigger form submission
                }}
                disabled={loading || isSubmitting} // Disable button when loading or submitting
              >
                {loading ? <CircularProgress /> : "Save and Print"}
              </Button>
              <Button
                variant="contained"
                color="success"
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
      {error && <ErrorAlert error={error} onClose={() => setError(null)} />}
      <Snackbar
        sx={{
          "& .MuiSnackbarContent-root": {
            color: owesDebt ? "red" : "white",
          },
        }}
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message={modalMessage || "Sales successfully Recorded"}
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
          <Button autoFocus onClick={() => setModalOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for new customer */}
      <Dialog
        open={newCustomerDialogOpen}
        onClose={() => setNewCustomerDialogOpen(false)}
        aria-labelledby="new-customer-dialog-title"
        aria-describedby="new-customer-dialog-description">
        <DialogTitle id="new-customer-dialog-title">
          {"Add New Customer"}
        </DialogTitle>
        {submittingForm ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              width: 316,
              height: 300,
            }}>
            <Loader type={3} />
          </div>
        ) : (
          <>
            <DialogContent>
              <DialogContentText id="new-customer-dialog-description">
                Enter the name of the new customer:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="new-customer-name"
                label="Customer Name"
                type="text"
                fullWidth
                variant="standard"
                value={newCustomerName}
                onChange={(e) =>
                  setNewCustomerName(e.target.value.toLowerCase())
                }
              />
            </DialogContent>
            <DialogContent>
              <DialogContentText id="new-customer-dialog-description">
                Enter Company Name:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="new-customer-company"
                label="Company Name"
                type="text"
                fullWidth
                variant="standard"
                value={newCustomerCompany}
                onChange={(e) =>
                  setNewCustomerCompany(e.target.value.toLowerCase())
                }
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setNewCustomerDialogOpen(false)}
                color="primary">
                Cancel
              </Button>
              {newCustomerName && (
                <Button onClick={handleNewCustomerSubmit} color="primary">
                  Add
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog for new products */}
      <Dialog
        open={newProductDialogOpen}
        onClose={() => setNewProductDialogOpen(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        {submittingForm ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              width: 600,
              height: 316,
            }}>
            <Loader type={3} />
          </div>
        ) : (
          <>
            <DialogContent>
              <DialogContentText>
                Please enter the details of the new product.
              </DialogContentText>

              <TextField
                autoFocus
                margin="dense"
                label="Product Name"
                name="name"
                fullWidth
                required
                value={newProduct.name}
                onChange={handleInputChange} // ✅ Use the same function
                error={!!errors.name}
                helperText={errors.name}
              />

              <TextField
                margin="dense"
                label="Sales Price"
                type="number"
                name="salesPrice"
                fullWidth
                required
                value={newProduct.salesPrice}
                onChange={handleInputChange}
                error={!!errors.salesPrice}
                helperText={errors.salesPrice}
              />

              <TextField
                margin="dense"
                label="Cost Price"
                type="number"
                name="costPrice"
                fullWidth
                required
                value={newProduct.costPrice}
                onChange={handleInputChange}
                error={!!errors.costPrice}
                helperText={errors.costPrice}
              />

              <TextField
                margin="dense"
                label="Available Quantity"
                type="number"
                name="onhand"
                fullWidth
                required
                value={newProduct.onhand}
                onChange={handleInputChange}
                error={!!errors.onhand}
                helperText={errors.onhand}
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
          </>
        )}
      </Dialog>

      {/* Receipt Template for printing */}
      {printValues && (
        <div style={{ display: "none" }}>
          <ReceiptTemplate
            ref={printRef}
            customerName={printValues.customerName}
            products={printValues.products}
            total={printValues.total}
            balance={printValues.balance}
            amountPaid={printValues.amountPaid}
            discount={printValues.discount}
            date={today}
            workerName={worker.username ? worker.username : worker.name}
          />
        </div>
      )}
    </div>
  );
};

export default MakeSales;
