import React, { useState } from "react";
import {
  createTheme,
  ThemeProvider,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "../../config";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "../../actions/action";
import { useUser } from "../../context/UserContext";
import { rolePermissions } from "../../context/userRoles";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Sophon
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const defaultTheme = createTheme();

const WorkerEntry = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const companyId = useSelector((state) => state.companyState.data.id);
  const { setUser } = useUser();

  const accountSignin = async (companyId, name, password) => {
    try {
      const response = await axios.post(`/account`, {
        companyId,
        name,
        password,
      });

      return response.data;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to sign in. Please try again later."
      );

      throw new Error(error.response?.data);
    }
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const password = data.get("password");
    if (!name || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }
    try {
      const user = await accountSignin(
        companyId,
        name.toLowerCase().trim(),
        password
      );

      const role = user.worker.role;
      const permissions = rolePermissions[role] || [];

      const userData = {
        ...user.worker,
        permissions: permissions,
      };

      dispatch(ActionCreators.setCurrentUser(userData));
      setUser(userData);
      navigate("/dashboard");
    } catch (error) {
      // Handle error appropriately, e.g., display error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notlogin">
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign In to An Account
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name or UserName"
                  name="name"
                  onChange={() => setError(null)}
                  autoComplete="name"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={() => setError(null)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>
                {error && (
                  <Typography variant="body2" color="error" align="center">
                    {error}
                  </Typography>
                )}
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage:
                "url(https://source.unsplash.com/random?wallpapers)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default WorkerEntry;
