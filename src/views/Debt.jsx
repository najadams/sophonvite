import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import axios from "../config";
import Loader from "../components/common/Loader";
import { Widgets } from "./Dashboard";
import UsersCard from "../components/UsersCard"; // Adjust the import path as needed
import SearchField from "../hooks/SearchField";

const Debt = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDebts = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await axios.get(
        `/api/debts/${companyId}?date=${formattedDate}`
      );
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
  } = useQuery(["debts", companyId, selectedDate], fetchDebts, {
    refetchOnWindowFocus: true,
  });

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredDebts = debts?.filter((debt) =>
    debt.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Loader />;

  return (
    <div className="page">
      <div className="heading" style={{ padding: 10 }}>
        <div>
          <h1 style={{ fontWeight: 200 }}>Debt Acquired</h1>
        </div>
      </div>

      <div className="content">
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            flexDirection: "row-reverse",
            alignItems: "flex-end",
          }}>
          <Widgets title={"Customers"} count={debts?.length || 0} />
          <Widgets
            title={"Total Amount"}
            count={`₵${
              debts?.reduce((total, debt) => total + debt.amount, 0) || 0
            }`}
          />
          <span style={{ marginBottom: 10 }}>
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
          <SearchField onSearch={handleSearch} />
        </div>
        {!isLoading && !isError && filteredDebts && filteredDebts.length > 0 ? (
          filteredDebts.map((debt) => (
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
              <h2 style={{ paddingTop: "50%" }}>No Debts Acquired Today</h2>
            ) : (
              <h2 style={{ paddingTop: "50%" }}>
                No Debts Acquired from{" "}
                {selectedDate.toISOString().split("T")[0]} to today
              </h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Debt;
