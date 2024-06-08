import React from "react";
import { useQuery } from "react-query";
import ProductForm from "../components/forms/ProductForm";
import TableCreater from "../components/common/TableCreater";
import AddItem from "../hooks/AddItem";
import axios from "../config/index";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";

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

const ProductCatalogue = () => {
  const companyId = useSelector((state) => state.companyState.data.id);
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery(["api/products", companyId], () => fetchProducts(companyId));

  if (isLoading) return <Loader />;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="page">
      <div className="heading">
        <div>
          <h1 style={{ fontWeight: 200}}>Products</h1>
        </div>
        <AddItem>
          <ProductForm />
        </AddItem>
      </div>

      <div className="content">
        {products.length > 0 ? (
          <TableCreater companyId={companyId} type="products" />
        ) : (
          <div className="content">
            <h2>Add Products to Get Started</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalogue;
