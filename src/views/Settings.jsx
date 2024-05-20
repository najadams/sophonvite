import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../config/Functions";
import { tableActions } from "../config/Functions";
import Loader from "../components/Loader";

const WorkerInfo = ({ workers }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Workers Information
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {workers.length > 0 ? (
        workers.map((worker) => (
          <Grid container spacing={3} key={worker._id}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Name:</strong> {capitalizeFirstLetter(worker.name)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Username:</strong> {worker.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Contact:</strong> {worker.contact}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Admin Status:</strong>{" "}
                {worker.adminstatus ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Can Make Sales:</strong>{" "}
                {worker.privileges.makeSalesOnly ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Can Add Inventory:</strong>{" "}
                {worker.privileges.addInventory ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Can Edit Data:</strong>{" "}
                {worker.privileges.editData ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Can Access Data:</strong>{" "}
                {worker.privileges.accessData ? "Yes" : "No"}
              </Typography>
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography variant="body1">
          Your Company has no worker except the Admin
        </Typography>
      )}
    </Paper>
  );
};

const Settings = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const storename = useSelector((state) => state.companyState.data.name);
  const {
    data: workers,
    isLoading,
    error,
  } = useQuery(["api/workers", companyId], () =>
    tableActions.fetchWorkers(companyId)
  );

  
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="page">
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Store Information
          </Typography>
          <Divider />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                // label="Store Name"
                fullWidth
                label={capitalizeFirstLetter(storename)}
                variant="outlined"
                margin="normal"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Postal Code"
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <Divider />
          <FormControlLabel
            control={<Switch />}
            label="Receive email notifications"
          />
          <FormControlLabel
            control={<Switch />}
            label="Receive SMS notifications"
          />
        </Paper>

        {isLoading ? (
          <div style={{ height: 100 }}>
            <Loader />
          </div>
        ) : (
          <WorkerInfo workers={workers} />
        )}

        <Button variant="contained" color="primary" sx={{ mt: 3 }}>
          Save Settings
        </Button>
      </Container>
    </div>
  );
};

export default Settings;
