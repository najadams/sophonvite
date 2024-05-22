import { NavLink } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("mymd"));

  return (
    <nav className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      {/* CODE FOR THE CHEVRON */}

      <div className="chevron" onClick={toggleSidebar}>
        <i
          className={`toggle bx ${
            isExpanded ? "bx-chevron-left" : "bx-chevron-right"
          }`}></i>
      </div>

      {/* CODE FOR THE MAIN CONTENT */}

      <div className="menu-bar">
        <div className="menu">
          <ul
            className="menu-links"
            onClick={() => {
              isMobile && toggleSidebar();
            }}>
            <li className="nav-link">
              <NavLink to={"/dashboard"} activeclassname="active">
                <i className="bx bxs-home icon"></i>
                <span className="text nav-text">DashBoard</span>
              </NavLink>
            </li>

            <li className="nav-link">
              <NavLink to={"/sales"} activeclassname="active">
                <i className="bx bx-receipt icon"></i>
                <span className="text nav-text">Make Sales</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink to={"/customers"} activeclassname="active">
                <i className="bx bx-user-plus icon"></i>
                <span className="text nav-text">Customers</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink to={"/products"} activeclassname="active">
                <i className="bx bx-cart-alt icon"></i>
                <span className="text nav-text">Stock</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink to={"/vendors"} activeclassname="active">
                <i className="bx bxs-truck icon"></i>
                <span className="text nav-text">Vendors</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink to={"/transactions"} activeclassname="active">
                <i className="bx bx-money-withdraw icon"></i>
                <span className="text nav-text">Transactions</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
