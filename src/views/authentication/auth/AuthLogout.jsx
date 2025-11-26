// src/views/authentication/LogoutPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { API } from "../../../api"; // adjust path if needed

export default function AuthLogout() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Option A: use your API axios instance (preferred)
        const token = localStorage.getItem("token");
        await API.post(
          "/auth/logout",
          {},
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        // Clear client state
        localStorage.removeItem("token");
        if (API.defaults?.headers?.common)
          delete API.defaults.headers.common["Authorization"];

        setSnackbar({
          open: true,
          severity: "success",
          message: "Logged out successfully",
        });

        // redirect after small delay so user sees the message
        setTimeout(() => navigate("/auth/login"), 900);
      } catch (err) {
        console.error("Logout failed:", err);
        // still clear client side
        localStorage.removeItem("token");
        if (API.defaults?.headers?.common)
          delete API.defaults.headers.common["Authorization"];

        setSnackbar({
          open: true,
          severity: "error",
          message: "Logout failed — try again",
        });
        setTimeout(() => navigate("/auth/login"), 900);
      }
    })();
  }, [navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Logging out…
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
