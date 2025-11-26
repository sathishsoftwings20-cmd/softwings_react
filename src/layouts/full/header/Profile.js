import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import { IconUser } from "@tabler/icons-react";

import ProfileImg from "src/assets/images/profile/user-1.jpg";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const navigate = useNavigate();

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // include token if your logout route requires Authorization
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => null);
        throw new Error(`HTTP ${response.status} ${text ?? ""}`);
      }

      // optional: read body if server returns JSON
      // const body = await response.json().catch(() => ({}));

      // close menu, clear token, show success
      handleClose2();
      localStorage.removeItem("token");
      setSnackbar({
        open: true,
        severity: "success",
        message: "Logged out successfully",
      });

      // redirect after short delay so user sees the alert
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      console.error("Error during logout:", error);
      handleClose2();
      setSnackbar({
        open: true,
        severity: "error",
        message: "Logout failed. Try again.",
      });
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt="Profile"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        {/* <MenuItem onClick={handleClose2} component={Link} to="/form-layouts">
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="subtitle1" color="textPrimary">
              My Profile
            </Typography>
          </ListItemText>
        </MenuItem> */}

        <Box mt={1} py={1} px={2}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
