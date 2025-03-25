import { NavLink } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("mymd"));

  const menuItems = [
    { path: "/dashboard", icon: "bx-home", text: "Dashboard" },
    { path: "/sales", icon: "bx-receipt", text: "Make Sales" },
    { path: "/products", icon: "bx-cart-alt", text: "Inventory" },
    { path: "/customers", icon: "bx-user-plus", text: "Customers" },
    { path: "/vendors", icon: "bx-store-alt", text: "Vendors" },
    { path: "/debt", icon: "debt", text: "Debt" },
    { path: "/transactions", icon: "bx-money-withdraw", text: "Transactions" },
    { path: "/reports", icon: "bx-bxs-report", text: "Reports" },
    { path: "/notification", icon: "bx-notification", text: "Notification" },
  ];

  const sidebarVariants = {
    expanded: {
      width: "250px",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    collapsed: {
      width: "70px",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const itemVariants = {
    expanded: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    collapsed: {
      x: -20,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.nav
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      variants={sidebarVariants}
      initial={isExpanded ? "expanded" : "collapsed"}
      animate={isExpanded ? "expanded" : "collapsed"}>
      <div className="chevron" onClick={toggleSidebar}>
        <motion.i
          className={`toggle bx ${
            isExpanded ? "bx-chevron-left" : "bx-chevron-right"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
      </div>

      <div className="menu-bar">
        <div className="menu">
          <ul
            className="menu-links"
            onClick={() => {
              isMobile && toggleSidebar();
            }}>
            {menuItems.map((item, index) => (
              <motion.li
                key={item.path}
                className="nav-link"
                variants={itemVariants}
                initial={isExpanded ? "expanded" : "collapsed"}
                animate={isExpanded ? "expanded" : "collapsed"}
                transition={{ delay: index * 0.05 }}>
                <NavLink
                  className="navlink"
                  to={item.path}
                  activeclassname="active">
                  <i className={`bx ${item.icon} icon`}>
                    {item.icon === "debt" && (
                      <img
                        src="./debt.png"
                        style={{ height: 20, width: 20 }}
                        alt="D"
                      />
                    )}
                  </i>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        className="text nav-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}>
                        {item.text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Sidebar;
