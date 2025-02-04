import { useState, useContext } from "react";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import LinearProgress from "@mui/material/LinearProgress";
import { Typography, Snackbar } from "@mui/material";
import { DialogContext } from "../../context/context";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "../../actions/action";
import { tableActions } from "../../config/Functions";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  costPrice: Yup.number().required("Required"),
  salesPrice: Yup.number().required("Required"),
  onhand: Yup.number().required("Required"),
});

const ProductForm = ({ data, editMutation }) => {
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const companyId = useSelector((state) => state.companyState.data.id);
  const handleClose = useContext(DialogContext);
  const dispatch = useDispatch();

  return (
    <div>
      <h1 style={{marginBottom: 30}}>Product Information</h1>
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
              }
            }
            if (error) {
              setError(error); // Set the error state if there's an error
            } else {
              setOpen(true); // Open the Snackbar on success
              editMutation.mutate(values);
              setTimeout(() => {
                handleClose(); // Close the Snackbar after a delay
              }, 2000);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setSubmitting(false);
          }
        }}>
        {({ submitForm, isSubmitting, handleChange, resetForm }) => (
          <Form className="form">
            <Field
              component={TextField}
              name="name"
              type="text"
              label="Name"
              onBlur={(e) => {
                const trimmedValue = e.target.value.trim(); // Trim leading and trailing whitespace
                const lowercaseValue = trimmedValue.toLowerCase(); // Convert to lowercase
                e.target.value = lowercaseValue; // Update the input value
                handleChange(e); // Proceed with Formik's handleChange
              }}
            />
            <br />
            <Field
              component={TextField}
              type="number"
              label="costPrice"
              name="costPrice"
            />
            <br />
            <Field
              component={TextField}
              type="number"
              label="salesPrice"
              name="salesPrice"
            />
            <br />
           <Field
              component={TextField}
              type="number"
              label="onhand"
              name="onhand"
              //disabled={data}
            />
            <br />
            {isSubmitting && <LinearProgress />}
            <br />
            {done ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  resetForm();
                  setDone(false);
                }}>
                Product Added! Click to Add New Product
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}>
                {data ? "Save Changes" : "Add Product"}
              </Button>
            )}
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
        message={
          !data ? "Product added successfully" : "Product Changed Successfully"
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </div>
  );
};

export default ProductForm;
