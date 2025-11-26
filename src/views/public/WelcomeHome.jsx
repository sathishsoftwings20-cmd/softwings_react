import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router";

export default function WelcomeHome() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                p: 3
            }}
        >
            <Typography variant="h2" fontWeight={700} mb={2}>
                Welcome to Your Application
            </Typography>

            <Typography variant="h6" color="text.secondary" mb={4}>
                Please login to access your admin dashboard.
            </Typography>

            <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                to="/auth/login"
            >
                Go to Login
            </Button>
        </Box>
    );
}
