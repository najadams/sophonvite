import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "../actions/action";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useSidebar } from "../context/context";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isSidebarExpanded, setIsSidebarExpanded } = useSidebar();
  const user = useSelector((state) => state.userState.currentUser);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const logout = () => {
    dispatch(ActionCreators.logoutCompany());
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const addEmployee = () => {
    setAnchorEl(null);
    navigate("!employee!@");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("mymd"));

  useEffect(() => {
    return () => {
      // Reset anchorEl when component unmounts
      setAnchorEl(null);
    };
  }, [user]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          color: "black",
          background: "white",
          boxShadow: "0px 3px 5px 2px rgba(0,0,0,0.2)",
        }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleSidebar()}
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <h3>Sophon</h3>
          </Typography>
          <div>
            <Tooltip title="Profile">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit">
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              // keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem
                onClick={handleClose}
                style={{
                  display: "flex",
                  gap: 15,
                }}>
                <PermIdentityIcon /> My account (
                {user ? (user.username ? user.username : user.name) : ""})
              </MenuItem>
              <Divider />
              <MenuItem onClick={addEmployee}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add an Employee account
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/settings");
                  handleClose();
                }}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={() => logout()}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
