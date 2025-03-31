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
import { validateFields } from "../../config/Functions";
import Loader from "../common/Loader";
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
import { useLocation, useNavigate } from "react-router-dom";
import { set } from "date-fns";
import { motion } from "framer-motion";

const validationSchema = Yup.object().shape({
  customerName: Yup.string().required("Customer name is required"),
  products: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Product name is required"),
      quantity: Yup.number().required("Quantity is required"),
      price: Yup.number().required("Price is required").min(1, "Quantity can't be less than 1"),
    })
  ),
  total: Yup.number().required(),
  amountPaid: Yup.number().required("Amount Paid should not be empty"),
  discount: Yup.number().min(0, "Discount cannot be negative"),
});

const EditSales = () => {
  const navigate = useNavigate();
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
  const [customerOptions, setCustomerOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false);
  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await tableActions.fetchCustomersNames(companyId);
      setCustomerOptions(["<<<< Add New Customer >>>>", ...response]);
    };
    fetchCustomers();
  }, [companyId]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await tableActions.fetchProductNames(companyId);
      setProductOptions([
        {
          id: 1,
          name: "<<<< Add New Product >>>>",
        },
        ...response,
      ]);
    };
    fetchProducts();
  }, [companyId]);

  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerCompany, setNewCustomerCompany] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    salesPrice: "",
    costPrice: "",
    onhand: "",
  });
  const getInitialValues = () => {
    if (row) {
      // Populate the form with existing data when editing
      const products = row?.detail?.map((product) => {
        const ceil = Math.ceil(product.salesPrice * product.quantity);
        return {
          name: product.name,
          quantity: product.quantity,
          totalPrice: ceil, // Calculate total price as salesPrice * quantity
          price: product.salesPrice,
        };
      });

      // Calculate the total as the sum of all product totalPrice values
      const total = products.reduce(
        (acc, product) => acc + product.totalPrice,
        0
      );

      const usedCustomerName = row.customerCompany
        ? `${capitalizeFirstLetter(
            row.customerCompany
          )} - ${capitalizeFirstLetter(row.customerName)}`
        : `None - ${capitalizeFirstLetter(row.customerName)}`;

      return {
        customerName: usedCustomerName || "",
        products: products,
        total: total, // Accumulated total of all products
        amountPaid: row.amountPaid || "",
        discount: row.discount || 0,
      };
    } else {
      // Default empty form values
      return {
        customerName: "",
        products: [{ name: "", quantity: "", totalPrice: 0, price: 0 }],
        total: 0,
        amountPaid: "",
        discount: 0,
      };
    }
  };

  const validateReceiptDetail = (values) => {
    let detailErrors = {};

    console.log(values.products);
    const details = values.products;

    if (details) {
      details.forEach((detail, index) => {
        console.log(detail.name, detail.quantity, detail.price);

        if (!detail.name) {
          detailErrors[`products.${index}.product`] = `Product ${
            index + 1
          }'s name is required`;
        }
        if (!detail.quantity) {
          detailErrors[`products.${index}.quantity`] = `Product ${
            index + 1
          }'s quantity is required`;
        }
        if (parseFloat(detail.quantity )< 1) {
          detailErrors[`products.${index}.quantity`] = `Product ${
            index + 1
          }'s price can't be less than 1`;
        }
        if (!detail.price) {
          detailErrors[`products.${index}.price`] = `Product ${
            index + 1
          }'s price is required`;
        }
      });
    }

    setDetailErrors(detailErrors);
    return detailErrors; // Return the error object
  };

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
      const results = await tableActions.updateReceipt(
        row._id,
        { ...values, balance },
        companyId,
        workerId
      );

      setModalMessage("Receipt added successfully!");

      // Update inventory onhand after sale
      const newData = updateOnhandAfterSale(productOptions, values);
      setProductOptions(newData);

      // Store values for printing, if applicable
      if (print) {
        setPrintValues({ ...values, balance });
      }

      // Reset form after a short delay
      setTimeout(() => {
        navigate("/sales");
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
        setError(response);
        setSubmittingForm(false);
        return;
      } else {
        setCustomerError("");
        setNewCustomerDialogOpen(false);
      }

      // if (!response.name) {
      //   throw new Error("Customer name is missing in server response");
      // }

      // Format the display name only after confirming we have valid data
      let displayName;
      if (response.company && response.company.trim()) {
        displayName = `${capitalizeFirstLetter(
          response.company
        )} - ${capitalizeFirstLetter(response.name)}`;
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
        console.log("error part");
        setError(error.response.message || "Failed to add new customer");
      }
      <ErrorAlert error={error} onClose={() => setError(null)} />;
      console.error("Error adding new customer:", error);
      setSubmittingForm(false);
      setCustomerError(error.message || "Failed to add new customer");
      // Don't close the dialog when there's an error
    }
  };

  const handleNewProductSubmit = async () => {
    try {
      if (!validateFields(newProduct, setErrors)) return; // Validate the input fields
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

      // Close dialog and reset form
      setNewProductDialogOpen(false);
      setSubmittingForm(false);
      setNewProduct({ name: "", salesPrice: "", costPrice: "", onhand: "" });
    } catch (error) {
      setSubmittingForm(false);
      setError(error.message || "Failed to add new product");
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page">
      <div
        className="heading"
        style={{ background: "none", marginBottom: "2rem" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            color: "#333",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}>
          <i
            className="bx bx-edit"
            style={{ fontSize: "2rem", color: "#2196f3" }}></i>
          Edit Sales
        </Typography>
      </div>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleSubmit(values, setSubmitting, resetForm);
        }}>
        {({ values, submitForm, setFieldValue, isSubmitting, resetForm }) => (
          <Form
            className="form"
            style={{
              margin: "1rem",
              padding: "2rem",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}>
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
                        style={{ marginBottom: "1.5rem" }}
                        label="Customer Name"
                        fullWidth
                        error={hasError}
                        helperText={hasError ? form.errors.customerName : ""}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#666",
                          },
                        }}
                      />
                    )}
                  />
                );
              }}
            </Field>

            <div
              style={{
                height: "2px",
                background: "linear-gradient(90deg, #2196f3, #f50057)",
                marginBottom: "2rem",
                borderRadius: "2px",
              }}
            />

            <FieldArray name="products">
              {({ push, remove }) => (
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    flexDirection: "column",
                  }}>
                  {values.products?.map((product, index) => {
                    const productItems = productOptions.map(
                      (p) => p?.name || ""
                    );
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        style={{
                          display: "flex",
                          flex: 1,
                          gap: "1rem",
                          flexWrap: "wrap",
                          flexDirection: matchesMobile ? "column" : "row",
                          padding: "1rem",
                          background: "#f8f9fa",
                          borderRadius: "8px",
                          marginBottom: "1rem",
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
                                    );
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    style={{
                                      flex: 1,
                                      width: matchesMobile ? "100%" : "400px",
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
                                    variant="outlined"
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                      },
                                      "& .MuiInputLabel-root": {
                                        color: "#666",
                                      },
                                    }}
                                  />
                                )}
                              />
                            )}
                          </Field>

                          <Field
                            as={TextField}
                            error={
                              !!detailError?.[`products.${index}.quantity`]
                            }
                            helperText={
                              detailError?.[`products.${index}.quantity`] || ""
                            }
                            name={`products.${index}.quantity`}
                            label="Quantity"
                            type="number"
                            step="any"
                            style={{
                              width: matchesMobile ? "100%" : "150px",
                            }}
                            onChange={(event) => {
                              const value = event.target.value;
                              const newQuantity = parseFloat(value);
                              setFieldValue(
                                `products.${index}.quantity`,
                                newQuantity
                              );
                              const selectedProduct = productOptions.find(
                                (p) => p.name === product.name
                              );
                              if (selectedProduct) {
                                const currentPrice =
                                  values.products[index].price ||
                                  selectedProduct.salesPrice;
                                const newTotalPrice = Math.ceil(
                                  newQuantity * currentPrice
                                );
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
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                              "& .MuiInputLabel-root": {
                                color: "#666",
                              },
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            gap: "1rem",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}>
                          <Field name={`products.${index}.price`}>
                            {({ field }) => (
                              <TextField
                                {...field}
                                label="Price"
                                type="number"
                                style={{
                                  width: matchesMobile ? "100%" : "150px",
                                  flex: 1,
                                }}
                                fullWidth
                                error={
                                  !!detailError?.[`products.${index}.price`]
                                }
                                helperText={
                                  detailError?.[`products.${index}.price`] || ""
                                }
                                variant="outlined"
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
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    color: "#666",
                                  },
                                }}
                              />
                            )}
                          </Field>
                          <Field name={`products.${index}.totalPrice`}>
                            {({ field }) => (
                              <TextField
                                {...field}
                                value={product.totalPrice}
                                label="Total Price"
                                readOnly
                                style={{
                                  width: matchesMobile ? "100%" : "150px",
                                  flex: 1,
                                }}
                                variant="outlined"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    backgroundColor: "#f8f9fa",
                                  },
                                  "& .MuiInputLabel-root": {
                                    color: "#666",
                                  },
                                }}
                              />
                            )}
                          </Field>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => remove(index)}
                            sx={{
                              borderRadius: "8px",
                              textTransform: "none",
                              height: "40px",
                              minWidth: "100px",
                            }}>
                            Remove
                          </Button>
                        </div>
                      </motion.div>
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
                    }
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      height: "45px",
                      marginTop: "1rem",
                    }}>
                    <i
                      className="bx bx-plus"
                      style={{ marginRight: "8px" }}></i>
                    Add Product
                  </Button>
                </div>
              )}
            </FieldArray>

            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "#f8f9fa",
                borderRadius: "8px",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}>
                <Typography variant="h6" sx={{ color: "#333" }}>
                  Total
                </Typography>
                <Field name="total">
                  {() => (
                    <Typography variant="h6" sx={{ color: "#2196f3" }}>
                      ₵
                      {values.products?.reduce(
                        (sum, product) => sum + (product?.totalPrice || 0),
                        0
                      )}
                    </Typography>
                  )}
                </Field>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginBottom: "1rem",
                }}>
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
                        variant="outlined"
                        onChange={(event) => {
                          setFieldValue("amountPaid", event.target.value || 0);
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#666",
                          },
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
                        variant="outlined"
                        onChange={(event) => {
                          setFieldValue("discount", event.target.value);
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#666",
                          },
                        }}
                      />
                    );
                  }}
                </Field>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  background: "white",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}>
                <Typography variant="h6" sx={{ color: "#333" }}>
                  Balance
                </Typography>
                <Field name="balance">
                  {() => (
                    <Typography
                      variant="h6"
                      sx={{
                        color:
                          values.products?.reduce(
                            (sum, product) => sum + (product?.totalPrice || 0),
                            0
                          ) -
                            values.amountPaid -
                            values.discount >
                          0
                            ? "#f44336"
                            : "#4caf50",
                        fontWeight: 600,
                      }}>
                      ₵
                      {values.products?.reduce(
                        (sum, product) => sum + (product?.totalPrice || 0),
                        0
                      ) -
                        values.amountPaid -
                        values.discount}
                    </Typography>
                  )}
                </Field>
              </div>
            </div>

            <div
              style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                display: "flex",
                gap: "1rem",
                zIndex: 1000,
                background: "white",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setPrint(true);
                  submitForm();
                }}
                disabled={loading || isSubmitting}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  height: "45px",
                  minWidth: "150px",
                }}>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <i
                      className="bx bx-printer"
                      style={{ marginRight: "8px" }}></i>
                    Save and Print
                  </>
                )}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  submitForm();
                }}
                disabled={loading || isSubmitting}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  height: "45px",
                  minWidth: "120px",
                }}>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <i
                      className="bx bx-save"
                      style={{ marginRight: "8px" }}></i>
                    Save
                  </>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {/* ... existing dialogs and modals ... */}
    </motion.div>
  );
};

export default EditSales;
