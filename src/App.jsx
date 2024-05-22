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
import { useSidebar } from "./context/context";
import Loader from "./components/Loader";
import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";
import UnauthenticatedRoutes from "./routes/UnauthenticatedRoutes";

const LandingPage = lazy(() => import("./views/LandingPage"));
const WorkerEntry = lazy(() => import("./views/WorkerEntry"));

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

                 <Suspense
                   fallback={
                     <div style={{height : "100vh"}}>
                       <Loader />
                     </div>
                   }>
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
                     {isLoggedIn && hasAccount ? (
                       <Route path="/*" element={<AuthenticatedRoutes />} />
                     ) : (
                       <Route
                         path="/*"
                         element={
                           <UnauthenticatedRoutes isLoggedIn={isLoggedIn} />
                         }
                       />
                     )}
                     <Route path="/account" element={<WorkerEntry />} />
                     <Route path="*" element={<Navigate to="/" />} />
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