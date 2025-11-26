import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox,
    Snackbar, Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { API } from '../../../api';

const AuthLogin = ({ title, subtitle, subtext }) => {

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: "",
    });

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", formData);

            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                setSnackbar({
                    open: true,
                    severity: "success",
                    message: "Login Successful!",
                });
                navigate("/admin/dashboard");
            } else {
                setSnackbar({
                    open: true,
                    severity: "error",
                    message: (res.data.msg || "Login failed"),
                });
            }

        } catch (err) {
            console.log(err);
            setSnackbar({
                open: true,
                severity: "error",
                message: "Login failed. Try again.",
            });
        }
    };

    return (
        <>
            {title && (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            )}

            {subtext}

            <Stack>
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} htmlFor='name' mb="5px">
                        Username
                    </Typography>
                    <CustomTextField
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />
                </Box>

                <Box mt="25px">
                    <Typography variant="subtitle1" fontWeight={600} htmlFor='password' mb="5px">
                        Password
                    </Typography>
                    <CustomTextField
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />
                </Box>

                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Remember this Device"
                        />
                    </FormGroup>

                    {/* <Typography
                        component={Link}
                        to="/forgot-password"
                        fontWeight="500"
                        sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                        Forgot Password?
                    </Typography> */}
                </Stack>
            </Stack>

            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleLogin}
                >
                    Sign In
                </Button>
            </Box>

            {subtitle}
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
        </>
    );
};

export default AuthLogin;
