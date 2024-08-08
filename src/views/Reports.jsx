import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useMediaQuery } from "@mui/material";

const Reports = () => {
  const [value, setValue] = React.useState(0);
  const matchesMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="page">
      <div className={"heading"}>
        <div>
          <h1 style={{ fontWeight: 200 }}>Reports</h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "60%",
            justifyContent:'center',
          }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example">
            <Tab label="Sales" />
            <Tab label="Purchases" />
            <Tab label="Inventory" />
            <Tab label="Debts" />
          </Tabs>
        </div>
        <div style={{padding: 20,}}>.</div>
      </div>
      <div className="content">{/* Content for selected tab goes here */}</div>
    </div>
  );
};

export default Reports;