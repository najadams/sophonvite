import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "../config/";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ActionCreators } from "../actions/action";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

const SignIn = ({ isLoggedIn }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/account");
    }
  }, [isLoggedIn, navigate]);

  const login = async (companyName, password) => {
    try {
      const response = await axios.post(`/login`, {
        companyName,
        password,
      });

      if (response.status !== 200) {
        throw new Error("Invalid Credentials");
      }

      const { companydata, token } = response.data;

      dispatch(ActionCreators.setAuthToken(token));
      window.localStorage.setItem("access_token", token);
      dispatch(ActionCreators.loginCompany());
      navigate("/account");

      dispatch(ActionCreators.fetchCompanySuccess(companydata));
      dispatch(ActionCreators.fetchUserRequest());
      dispatch(ActionCreators.fetchUserSuccess(companydata.workers));

      return response.data;
    } catch (error) {
      console.log(error)
      const message =
        error.response?.status === 401
          ? error.response?.data?.message
          : "Something went wrong";

      setError(message);
      dispatch(ActionCreators.fetchUserFailure(message));
      console.error(message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    const companyName = data.get("company");
    const password = data.get("password");

    if (!companyName || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    await login(companyName.toLowerCase().trim(), password);
    setLoading(false);
  };

  return (
    <div className="notlogin">
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
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
                Sign in
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
                  id="company"
                  label="Company Name"
                  name="company"
                  autoComplete="company"
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
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                {error && (
                  <Typography variant="body2" align="center" color="error">
                    {error}
                  </Typography>
                )}
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default SignIn;
