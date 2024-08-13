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

const calculateProfit = (receipts) => {
  let totalProfit = 0;

  for (const receipt of receipts) {
    let receiptProfit = 0;

    for (const item of receipt.detail) {
      const itemProfit = (item.salesprice - item.costprice) * item.quantity;
      receiptProfit += itemProfit;
    }

    totalProfit += receiptProfit;
  }

  return totalProfit;
};

function calculateTopsProfit(receipts) {
  const productProfits = {};

  receipts.forEach((receipt) => {
    receipt.detail.forEach((product) => {
      const profit =
        (product.salesprice - product.costprice) * product.quantity;

      if (productProfits[product.name]) {
        productProfits[product.name] += profit;
      } else {
        productProfits[product.name] = profit;
      }
    });
  });

  return Object.keys(productProfits).map((name) => ({
    name: name,
    profit: productProfits[name],
  }));
}


const calculateTopPurchasedProducts = (receipts) => {
  // Accumulate the total quantity and profit of each product across all receipts
  const productCounts = receipts.reduce((acc, receipt) => {
    receipt.detail.forEach((item) => {
      if (!acc[item.name]) {
        acc[item.name] = { quantity: 0, profit: 0 };
      }
      acc[item.name].quantity += item.quantity;
      acc[item.name].profit +=
        (item.salesprice - item.costprice) * item.quantity;
    });
    return acc;
  }, {});

  // Convert the productCounts object to an array of [name, { quantity, profit }] pairs
  // and sort the array in descending order based on quantity
  const sortedProducts = Object.entries(productCounts)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 10);

  // Convert the sorted array back to an array of objects with name, quantity, and profit
  return sortedProducts.map(([name, { quantity, profit }]) => ({
    name,
    quantity,
    profit,
  }));
};

export const tableActions = {
  fetchCustomers: async (companyId) => {
    try {
      const response = await axios.get(`/api/customers/${companyId}`);
      const data = response.data.customers.map((item, index) => ({
        id: item._id,
        index: index + 1,
        // company: item.company,
        name: item.name,
        phone: item.phone,
        // email: item.email,
      }));
      return data;
    } catch (error) {
      throw new Error("Failed to fetch customers");
    }
  },
  fetchCustomersNames: async (companyId) => {
    try {
      const response = await axios.get(`/api/customers/${companyId}`);
      const data = response.data.customers.map((item) => (capitalizeFirstLetter(`${item?.company || "None"} - ${item?.name}`)));
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
      // const page = response.page 
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
  updateCompanyData : async ({ companyId, ...details }) => {
    try {
      // Prepare the payload by filtering out empty values
      const updateFields = {};
      for (const [key, value] of Object.entries(details)) {
        if (value !== undefined && value !== null && value !== '') {
          updateFields[key] = value;
        }
      }

      const submissionData = {companyId, ...updateFields}
      // Send the PATCH request to update the company details
      const response = await axios.patch(`/update/${companyId}`, submissionData);

      // Check if the update was successful
      if (response.status === 200) {
        return response.data;  // Return the updated company data
      }
    } catch (error) {
      console.log(error);
      // return error.response?.data?.message || "An error occurred";
      throw new Error(error.response?.data?.message || "Ann error occured")
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
      throw new Error(error.response?.data?.message || "An error occurred");
    }
  },
  addVendor: async (values, companyId,) => {
    try {
      const response = await axios.post("/api/vendor/", {
        ...values,
        companyId: companyId,
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

  fetchReceipts : async (companyId, selectedDate) => {
    try {
      const response = await axios.get(
        `/api/receipts/${companyId}?date=${selectedDate}`
      );
      // const todaysReceipts = serverAid.filterReceiptsForToday(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching receipts:", error);
      throw error;
    }
  },
  fetchDebt: async (companyId, selectedDate, selectedDuration) => {
  try {
    let url = `/api/debts/${companyId}?`;

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      url += `date=${formattedDate}&`;
      console.log(formattedDate)
    }

    if (selectedDuration) {
      url += `duration=${selectedDuration}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching debts:", error);
    throw error;
  }
}
,

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
  fetchSalesData : async (companyId) => {
  try {
    // Fetch receipts data
    const receiptsResponse = await axios.get(`/api/overall/${companyId}`);
    const receipts = receiptsResponse.data;

    // Process daily data
    const { labels, salesData, dailyData } = processDailyData(receipts);

    // Calculate profits for each day using historical prices stored in receipts
    const profitData = labels.map((day) => {
      const dayReceipts = dailyData[day].details;
      return calculateProfit([{ detail: dayReceipts }]);
    });

    // Calculate top purchased products
    const topProducts = calculateTopPurchasedProducts(receipts);
    // adding data for the pie graph
    const profitable5 = topProducts.slice(0, 5)

    // Combine labels and data into a single array of objects for Recharts
    const sales = labels.map((label, index) => ({
      month: label,
      totalSales: salesData[index],
    }));

    const profit = labels.map((label, index) => ({
      month: label,
      totalProfit: profitData[index],
    }));


    return { sales, profit, topProducts , profitable5};
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
  // filterReceiptsForToday: (receipts) => {
  //   const today = new Date();
  //   const startOfDay = new Date(
  //     Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  //   );
  //   const endOfDay = new Date(startOfDay);
  //   endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

  //   return receipts.filter((receipt) => {
  //     const receiptDate = new Date(receipt.date);
  //     if (isNaN(receiptDate)) {
  //       console.error(`Invalid date format: ${receipt.date}`);
  //       return false; // Skip invalid dates
  //     }
  //     return receiptDate >= startOfDay && receiptDate < endOfDay;
  //   });
  // },
  calculateTopPurchasedProducts: (receipts) => {
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
};



export const updateAccount = async (data) => {
  try {
    const response = await axios.post("/api/updateworker", data);
    return response.data; 
  } catch (error) {
    console.error("Error updating account:", error); // Log the error
    throw error;
  }
};

export const fetchReportData = async (companyId, reportType, filters) => {
  try {
    const response = await axios.get(`/api/reports/${companyId}`, {
      params: {
        reportType: reportType,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw new Error("Network response was not ok");
  }
};

export const getNextDayDate = () => {
  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  return nextDay.toISOString().split("T")[0];
};
