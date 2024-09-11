import React, { lazy } from "react";
import { useQuery } from "react-query";
import ProductForm from "../components/forms/ProductForm";
import TableCreater from "../components/common/TableCreater";
import AddItem from "../hooks/AddItem";
import axios from "../config/index";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import ReceiveInventory from "../components/forms/ReceiveInventory";

const fetchProducts = async (companyId) => {
  try {
    const response = await axios.get(`/api/products/${companyId}`);
    const data = response.data.products.map((item, index) => ({
      id: item._id,
      index: index + 1,
      name: item.name,
      costPrice: item.costprice,
      salesPrice: item.salesprice,
      onHand: item.onhand,
    }));
    return data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const allyProps = (index) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

const ProductCatalogue = () => {
  const [value, setValue] = React.useState(0);
  const companyId = useSelector((state) => state.companyState.data.id);
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery(["api/products", companyId], () => fetchProducts(companyId));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1 style={{ fontWeight: 200 }}>Products</h1>
        </div>
        <div style={{
          display: 'block', 
          width: '40%',
        }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example">
            <Tab label="Products" {...allyProps(0)} />
            <Tab label="Receive inventory" {...allyProps(1)} />
            {/* <Tab label="Receive Inventory" {...allyProps(2)} /> */}
            {/* <Tab label="Groups" {...allyProps(2)} /> */}
          </Tabs>
        </div>
        <AddItem>
          <ProductForm />
        </AddItem>
      </div>

      <TabPanel value={value} index={0}>
        {products.length > 0 ? (
          <TableCreater companyId={companyId} type="products" />
        ) : (
          <div className="content">
            <h2>Add Products to Get Started</h2>
          </div>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
          <ReceiveInventory Products={products} />
      </TabPanel>
      {/* <TabPanel value={value} index={2}>
        <AddItem>
          <ProductForm />
        </AddItem>
      </TabPanel> */}
    </div>
  );
};

export default ProductCatalogue;
