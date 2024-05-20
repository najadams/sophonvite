import axios from './index'

export const tableActions = {
  fetchCustomers: async (companyId) => {
    try {
      const response = await axios.get(`/api/customers/${companyId}`);
      const data = response.data.customers.map((item, index) => ({
        id: item._id,
        index: index + 1,
        company: item.company,
        name: item.name,
        phone: item.phone,
        email: item.email,
      }));
      return data;
    } catch (error) {
      throw new Error("Failed to fetch customers");
    }
  },
  fetchCustomersNames: async (companyId) => {
    try {
      const response = await axios.get(`/api/customers/${companyId}`);
      const data = response.data.customers.map((item) => item.name);
      return data;
    } catch (error) {
      throw new Error("Failed to fetch customers");
    }
  },

  fetchProducts: async (companyId) => {
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
  },
  fetchProductNames: async (companyId) => {
    try {
      const response = await axios.get(`/api/products/${companyId}`);
      const data = response.data.products.map((item) => ({
        id: item._id,
        name: item.name,
        salesPrice: item.salesprice,
        onhand: item.onhand,
      }));
      return data;
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },

  updateCustomer: async ({ id, name, phone, email, address, company }) => {
    try {
      const customer = await axios.patch(`/api/customer/${id}`, {
        id,
        name,
        phone,
        email,
        address,
        company,
      });
      if (customer.status === 200) {
        return null;
      }
    } catch (error) {
      console.log(error);
      return error.response?.data?.message || "An error occured";
    }
  },

  addCustomer: async ({ companyId, name, phone, email, address, company }) => {
    try {
      const customer = await axios.post(`/api/customer/`, {
        belongsTo: companyId,
        name,
        phone,
        email,
        address,
        company: company,
      });
      if (customer.status === 201) {
        return customer;
      }
    } catch (error) {
      console.log(error);
      return error.response?.data?.message || "An error occurred";
    }
  },

  updateProduct: async ({ id, name, costPrice, salesPrice, onHand }) => {
    try {
      const product = await axios.patch(`/api/product/${id}`, {
        id,
        name,
        costprice: costPrice,
        salesprice: salesPrice,
        onhand: onHand,
      });
      if (product.status === 200) {
        return null;
      }
    } catch (error) {
      console.log(error);
      return error.response?.data?.message || "An error occurred";
    }
  },

  addProduct: async ({ companyId, name, costPrice, salesPrice, onHand }) => {
    try {
      const product = await axios.post(`/api/product/`, {
        companyId,
        name,
        costprice: costPrice,
        salesprice: salesPrice,
        onhand: onHand,
      });
      if (product.status === 201) {
        return product;
      }
    } catch (error) {
      console.log(error);
      return error.response?.data?.message || "An error occurred";
    }
  },
  addWorker: async ({
    companyId,
    name,
    username,
    contact,
    password,
    privileges
  }) => {
    try {
      const response = await axios.post(`/api/worker/`, {
        companyId,
        name,
        username,
        contact,
        password,
        privileges
      });

      if (response.status === 201) {
        // Return the data from the response
        return response.data;
      } else {
        // Handle unexpected status codes
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error(error.response?.data?.message);
      // Throw the error so the calling function can handle it
      throw error?.response?.data?.message;
    }
  },

  addReceipt: async (values, companyId, workerId) => {
    try {
      const response = await axios.post("/api/receipt/", {
        ...values,
        companyId: companyId,
        workerId: workerId,
      });

      if (response.status === 200 || response.status === 201) {
        // Successful response
        return response.data; // You can return any data you receive from the server
      } else {
        // Handle unexpected status codes
        console.error("Unexpected status code:", response.status);
        return "Unexpected status code";
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      return error.response?.data?.message || "An error occurred";
    }
  },

  fetchWorkers: async (companyId) => {
    try {
      const response = await axios.get(`api/workers/${companyId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error("Failed to Fetch Workers");
    }
  },
  fetchCounts: async (companyId) => {
    try {
      const response = await axios.get(`/counts/${companyId}`)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response.data.message || "Failed to fetch counts")
      
    }
  },
  fetchSalesData : async (companyId) => {
      try {
        const response = await axios.get(`/api/overall/${companyId}`);
        const { labels, salesData, profitData, topProducts } = response.data;

        // Combine labels and data into a single array of objects for Recharts
        const sales = labels.map((label, index) => ({
          month: label,
          totalSales: salesData[index],
        }));
        const profit = labels.map((label, index) => ({
          month: label,
          totalProfit: profitData[index],
        }));

        return {sales, profit , topProducts}
      } catch (error) {
        console.error("Error fetching sales data", error);
      }
    }
};

export const capitalizeFirstLetter = (str) => {
  if (typeof str === "string") {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  return str;
};