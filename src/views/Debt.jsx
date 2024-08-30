import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import axios from "../config";
import Loader from "../components/common/Loader";
import { Widgets } from "./Dashboard";
import UsersCard from "../components/UsersCard";
import SearchField from "../hooks/SearchField";
import { useMediaQuery } from "@mui/material";

const Debt = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAllDebtors, setShowAllDebtors] = useState(false);
  const [compressCards, setCompressCards] = useState(false);
  const matchesTablet = useMediaQuery("(max-width:600px)");

  const fetchDebts = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const url = showAllDebtors
        ? `/api/debts/${companyId}/all`
        : `/api/debts/${companyId}?date=${formattedDate}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching debts:", error.message);
      throw error;
    }
  };

  const {
    data: debts,
    isLoading,
    isError,
  } = useQuery(["debts", companyId, selectedDate, showAllDebtors], fetchDebts, {
    refetchOnWindowFocus: true,
  });

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

  const groupDebtsByCustomer = (debts) => {
    const grouped = debts.reduce((acc, debt) => {
      if (!acc[debt.customerName]) {
        acc[debt.customerName] = { ...debt };
      } else {
        acc[debt.customerName].amount += debt.amount;
      }
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const filteredDebts = debts?.filter((debt) =>
    debt.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedDebts = compressCards
    ? groupDebtsByCustomer(filteredDebts)
    : filteredDebts;

  if (isLoading) return <Loader />;

  return (
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
              displayedDebts?.reduce((total, debt) => total + debt.amount, 0) ||
              0
            }`}
          />
        </div>
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
          <button onClick={toggleCompressCards}>
            {compressCards ? "Show Individual Debts" : "Compress Cards"}
          </button>
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
      {!isLoading && !isError && displayedDebts && displayedDebts.length > 0 ? (
        displayedDebts.map((debt) => (
          <UsersCard
            key={debt.id}
            name={`₵${debt.amount}`}
            companyFrom={debt.customerName}
            onClick={() => console.log(`Debt ID: ${debt.id}`)}
          />
        ))
      ) : (
        <div className="content">
          {selectedDate.toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0] ? (
            <h2 style={{ paddingTop: "100px" }}>No Debts Acquired Today</h2>
          ) : (
            <h2 style={{ paddingTop: 100 }}>
              No Debts Acquired from {selectedDate.toISOString().split("T")[0]}{" "}
              to today
            </h2>
          )}
        </div>
      )}
    </div>
  );
};

export default Debt;