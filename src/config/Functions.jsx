import axios from "./index";
export  const formatNumber = (num) => new Intl.NumberFormat().format(num);
const processDailyData = (receipts) => {
  // First, aggregate the data with full precision
  const dailyData = receipts.reduce((acc, receipt) => {
    const date = new Date(receipt.createdAt);
    const dayKey = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    if (!acc[dayKey]) {
      acc[dayKey] = {
        totalSales: 0,
        details: [],
        totalProfit: 0,
        // Store raw values for calculations
        rawSales: 0,
        rawProfit: 0,
      };
    }

    // Keep raw values for accurate calculations
    acc[dayKey].rawSales += receipt.total;
    acc[dayKey].rawProfit += receipt.profit;

    // Round only for display
    acc[dayKey].totalSales = Number(acc[dayKey].rawSales.toFixed(2));
    acc[dayKey].totalProfit = Number(acc[dayKey].rawProfit.toFixed(2));
    acc[dayKey].details.push(...receipt.detail);

    return acc;
  }, {});

  // Sort dates chronologically
  const sortedLabels = Object.keys(dailyData).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("-").map(Number);
    const [dayB, monthB, yearB] = b.split("-").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA - dateB;
  });

  // Create data arrays maintaining precision for calculations
  const salesData = sortedLabels.map((day) => ({
    date: day,
    value: dailyData[day].totalSales,
    // Include raw value for precise calculations if needed
    rawValue: dailyData[day].rawSales,
  }));

  const profitData = sortedLabels.map((day) => ({
    date: day,
    value: dailyData[day].totalProfit,
    // Include raw value for precise calculations if needed
    rawValue: dailyData[day].rawProfit,
  }));

  // Format dates for better display
  const formattedLabels = sortedLabels.map((day) => {
    const [d, m, y] = day.split("-");
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  });

  return {
    labels: formattedLabels,
    salesData: salesData.map((item) => item.value),
    profitData: profitData.map((item) => item.value),
    // Include raw data arrays if needed for additional calculations
    rawSalesData: salesData.map((item) => item.rawValue),
    rawProfitData: profitData.map((item) => item.rawValue),
  };
};

// Example usage:
const formatDataForChart = (processedData) => {
  return processedData.labels.map((label, index) => ({
    date: label,
    sales: processedData.salesData[index],
    profit: processedData.profitData[index],
  }));
};
  
const calculateTopProfitableProducts = (receipts) => {
  // Create a map to store product profits
  const productProfits = {};

  // Process each receipt
  receipts.forEach((receipt) => {
    receipt.detail.forEach((item) => {
      const productName = item.name;
      const profit = item.profit || 0;

      if (!productProfits[productName]) {
        productProfits[productName] = {
          name: productName,
          profit: 0,
          percentage: 0,
        };
      }

      productProfits[productName].profit += profit;
    });
  });

  // Convert to array and sort by profit
  const sortedProducts = Object.values(productProfits)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  // Calculate total profit for percentage
  const totalProfit = sortedProducts.reduce(
    (sum, product) => sum + product.profit,
    0
  );

  // Calculate percentage for each product
  return sortedProducts.map((product) => ({
    ...product,
    percentage: ((product.profit / totalProfit) * 100).toFixed(1),
  }));
};

const calculateTopCustomers = (receipts) => {
  // Create a map to store customer sales
  const customerSales = {};

  // Process each receipt
  receipts.forEach((receipt) => {
    // console.log(receipt)
    const customerId = receipt.customerId?._id;
    const customerName = receipt.customerId?.name || "Unknown Customer";
    const total = receipt.total || 0;

    if (!customerSales[customerId]) {
      customerSales[customerId] = {
        id: customerId,
        name: capitalizeFirstLetter(customerName),
        totalSales: 0,
        percentage: 0,
      };
    }

    customerSales[customerId].totalSales += total;
  });

  // Convert to array and sort by total sales
  const sortedCustomers = Object.values(customerSales)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 10);

  // Calculate total sales for percentage
  const totalSales = sortedCustomers.reduce(
    (sum, customer) => sum + customer.totalSales,
    0
  );

  // Calculate percentage for each customer
  return sortedCustomers.map((customer) => ({
    ...customer,
    percentage: ((customer.totalSales / totalSales) * 100).toFixed(1),
  }));
};


const calculateTopPurchasedProducts = (receipts) => {
  // Accumulate the total quantity and profit of each product across all receipts
  const productCounts = receipts.reduce((acc, receipt) => {
    receipt.detail.forEach((item) => {
      if (!acc[item.name]) {
        acc[item.name] = { quantity: 0, profit: 0 };
      }
      const quantity = Math.abs(item.quantity);
      acc[item.name].quantity += quantity;
      acc[item.name].profit += Math.abs(
        (item.salesPrice - item.costPrice) * quantity
      );
    });
    return acc;
  }, {});

  // Convert the productCounts object to an array of [name, { quantity, profit }] pairs
  // and sort the array in descending order based on quantity and profit
  const sortedProductsQuantityBased = Object.entries(productCounts)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 10);

  const sortedProductsProfitBased = Object.entries(productCounts)
    .sort((a, b) => b[1].profit - a[1].profit)
    .slice(0, 10);

  // Convert the sorted arrays back to an array of objects with name, quantity, and profit
  const topProductsByQuantity = sortedProductsQuantityBased.map(
    ([name, { quantity, profit }]) => ({
      name,
      quantity,
      profit,
    })
  );

  const topProductsByProfit = sortedProductsProfitBased.map(
    ([name, { quantity, profit }]) => ({
      name,
      quantity,
      profit,
    })
  );

  // Return both sorted data
  return {
    topProductsByQuantity,
    topProductsByProfit,
  };
};

export const tableActions = {
  fetchCustomers: async (companyId) => {
    try {
      const response = await axios.get(`/api/customers/${companyId}`);
      const data = response.data.customers.map((item, index) => ({
        id: item._id,
        index: index + 1,
        company: item.company ? item.company : "None",
        name: item.name,
        phone: item.phone ?  item.phone : "+233____",
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
      const data = response.data.customers.map((item) =>
        capitalizeFirstLetter(`${item?.company || "None"} - ${item?.name}`)
      );
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
        costPrice: item.costPrice,
        salesPrice: item.salesPrice,
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
        salesPrice: item.salesPrice,
        onhand: item.onhand,
      }));
      return data;
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },

  updateCustomer: async ({ id, name, phone, email, address, company }) => {
    try {
      console.log(id)
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
  updateCompanyData: async ({ companyId, ...details }) => {
    try {
      // empty fileds in the settings forms do not change the prev values 
      // Prepare the payload by filtering out empty values
      const updateFields = {};
      for (const [key, value] of Object.entries(details)) {
        if (value !== undefined && value !== null && value !== "") {
          updateFields[key] = value;
        }
      }

      const submissionData = { companyId, ...updateFields };
      // Send the PATCH request to update the company details
      const response = await axios.patch(
        `/update/${companyId}`,
        submissionData
      );

      // Check if the update was successful
      if (response.status === 200) {
        return response.data; // Return the updated company data
      }
    } catch (error) {
      console.log(error);
      // return error.response?.data?.message || "An error occurred";
      throw new Error(error.response?.data?.message || "Ann error occured");
    }
  },

  // addCustomer: async ({ companyId, name, phone, email, address, company }) => {
  //   try {
  //     const response = await axios.post(`/api/customer/`, {
  //       belongsTo: companyId,
  //       name,
  //       phone,
  //       email,
  //       address,
  //       company,
  //     });
  //     if (response.status === 201) {
  //       return response.data; // Return the customer data
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return error.response?.data?.message || "An error occurred";
  //   }
  // },

  addCustomer : async ({ companyId, name, phone, email, address, company }) => {
  try {
    const response = await axios.post(`/api/customer/`, {
      belongsTo: companyId,
      name,
      phone,
      email,
      address,
      company,
    });

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    // Check if it's a known error response from our API
    console.log(error.response.data.message);
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data.message;
      throw new Error(errorMessage); // Throw the specific error message
    }

    // For other types of errors
    console.error('Customer addition error:', error);
    throw new Error('Failed to add customer. Please try again.');
  }
},

  updateProduct: async ({ id, name, costPrice, salesPrice, onHand }) => {
    try {
      const product = await axios.patch(`/api/product/${id}`, {
        id,
        name,
        costPrice: costPrice,
        salesPrice: salesPrice,
        onhand: onHand,
      });
      if (product.status === 200) {
        return null;
      }
    } catch (error) {
      console.error(error);
      return error.response?.data?.message || "An error occurred";
    }
  },

  addProduct: async ({ companyId, name, costPrice, salesPrice, onHand }) => {
    try {
      const product = await axios.post(`/api/product/`, {
        companyId,
        name,
        costPrice: costPrice,
        salesPrice: salesPrice,
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
    role
  }) => {
    try {
      const smallName = name.toLowerCase();
      const response = await axios.post(`/api/worker/`, {
        companyId,
        name: smallName,
        username,
        contact,
        password,
        role
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

  addReceipt: async (values, companyId, workerId, checkDebt) => {
    try {
      const response = await axios.post("/api/receipt/", {
        ...values,
        companyId,
        workerId,
        checkDebt,
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
  updateReceipt: async (receiptId, values, companyId, workerId) => {
    try {
    const response = await axios.patch(
      `/api/receipt/${receiptId}`, // Ensure this endpoint is correct
      {
        ...values, // Include the updated values
        companyId, // Add company ID to the request
        workerId, // Add worker ID to the request
      }
    );

    if (response.status === 200) {
      console.log("Receipt updated successfully");
      return response.data;
    } else {
      console.error("Failed to update the receipt");
    }
  } catch (error) {
    console.error("Failed to update the receipt:", error.message);
    throw error;
  }
},
  addVendor: async (values, companyId) => {
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

  fetchReceipts: async (companyId, selectedDate) => {
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
  fetchReceiptsById: async ({ receiptId }) => {
    try {
      const response = await axios.get(`/api/receipt/${receiptId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  fetchPaymentsById: async ({ debtId }) => {
    try {
      const response = await axios.get(`/api/debt/${debtId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  fetchDebt: async (companyId, selectedDate, selectedDuration) => {
    try {
      let url = `/api/debts/${companyId}?`;

      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        url += `date=${formattedDate}&`;
        console.log(formattedDate);
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
  fetchSuppliersNames: async (companyId) => {
    try {
      const response = await axios.get(`api/suppliers/${companyId}`);
      if (response.status === 200) {
        return response.data.map((data) =>
          capitalizeFirstLetter(data.supplierName)
        );
      }
    } catch (error) {
      throw new Error(error.response.data.message || "Failed to fetch counts");
    }
  },
  fetchSuppliers: async (companyId) => {
    try {
      const response = await axios.get(`api/suppliers/${companyId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error(error.response.data.message || "Failed to fetch counts");
    }
  },
  addSupplier: async ({ companyId, companyName, supplierName, contact }) => {
    try {
      const response = await axios.post(`/api/supplier/${companyId}`, {
        companyId,
        companyName,
        supplierName,
        contact,
      });

      if (response.status === 201) {
        // Return the data from the response
        return response.data; // use data, not message
      } else {
        // Handle unexpected status codes
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      // Throw the error so the calling function can handle it
      throw error?.response?.data?.message || "Failed to add supplier";
    }
  },

  restock: async (values, companyId, supplierName) => {
    try {
      const response = await axios.post(`/api/restock/${companyId}`, {
        ...values,
        companyId: companyId,
      });
      if (response.status === 200 || response.status === 201) {
        // Successful response
        return response.data;
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
  fetchSalesData : async (companyId) => {
  try {
    const receiptsResponse = await axios.get(`/api/overall/${companyId}`);
    const receipts = receiptsResponse.data;
    
    const { labels, salesData, profitData } = processDailyData(receipts);
    const { topProductsByProfit, topProductsByQuantity } = calculateTopPurchasedProducts(receipts);
    
    // Add new analytics
    const topProfitableProducts = calculateTopProfitableProducts(receipts);
    const topCustomers = calculateTopCustomers(receipts);
    
    const sales = labels.map((label, index) => ({
      month: label,
      totalSales: salesData[index],
    }));
    
    const profit = labels.map((label, index) => ({
      month: label,
      totalProfit: profitData[index],
    }));

    return {
      sales,
      profit,
      topProductsByQuantity,
      topProductsByProfit,
      topProfitableProducts,
      topCustomers
    };
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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return str;
};

export const serverAid = {
  calculateTopPurchasedProducts : (receipts) => {
  // Accumulate the total quantity and profit of each product across all receipts
  const productCounts = receipts.reduce((acc, receipt) => {
    receipt.detail.forEach((item) => {
      if (!acc[item.name]) {
        acc[item.name] = { quantity: 0, profit: 0 };
      }
      const quantity = Math.abs(item.quantity);
      acc[item.name].quantity += quantity;
      acc[item.name].profit += Math.abs((item.salesPrice - item.costPrice) * quantity);
    });
    return acc;
  }, {});

  // Convert the productCounts object to an array of [name, { quantity, profit }] pairs
  // and sort the array in descending order based on quantity and profit
  const sortedProductsQuantityBased = Object.entries(productCounts)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 10);

  const sortedProductsProfitBased = Object.entries(productCounts)
    .sort((a, b) => b[1].profit - a[1].profit)
    .slice(0, 10);

  // Convert the sorted arrays back to an array of objects with name, quantity, and profit
  const topProductsByQuantity = sortedProductsQuantityBased.map(([name, { quantity, profit }]) => ({
    name,
    quantity,
    profit,
  }));

  const topProductsByProfit = sortedProductsProfitBased.map(([name, { quantity, profit }]) => ({
    name,
    quantity,
    profit,
  }));

  // Return both sorted data
  return {
    topProductsByQuantity,
    topProductsByProfit
  };
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
  const { startDate, endDate } = filters;

  let endpoint;

  switch (reportType) {
    case "summary":
      endpoint = `/api/reports/summary?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`;
      break;
    case "sales":
      endpoint = `/api/reports/sales?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`;
      break;
    case "summary":
      endpoint = `/api/reports/summary?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`;
      break;
    case "purchases":
      endpoint = `/api/reports/purchases?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`;
      break;
    case "inventory":
      endpoint = `/api/reports/inventory?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`;
      break;
    case "debts":
      endpoint = `/api/reports/debts?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`;
      break;
    default:
      throw new Error("Invalid report type");
  }

  const response = await axios.get(endpoint);
  return response.data;
};

export const getNextDayDate = () => {
  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  return nextDay.toISOString().split("T")[0];
};

export const updateOnhandAfterSale = (productOptions, values, allowBelowZero = true) => {
  values.products.forEach(soldItem => {
    const productToUpdate = productOptions.find(
      product => product.name === soldItem.name
    );
    if (productToUpdate) {
      productToUpdate.onhand -= soldItem.quantity
    }

    // if (productToUpdate.onhand < 0 && allowBelowZero) {
    //   productToUpdate.onhand = 0;
    // }
  });
  return productOptions
}
export const updateValuesAfterRestock = (products, values) => {
  values.products.forEach(receivedItem => {
    const productToUpdate = products.find(
      product => product.name === receivedItem.name
    );
    if (productToUpdate) {
      productToUpdate.onHand += receivedItem.quantity
      productToUpdate.costPrice = receivedItem.costPrice
      productToUpdate.salesPrice = receivedItem.salesPrice
    }

  });
  return products
}
export const updateValuesAfterEdit = (Data, values) => {
    const productToUpdate = Data.find(
      product => product.id === values._id
    );
    console.log(productToUpdate)
  if (productToUpdate) {
      productToUpdate.name = values.name
      productToUpdate.costPrice = values.costPrice
      productToUpdate.salesPrice = values.salesPrice
    }

  return Data
}
