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
    { path: "/debt", icon: "bx-money", text: "Debt" },
    { path: "/transactions", icon: "bx-money-withdraw", text: "Transactions" },
    { path: "/reports", icon: "bx-line-chart", text: "Reports" },
    { path: "/notification", icon: "bx-notification", text: "Notification" },
  ];

  const sidebarVariants = {
    expanded: {
      width: "250px",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    collapsed: {
      width: "70px",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    expanded: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
    collapsed: {
      x: -10,
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: "easeOut",
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
            isExpanded ? "bx-chevrons-left" : "bx-chevrons-right"
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
                initial={isExpanded ? "expanded" : ""}
                animate={isExpanded ? "expanded" : ""}
                transition={{ delay: index * 0.03 }}>
                <NavLink
                  className="navlink"
                  to={item.path}
                  activeclassname="active">
                  {/* Icon is always visible */}
                  <i className={`bx ${item.icon} icon`} />

                  {/* Show text only when sidebar is expanded */}
                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.span
                        className="text nav-text"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}>
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
