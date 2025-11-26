import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert, MenuItem } from "@mui/material";
import BaseCard from "../../components/BaseCard/BaseCard";
import { API } from "../../api";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // default role
  });

  const [nameError, setNameError] = useState("");
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Role Options
  const roleOptions = [
    // { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  // Check Username Exists
  const checkName = async () => {
    if (!formData.name) return;

    try {
      const res = await API.post("/auth/check-name", { name: formData.name });
      if (res.data.exists) {
        setNameError("Name already taken!");
      } else {
        setNameError("");
      }
    } catch (err) {
      console.error("checkName error:", err);
    }
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Handler
  const handleRegister = async () => {
    if (!validate()) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Fix validation errors first",
      });
      return;
    }

    if (nameError) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Fix username error before submitting.",
      });
      return;
    }

    try {
      const res = await API.post("/auth/register", formData);

      if (res?.data?.success) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "User created successfully!",
        });
        setFormData({ name: "", email: "", password: "", role: "user" });
        setErrors({});
        setNameError("");
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: res?.data?.message || res?.data?.msg || "Submission failed",
        });
      }
    } catch (err) {
      console.error("register error:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error submitting user create",
      });
    }
  };

  return (
    <div>
      <BaseCard title="User Registration">
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.name}
            onChange={handleChange}
            onBlur={checkName}
            error={!!errors.name || !!nameError}
            helperText={errors.name || nameError}
          />

          <TextField
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />

          {/* Role Dropdown */}
          <TextField
            name="role"
            select
            label="Role"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.role}
            onChange={handleChange}
          >
            {roleOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" onClick={handleRegister}>
            Submit
          </Button>
        </form>
      </BaseCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
