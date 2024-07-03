import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'


const SalesOrders = lazy(() => import("../../views/SalesOrders"))

const SalesRoutes = () => {
    return (
      <Routes>
        <Route index to={"/"} element={<SalesOrders />} />
      </Routes>
    );
}

export default SalesRoutes