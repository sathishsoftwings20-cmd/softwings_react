import React from "react";
import { Box, Typography } from "@mui/material";
import PageContainer from "src/components/container/PageContainer";

export default function Welcome() {
    return (
        <PageContainer title="Dashboard" description="Dashboard Home">
            <Box
                sx={{
                    mt: 10,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight={700}
                    sx={{ mb: 1 }}
                >
                    Welcome 👋
                </Typography>

                <Typography
                    variant="h5"
                    color="primary"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Softwings Admin Panel
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 500, margin: "0 auto", fontSize: "1.05rem" }}
                >
                    Use the sidebar to manage Users, Roles, Content, and System Settings.
                </Typography>
            </Box>
        </PageContainer>
    );
}
