import { lazy, Suspense } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header, Sidebar } from "./components";
import store, { persistor } from "./store/store";
import { Provider, useSelector } from "react-redux";
import { QueryClientProvider, QueryClient } from "react-query";
import { PersistGate } from "redux-persist/integration/react";
import Settings from "./views/Settings";
import { useSidebar } from "./context/context";
import WorkerForm from "./views/WorkerForm";
import WorkerEntry from "./views/WorkerEntry";
import Loader from "./components/Loader";
const SignIn = lazy(() => import("./views/SignIn"));
const LandingPage = lazy(() => import("./views/LandingPage"));
const Register = lazy(() => import("./views/Register"));
const Dashboard = lazy(() => import("./views/Dashboard"));
const Customers = lazy(() => import("./views/Customers"));
const ProductCatalogue = lazy(() => import("./views/ProductCatalogue"));
const StockEntry = lazy(() => import("./views/StockEntry"));
const SalesOrders = lazy(() => import("./views/SalesOrders"));
const InventoryReports = lazy(() => import("./views/InventoryReports"));

const NoPage = lazy(() => import("./views/NoPage"));

const queryClient = new QueryClient();

function App() {
  const { isSidebarExpanded, setIsSidebarExpanded } = useSidebar();
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };
  const isLoggedIn = useSelector((state) => state.companyState.isLoggedIn);
  const hasAccount = useSelector((state) => state.users?.currentUser !== null);
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div style={{ height: "100vh", display: "flex" }}>
            <Router>
              {isLoggedIn && hasAccount && (
                <Sidebar
                  isExpanded={isSidebarExpanded}
                  toggleSidebar={toggleSidebar}
                />
              )}
              <div style={{ flex: 1 }}>
                {isLoggedIn && hasAccount !== undefined && hasAccount && (
                  <Header isLoggedIn={isLoggedIn} />
                )}

                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        isLoggedIn && hasAccount ? (
                          <Navigate to="/dashboard" />
                        ) : (
                          <LandingPage isLoggedIn={isLoggedIn} />
                        )
                      }
                    />
                    <Route
                      path="/login"
                      element={<SignIn isLoggedIn={isLoggedIn} />}
                    />
                    <Route path="/register" element={<Register />} />
                    {isLoggedIn && hasAccount ? (
                      <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                          path="/products"
                          element={<ProductCatalogue />}
                        />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/!employee!@" element={<WorkerForm />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/stocks" element={<StockEntry />} />
                        <Route
                          path="/inventory"
                          element={<InventoryReports />}
                        />
                        <Route path="/account" element={<WorkerEntry />} />
                        <Route path="/sales" element={<SalesOrders />} />
                      </>
                    ) : (
                      <>
                        <Route path="/account" element={<WorkerEntry />} />
                        <Route path="*" element={<SignIn />} />
                      </>
                    )}
                    {/* <Route element={<PrivateRoutes />} /> */}
                    <Route path="*" element={<NoPage />} />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </div>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
