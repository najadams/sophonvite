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
              <NavLink
                className="navlink"
                to={"/dashboard"}
                activeclassname="active">
                <i className="bx bx-home icon"></i>
                <span className="text nav-text">DashBoard</span>
              </NavLink>
            </li>

            <li className="nav-link">
              <NavLink
                className="navlink"
                to={"/sales"}
                activeclassname="active">
                <i className="bx bx-receipt icon"></i>
                <span className="text nav-text">Make Sales</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                className="navlink"
                to={"/customers"}
                activeclassname="active">
                <i className="bx bx-user-plus icon"></i>
                <span className="text nav-text">Customers</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                className="navlink"
                to={"/products"}
                activeclassname="active">
                <i className="bx bx-cart-alt icon"></i>
                <span className="text nav-text">Inventory</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                className="navlink"
                to={"/vendors"}
                activeclassname="active">
                <i className="bx bx-store-alt icon"></i>
                <span className="text nav-text">Vendors</span>
              </NavLink>
            </li>
            {/*   */}
            <li className="nav-link">
              <NavLink
                className="navlink"
                to={"/debt"}
                activeclassname="active">
                <i className="icon">
                  <img
                    src="./debt.png"
                    style={{ height: 20, width: 20 }}
                    alt="D"
                  />
                </i>
                <span className="text nav-text">Debt</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                className="navlink"
                to={"/transactions"}
                activeclassname="active">
                <i className="bx bx-money-withdraw icon"></i>
                <span className="text nav-text">Transactions</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                className="navlink"
                to={"/reports"}
                activeclassname="active">
                <i className="bx bxs-report icon"></i>
                <span className="text nav-text">Reports</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink
                className="navlink"
                to={"/notification"}
                activeclassname="active">
                <i className="bx bx-notification icon"></i>
                <span className="text nav-text">Notification</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
