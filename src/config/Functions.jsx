import axios from './index'

const processDailyData = (receipts) => {
  const dailyData = receipts.reduce((acc, receipt) => {
    const date = new Date(receipt.createdAt);
    const dayKey = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    if (!acc[dayKey]) {
      acc[dayKey] = { totalSales: 0, details: [] };
    }

    acc[dayKey].totalSales += receipt.total;
    acc[dayKey].details.push(...receipt.detail);

    return acc;
  }, {});

  const labels = Object.keys(dailyData);
  const salesData = labels.map((day) => dailyData[day].totalSales);

  return { labels, salesData, dailyData };
};

const calculateProfit = (receipts, inventory) => {
  let totalProfit = 0;

  receipts.forEach((receipt) => {
    let receiptProfit = 0;

    receipt.detail.forEach((item) => {
      const inventoryItem = inventory.find((inv) => inv.name === item.name);

      if (inventoryItem) {
        const itemCost = inventoryItem.costprice;
        const itemSales = item.quantity * inventoryItem.salesprice;
        const itemProfit = itemSales - item.quantity * itemCost;
        receiptProfit += itemProfit;
      } else {
        console.log(`Inventory item "${item.name}" not found.`);
      }
    });

    totalProfit += receiptProfit;
  });

  return totalProfit;
};


const calculateTopPurchasedProducts = (receipts) => {
  const productCounts = receipts.reduce((acc, receipt) => {
    receipt.detail.forEach((item) => {
      if (!acc[item.name]) {
        acc[item.name] = 0;
      }
      acc[item.name] += item.quantity;
    });
    return acc;
  }, {});

  const sortedProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return sortedProducts.map(([name, quantity]) => ({ name, quantity }));
};

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
    privileges,
  }) => {
    try {
      const response = await axios.post(`/api/worker/`, {
        companyId,
        name,
        username,
        contact,
        password,
        privileges,
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
      const response = await axios.get(`/counts/${companyId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response.data.message || "Failed to fetch counts");
    }
  },
  fetchSalesData: async (companyId) => {
    try {
      // Fetch receipts and inventory data
      const receiptsResponse = await axios.get(`/api/overall/${companyId}`);
      const receipts = receiptsResponse.data;
      const inventoryResponse = await axios.get(`/api/products/${companyId}`);
      const inventory = inventoryResponse.data.products;

      // Process daily data
      const { labels, salesData, dailyData } = processDailyData(receipts);

      // Calculate profits for each day
      const profitData = labels.map((day) => {
        const dayReceipts = dailyData[day].details;
        return calculateProfit([{ detail: dayReceipts }], inventory);
      });

      // Calculate top purchased products
      const topProducts = calculateTopPurchasedProducts(receipts);

      // Combine labels and data into a single array of objects for Recharts
      const sales = labels.map((label, index) => ({
        month: label,
        totalSales: salesData[index],
      }));

      const profit = labels.map((label, index) => ({
        month: label,
        totalProfit: profitData[index],
      }));

      return { sales, profit, topProducts };
    } catch (error) {
      console.error("Error fetching sales data", error);
      throw new Error("Failed to fetch sales data");
    }
  },
};

export const capitalizeFirstLetter = (str) => {
  if (typeof str === "string") {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  return str;
};

export const serverAid = {
  filterReceiptsForToday : (receipts) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

  return receipts.filter((receipt) => {
    const receiptDate = new Date(receipt.date);
    return receiptDate >= today && receiptDate < tomorrow;
  });
  },
  calculateTopPurchasedProducts : (receipts) => {
  const productCounts = receipts.reduce((acc, receipt) => {
    receipt.detail.forEach((item) => {
      if (!acc[item.name]) {
        acc[item.name] = 0;
      }
      acc[item.name] += item.quantity;
    });
    return acc;
  }, {});

  const sortedProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return sortedProducts.map(([name, quantity]) => ({ name, quantity }));
},


}