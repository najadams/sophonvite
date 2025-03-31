import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../config/Functions";
import { tableActions } from "../config/Functions";
import Loader from "../components/common/Loader";
import { useState } from "react";
import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Paper,
  Fade,
  Zoom,
  Slide,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { useDispatch } from "react-redux";
import { ActionCreators } from "../actions/action";
import {
  Store as StoreIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Help as HelpIcon,
  History as HistoryIcon,
  Print as PrintIcon,
  ReceiptLong as ReceiptLongIcon,
  Inventory as InventoryIcon,
  LocalOffer as LocalOfferIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  Settings as SettingsIcon,
  PersonAdd,
} from "@mui/icons-material";
import { ROLES, rolePermissions } from "../context/userRoles";
import { useNavigate } from "react-router-dom";

const StyledField = styled(Field)({
  margin: "10px 0",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const Settings = () => {
  const company = useSelector((state) => state.companyState.data);
  const companyId = useSelector((state) => state.companyState.data.id);
  const user = useSelector((state) => state.userState.currentUser);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if user has admin privileges
  const isAdmin =
    user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.STORE_MANAGER;
  const canManageUsers = isAdmin;
  const canManageSettings = isAdmin || user?.role === ROLES.IT_SUPPORT;

  const {
    data: workers,
    isLoading,
    error,
  } = useQuery(["api/workers", companyId], () =>
    tableActions.fetchWorkers(companyId)
  );

  const handleBlur = (event, setFieldValue) => {
    const { name, value } = event.target;
    setFieldValue(name, capitalizeFirstLetter(value));
  };

  const handleSnackbarClose = () => {
    setOpen(false);
    setSnackbarMessage("");
  };

  return (
    <ErrorBoundary>
      <div className="page">
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Box display="flex" alignItems="center" mb={4}>
              <SettingsIcon
                sx={{ fontSize: 40, mr: 2, color: "primary.main" }}
              />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: "bold" }}>
                  Settings
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Configure your POS system preferences
                </Typography>
              </Box>
            </Box>
          </Fade>

          <Formik
            initialValues={{
              companyName: capitalizeFirstLetter(company.companyName) || "",
              email: company.email || "",
              contact: company.contact || "",
              momo: company.momo || "",
              address: company.address || "",
              paymentMethod: "",
              location: company.location || "",
              paymentProvider: "",
              currency: "cedis  ₵",
              tinNumber: company.tinNumber || "",
              taxRate: company.taxRate || "",
              taxId: company.taxId || "",
              emailNotifications: company.emailNotifications || true,
              smsNotifications: company.smsNotifications || false,
              currentPlan: company.currentPlan || "Standard",
              nextBillingDate: company.nextBillingDate || "2024-06-15",
              receiptHeader: company.receiptHeader || "",
              receiptFooter: company.receiptFooter || "",
              defaultPrinter: company.defaultPrinter || "",
              receiptWidth: company.receiptWidth || "80mm",
              enableBarcode: company.enableBarcode || true,
              enableStockAlerts: company.enableStockAlerts || true,
              lowStockThreshold: company.lowStockThreshold || 10,
              enableCustomerLoyalty: company.enableCustomerLoyalty || false,
              loyaltyPointsRate: company.loyaltyPointsRate || 1,
              enableDiscounts: company.enableDiscounts || true,
              defaultTaxRate: company.defaultTaxRate || 12.5,
              enableMultipleTaxRates: company.enableMultipleTaxRates || false,
              enableCashDrawer: company.enableCashDrawer || false,
              cashDrawerPort: company.cashDrawerPort || "",
              backupFrequency: company.backupFrequency || "daily",
              enableAutoBackup: company.enableAutoBackup || true,
              enableOfflineMode: company.enableOfflineMode || true,
              enableCustomerManagement:
                company.enableCustomerManagement || true,
              enableSupplierManagement:
                company.enableSupplierManagement || true,
              enableInventoryTracking: company.enableInventoryTracking || true,
              enablePurchaseOrders: company.enablePurchaseOrders || true,
              enableSalesReturns: company.enableSalesReturns || true,
              enableStockTransfers: company.enableStockTransfers || true,
              enablePriceHistory: company.enablePriceHistory || true,
              enableBulkOperations: company.enableBulkOperations || true,
              enableReports: company.enableReports || true,
              enableAnalytics: company.enableAnalytics || true,
              enableMultiCurrency: company.enableMultiCurrency || false,
              defaultCurrency: company.defaultCurrency || "GHS",
              enableExchangeRates: company.enableExchangeRates || false,
              enablePaymentMethods: company.enablePaymentMethods || true,
              defaultPaymentMethod: company.defaultPaymentMethod || "cash",
              enableSplitPayments: company.enableSplitPayments || true,
              enablePartialPayments: company.enablePartialPayments || true,
              enableHoldOrders: company.enableHoldOrders || true,
              enableTableManagement: company.enableTableManagement || false,
              enableKitchenDisplay: company.enableKitchenDisplay || false,
              enableEmployeeTimeTracking:
                company.enableEmployeeTimeTracking || true,
              enableEmployeeCommission:
                company.enableEmployeeCommission || false,
              commissionRate: company.commissionRate || 0,
              enableShiftManagement: company.enableShiftManagement || true,
              enableCashManagement: company.enableCashManagement || true,
              enableBankReconciliation:
                company.enableBankReconciliation || true,
              enableAuditLogs: company.enableAuditLogs || true,
              enableUserActivityLogs: company.enableUserActivityLogs || true,
              enableSystemLogs: company.enableSystemLogs || true,
              enableSecurityLogs: company.enableSecurityLogs || true,
              enableDataExport: company.enableDataExport || true,
              enableDataImport: company.enableDataImport || true,
              enableDataBackup: company.enableDataBackup || true,
              enableDataRestore: company.enableDataRestore || true,
              enableSystemUpdates: company.enableSystemUpdates || true,
              enableSystemMaintenance: company.enableSystemMaintenance || true,
              enableSystemDiagnostics: company.enableSystemDiagnostics || true,
              enableSystemOptimization:
                company.enableSystemOptimization || true,
              enableSystemSecurity: company.enableSystemSecurity || true,
              enableSystemMonitoring: company.enableSystemMonitoring || true,
              enableSystemAlerts: company.enableSystemAlerts || true,
              enableSystemReports: company.enableSystemReports || true,
              enableSystemAnalytics: company.enableSystemAnalytics || true,
              enableSystemBackup: company.enableSystemBackup || true,
              enableSystemRestore: company.enableSystemRestore || true,
              receiptTemplate: company.receiptTemplate || "template1",
            }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              setSubmitting(true);
              const processedValues = {
                ...values,
                companyName: values.companyName.trim().toLowerCase(),
                email: values.email.trim().toLowerCase(),
                contact: values.contact.trim(),
                momo: values.momo.trim().toLowerCase(),
                address: values.address.trim().toLowerCase(),
              };
              try {
                const submissionData = { companyId, ...processedValues };
                await tableActions.updateCompanyData(submissionData);
                dispatch(
                  ActionCreators.fetchCompanySuccess({
                    id: companyId,
                    ...submissionData,
                  })
                );
                setSnackbarMessage("Company details updated successfully!");
                setOpen(true);
              } catch (error) {
                console.error(error);
                setErrors({
                  submit:
                    error?.message?.data ||
                    "Failed to update company details. Please try again.",
                });
                setSnackbarMessage(
                  "Failed to update company details. Please try again."
                );
                setOpen(true);
              }
              setSubmitting(false);
            }}>
            {({ values, handleChange, setFieldValue, errors }) => (
              <Form>
                <Zoom in timeout={800}>
                  <StyledCard sx={{ mb: 4 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <StoreIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="h6">General Settings</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            name="companyName"
                            label="Store Name"
                            variant="outlined"
                            value={values.companyName}
                            onChange={handleChange}
                            onBlur={(event) => handleBlur(event, setFieldValue)}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            name="email"
                            label="Store Email"
                            variant="outlined"
                            value={values.email}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            name="contact"
                            label="Store Phone"
                            variant="outlined"
                            value={values.contact}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            name="momo"
                            label="Momo Number"
                            variant="outlined"
                            value={values.momo}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            name="address"
                            label="Store Digital Address"
                            variant="outlined"
                            value={values.address}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            name="location"
                            label="Store Location"
                            variant="outlined"
                            value={values.location}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </Zoom>

                <Slide direction="up" in timeout={800}>
                  <StyledCard sx={{ mb: 4 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <ReceiptIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="h6">Tax Settings</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            name="tinNumber"
                            label="Tin Number"
                            variant="outlined"
                            value={values.tinNumber}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            name="taxRate"
                            label="Tax Rate (%)"
                            variant="outlined"
                            value={values.taxRate}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            name="taxId"
                            label="Tax ID"
                            variant="outlined"
                            value={values.taxId}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </Slide>

                <Slide direction="up" in timeout={800}>
                  <StyledCard sx={{ mb: 4 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <NotificationsIcon
                          sx={{ mr: 1, color: "primary.main" }}
                        />
                        <Typography variant="h6">
                          Notification Settings
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="emailNotifications"
                                checked={values.emailNotifications}
                                onChange={handleChange}
                                color="primary"
                              />
                            }
                            label="Email Notifications"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="smsNotifications"
                                checked={values.smsNotifications}
                                onChange={handleChange}
                                color="primary"
                              />
                            }
                            label="SMS Notifications"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </Slide>

                <Slide direction="up" in timeout={800}>
                  <StyledCard sx={{ mb: 4 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <ReceiptLongIcon
                          sx={{ mr: 1, color: "primary.main" }}
                        />
                        <Typography variant="h6">Receipt Settings</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Receipt Template</InputLabel>
                            <Select
                              name="receiptTemplate"
                              value={values.receiptTemplate}
                              onChange={handleChange}
                              label="Receipt Template">
                              <MenuItem value="template1">
                                <Box>
                                  <Typography variant="subtitle1">
                                    Template 1
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary">
                                    Standard receipt with logo and footer
                                  </Typography>
                                </Box>
                              </MenuItem>
                              <MenuItem value="template2">
                                <Box>
                                  <Typography variant="subtitle1">
                                    Template 2
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary">
                                    Compact receipt with QR code
                                  </Typography>
                                </Box>
                              </MenuItem>
                              <MenuItem value="template3">
                                <Box>
                                  <Typography variant="subtitle1">
                                    Template 3
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary">
                                    Detailed receipt with tax breakdown
                                  </Typography>
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            multiline
                            rows={2}
                            name="receiptHeader"
                            label="Receipt Header"
                            variant="outlined"
                            value={values.receiptHeader}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            multiline
                            rows={2}
                            name="receiptFooter"
                            label="Receipt Footer"
                            variant="outlined"
                            value={values.receiptFooter}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Default Printer</InputLabel>
                            <Select
                              name="defaultPrinter"
                              value={values.defaultPrinter}
                              onChange={handleChange}
                              label="Default Printer">
                              <MenuItem value="thermal">
                                Thermal Printer
                              </MenuItem>
                              <MenuItem value="dot-matrix">Dot Matrix</MenuItem>
                              <MenuItem value="laser">Laser Printer</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Receipt Width</InputLabel>
                            <Select
                              name="receiptWidth"
                              value={values.receiptWidth}
                              onChange={handleChange}
                              label="Receipt Width">
                              <MenuItem value="58mm">58mm</MenuItem>
                              <MenuItem value="80mm">80mm</MenuItem>
                              <MenuItem value="112mm">112mm</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                name="enableBarcode"
                                checked={values.enableBarcode}
                                onChange={handleChange}
                              />
                            }
                            label="Enable Barcode Scanning"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </Slide>

                <Slide direction="up" in timeout={800}>
                  <StyledCard sx={{ mb: 4 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <InventoryIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="h6">Inventory Settings</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                name="enableStockAlerts"
                                checked={values.enableStockAlerts}
                                onChange={handleChange}
                              />
                            }
                            label="Enable Stock Alerts"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            type="number"
                            name="lowStockThreshold"
                            label="Low Stock Threshold"
                            variant="outlined"
                            value={values.lowStockThreshold}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                name="enableCustomerLoyalty"
                                checked={values.enableCustomerLoyalty}
                                onChange={handleChange}
                              />
                            }
                            label="Enable Customer Loyalty Program"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            type="number"
                            name="loyaltyPointsRate"
                            label="Loyalty Points Rate"
                            variant="outlined"
                            value={values.loyaltyPointsRate}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </Slide>

                <Slide direction="up" in timeout={800}>
                  <StyledCard sx={{ mb: 4 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <PaymentIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="h6">Payment Settings</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                name="enableDiscounts"
                                checked={values.enableDiscounts}
                                onChange={handleChange}
                              />
                            }
                            label="Enable Discounts"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledField
                            as={TextField}
                            fullWidth
                            type="number"
                            name="defaultTaxRate"
                            label="Default Tax Rate (%)"
                            variant="outlined"
                            value={values.defaultTaxRate}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                name="enableMultipleTaxRates"
                                checked={values.enableMultipleTaxRates}
                                onChange={handleChange}
                              />
                            }
                            label="Enable Multiple Tax Rates"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                name="enableCashDrawer"
                                checked={values.enableCashDrawer}
                                onChange={handleChange}
                              />
                            }
                            label="Enable Cash Drawer"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </Slide>

                <Slide direction="up" in timeout={800}>
                  <StyledCard sx={{ mb: 4 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <BackupIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="h6">Backup & Security</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Backup Frequency</InputLabel>
                            <Select
                              name="backupFrequency"
                              value={values.backupFrequency}
                              onChange={handleChange}
                              label="Backup Frequency">
                              <MenuItem value="daily">Daily</MenuItem>
                              <MenuItem value="weekly">Weekly</MenuItem>
                              <MenuItem value="monthly">Monthly</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                name="enableAutoBackup"
                                checked={values.enableAutoBackup}
                                onChange={handleChange}
                              />
                            }
                            label="Enable Auto Backup"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                name="enableOfflineMode"
                                checked={values.enableOfflineMode}
                                onChange={handleChange}
                              />
                            }
                            label="Enable Offline Mode"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </Slide>

                {canManageUsers && (
                  <Slide direction="up" in timeout={800}>
                    <StyledCard sx={{ mb: 4 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                          <Typography variant="h6">
                            Employee Management
                          </Typography>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<PersonAdd />}
                              onClick={() => navigate("/employee/new")}
                              fullWidth>
                              Add New Employee
                            </Button>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<PeopleIcon />}
                              onClick={() => navigate("/employees")}
                              fullWidth>
                              Manage Employees
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </StyledCard>
                  </Slide>
                )}

                {canManageSettings && (
                  <>
                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Customer Management
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/customers")}
                                fullWidth>
                                Manage Customers
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Supplier Management
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/suppliers")}
                                fullWidth>
                                Manage Suppliers
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Employee Management
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/employees")}
                                fullWidth>
                                Manage Employees
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Table Management
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/tables")}
                                fullWidth>
                                Manage Tables
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Kitchen Display
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/kitchen")}
                                fullWidth>
                                Manage Kitchen Display
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Employee Time Tracking
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() =>
                                  navigate("/employee-time-tracking")
                                }
                                fullWidth>
                                Manage Employee Time Tracking
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Employee Commission
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/employee-commission")}
                                fullWidth>
                                Manage Employee Commission
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Shift Management
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/shift-management")}
                                fullWidth>
                                Manage Shift Management
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Cash Management
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/cash-management")}
                                fullWidth>
                                Manage Cash Management
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              Bank Reconciliation
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/bank-reconciliation")}
                                fullWidth>
                                Manage Bank Reconciliation
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">Audit Logs</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/audit-logs")}
                                fullWidth>
                                Manage Audit Logs
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              User Activity Logs
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/user-activity-logs")}
                                fullWidth>
                                Manage User Activity Logs
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">System Logs</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-logs")}
                                fullWidth>
                                Manage System Logs
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">Security Logs</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/security-logs")}
                                fullWidth>
                                Manage Security Logs
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">Data Export</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/data-export")}
                                fullWidth>
                                Manage Data Export
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">Data Import</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/data-import")}
                                fullWidth>
                                Manage Data Import
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">Data Backup</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/data-backup")}
                                fullWidth>
                                Manage Data Backup
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">Data Restore</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/data-restore")}
                                fullWidth>
                                Manage Data Restore
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">System Updates</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-updates")}
                                fullWidth>
                                Manage System Updates
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              System Maintenance
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-maintenance")}
                                fullWidth>
                                Manage System Maintenance
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              System Diagnostics
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-diagnostics")}
                                fullWidth>
                                Manage System Diagnostics
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              System Optimization
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-optimization")}
                                fullWidth>
                                Manage System Optimization
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              System Security
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-security")}
                                fullWidth>
                                Manage System Security
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              System Monitoring
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-monitoring")}
                                fullWidth>
                                Manage System Monitoring
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">System Alerts</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-alerts")}
                                fullWidth>
                                Manage System Alerts
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">System Reports</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-reports")}
                                fullWidth>
                                Manage System Reports
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">
                              System Analytics
                            </Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-analytics")}
                                fullWidth>
                                Manage System Analytics
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">System Backup</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-backup")}
                                fullWidth>
                                Manage System Backup
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>

                    <Slide direction="up" in timeout={800}>
                      <StyledCard sx={{ mb: 4 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={2}>
                            <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                            <Typography variant="h6">System Restore</Typography>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<PeopleIcon />}
                                onClick={() => navigate("/system-restore")}
                                fullWidth>
                                Manage System Restore
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Slide>
                  </>
                )}

                <Fade in timeout={1000}>
                  <Box mt={3}>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      startIcon={<SettingsIcon />}
                      disabled={!canManageSettings}>
                      Save Changes
                    </StyledButton>
                    {errors.submit && (
                      <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {errors.submit}
                      </Typography>
                    )}
                  </Box>
                </Fade>
              </Form>
            )}
          </Formik>
        </Container>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          TransitionComponent={Slide}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Settings;
