import { useState } from "react";
import { API } from "../../api.js";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";

export default function EnquiryAdd() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });

  const [nameError, setNameError] = useState("");
  const [errors, setErrors] = useState({}); // validation errors
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Validation Function
  const validate = () => {
    let newErrors = {};

    if (!form.name || !form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email || !form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.phone || !form.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (String(form.phone).replace(/\D/g, "").length < 10) {
      newErrors.phone = "Phone must be at least 10 numbers";
    }
    if (!form.date || !form.date.trim()) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Fix validation errors first",
      });
      return;
    }

    try {
      const res = await API.post("/form", form);

      if (res?.data?.success) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Form submitted successfully!",
        });
        setForm({ name: "", email: "", phone: "", date: "", message: "" });
        setErrors({});
        setNameError("");
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: res?.data?.msg || "Submission failed",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error submitting enquiry",
      });
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <h2>Add Enquiry</h2>

          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name || !!nameError}
              helperText={errors.name || nameError}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />

            <TextField
              fullWidth
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              multiline
              rows={3}
            />

            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
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
    </>
  );
}
