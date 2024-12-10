import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import axios from "../config";
import Loader from "../components/common/Loader";
import { Widgets } from "./Dashboard";
import UsersCard from "../components/UsersCard";
import SearchField from "../hooks/SearchField";
import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import PaymentDialog from "../components/Dialogs/PaymentDialog";

const Debt = () => {
  const queryClient = new QueryClient();
  const companyId = useSelector((state) => state.companyState.data.id);
  const workerId = useSelector((state) => state.userState.currentUser._id);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAllDebtors, setShowAllDebtors] = useState(false);
  const [compressCards, setCompressCards] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const matchesTablet = useMediaQuery("(max-width:600px)");
  
  const fetchDebts = async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const url = showAllDebtors
      ? `/api/debts/${companyId}/all`
      : `/api/debts/${companyId}?date=${formattedDate}`;
    const response = await axios.get(url);
    return response.data;
  };

  const {
    data: debts,
    isLoading,
    isError,
  } = useQuery(["debts", companyId, selectedDate, showAllDebtors], fetchDebts, {
    refetchOnWindowFocus: true,
  });

  const paymentMutation = useMutation(
    async ({ debtId, amount }) => {
      return await axios.post(`/api/debts/${debtId}/pay`, { amount, workerId });
    },
    {
      onSuccess: () => {
        // Refetch debts to reflect the updated payment
        queryClient.invalidateQueries("debts");
      },
      onError: (error) => {
        console.error("Payment failed: ", error);
        alert("Error processing the payment, please try again.");
      },
    }
  );

  const toggleCompressCards = () => {
    setCompressCards((prev) => !prev);
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleShowAllChange = (e) => {
    setShowAllDebtors(e.target.checked);
  };

  const handleCardClick = (debt) => {
    setSelectedDebt(debt);
    setPaymentAmount("");
    setPaymentDialogOpen(true);
  };

  const handlePayment = async (paymentAmount) => {
    try {
      if (!selectedDebt?.id || !paymentAmount) {
        alert("Please select a debt and enter a valid payment amount.");
        return;
      }
      // Trigger the mutation to make the payment
      setSubmitting(true)
      await paymentMutation.mutateAsync({
        debtId: selectedDebt.id,
        amount: paymentAmount,
        workerId: workerId,
      });
      const updatedDebts = debts.map((debt) => {
        return (
          debt.id === selectedDebt.id
            ? (
              debt.amount -= paymentAmount
            )
            : debt
          );
        })
        
      // Update the state with the new debts list
      queryClient.setQueryData(
        ["debts", companyId, selectedDate, showAllDebtors],
        updatedDebts
      );


      // Close the payment dialog and reset the payment amount
      setPaymentDialogOpen(false);
      setPaymentAmount("");
      setSubmitting(false)
      
      setOpen(true);
    } catch (error) {
      console.error("Error during payment: ", error);
      setSubmitting(false)
    }
  };

  const groupDebtsByCustomerOrCompany = (debts) => {
    const grouped = debts.reduce((acc, debt) => {
      const key = debt.companyName || debt.customerName;

      if (!acc[key]) {
        acc[key] = {
          ...debt,
          receiptIds: [debt.id], // Initialize with the first receipt ID
        };
      } else {
        acc[key].amount += debt.amount; // Add to the existing amount
        acc[key].receiptIds.push(debt.id); // Add the receipt ID to the list
      }
      return acc;
    }, {});

    return Object.values(grouped);
  };



  const filteredDebts =
    debts?.filter((debt) =>
      debt.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) 
      ||
      debt.customerCompany?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const displayedDebts = compressCards
    ? groupDebtsByCustomerOrCompany(filteredDebts || []) // Fallback to empty array
    : filteredDebts || [];

  if (isLoading) return <Loader />;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="page">
        <div className="heading" style={{ padding: 10 }}>
          <div>
            <h1 style={{ fontWeight: 200 }}>Debt Acquired</h1>
          </div>
        </div>

        <div className="content">
          <div className="widgets">
            <Widgets title={"Customers"} count={displayedDebts?.length || 0} />
            <Widgets
              title={"Total Amount"}
              count={`₵${
                displayedDebts?.reduce(
                  (total, debt) => total + debt.amount,
                  0
                ) || 0
              }`}
            />
          </div>
          <Snackbar
            open={open}
            autoHideDuration={3000} // Set the time in milliseconds (e.g., 3000 = 3 seconds)
            onClose={() => setOpen(false)} // Handle closing the Snackbar
            message="Payment Successfully made!"
            anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "green", // Custom background color
                color: "#fff", // Custom text color
                padding: "10px",
                borderRadius: "4px",
                fontFamily: "Arial, sans-serif", // Custom font
              }}>
              <Typography variant="body1" style={{ fontFamily: "cursive" }}>
                Payment made Successfully!
              </Typography>
            </div>
          </Snackbar>
          <div
            style={{
              width: "100%",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}>
            <div className="filter-icon-container">
              <i
                className="bx bx-filter filter-icon"
                onClick={toggleFilters}
                style={{
                  fontSize: 40,
                  borderRadius: 10,
                  backgroundColor: "white",
                  padding: 5,
                  cursor: "pointer",
                }}></i>
              <span className="filter-text">Filters</span>
            </div>
            {debts.length > 0 ? (
              <Button variant={"outlined"} onClick={toggleCompressCards}>
                {compressCards ? "Show Individual Debts" : "Compress Cards"}
              </Button>
            ) : (
              ""
            )}
            <div className={`filter-options ${showFilters ? "visible" : ""}`}>
              <span style={{ padding: 10 }}>
                <label
                  htmlFor="All"
                  style={{ marginLeft: 2, fontSize: "larger", font: "icon" }}>
                  All Debtors:
                </label>
                <input
                  className="checkbox"
                  id="All"
                  type="checkbox"
                  checked={showAllDebtors}
                  onChange={handleShowAllChange}
                />
              </span>
              <span style={{ display: "flex" }}>
                <SearchField
                  placeholder={"Search Debtor"}
                  onSearch={handleSearch}
                />
              </span>
              <span style={{ padding: 10, flex: 1 }}>
                <label
                  htmlFor="dateInput"
                  style={{ marginLeft: 10, fontSize: "larger", font: "icon" }}>
                  Select Date:
                </label>
                <input
                  className="date-input"
                  type="date"
                  id="dateInput"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={handleDateChange}
                />
              </span>
            </div>
          </div>
        </div>
        {!isLoading &&
        !isError &&
        displayedDebts &&
        displayedDebts.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              justifyContent: "center",
            }}>
            {displayedDebts.map((debt) =>
              compressCards ? (
                <UsersCard
                  key={debt.id}
                  main={`₵${debt.amount}`}
                  sub={debt.customerCompany || debt.customerName}
                  contact={debt.contact}
                  onClick={() => handleCardClick(debt)}
                  additionalInfo={`Debt Date: ${new Date(
                    debt.date
                  ).toLocaleDateString()}`}
                />
              ) : (
                <UsersCard
                  key={debt.data}
                  top={new Date(debt.date).toLocaleDateString()}
                  main={`₵${debt.amount}`}
                  sub={
                    debt.customerCompany
                      ? debt.customerCompany
                      : debt.customerName
                  }
                  contact={debt.contact}
                  onClick={() => handleCardClick(debt)}
                  additionalInfo={`Debt Date: ${new Date(
                    debt.date
                  ).toLocaleDateString()}`}
                />
              )
            )}
          </div>
        ) : (
          <div className="content">
            {selectedDate.toISOString().split("T")[0] ===
            new Date().toISOString().split("T")[0] ? (
              <h2 style={{ paddingTop: "100px" }}>No Debts Acquired Today</h2>
            ) : (
              <h2 style={{ paddingTop: "100px" }}>
                No Debts Acquired from{" "}
                {selectedDate.toISOString().split("T")[0]} to today
              </h2>
            )}
          </div>
        )}

        <PaymentDialog
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          selectedDebt={selectedDebt}
          onSubmit={handlePayment}
        />
      </div>
    </QueryClientProvider>
  );
};

export default Debt;
