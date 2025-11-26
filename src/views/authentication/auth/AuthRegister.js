import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { API } from '../../../api';

const AuthRegister = ({ title, subtitle, subtext }) => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleRegister = async () => {
        try {
            const res = await API.post("/auth/register", formData);
            if (res.data.success) {
                alert("Registration successful! Please login.");
                navigate("/auth/login");
            }
        } catch (err) {
            alert("Registration failed. Check console.");
            console.log(err);
        }
    };

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='name' mb="5px">
                        Name
                    </Typography>
                    <CustomTextField id="name" variant="outlined" fullWidth value={formData.name} onChange={handleChange} />

                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">
                        Email Address
                    </Typography>
                    <CustomTextField id="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />

                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">
                        Password
                    </Typography>
                    <CustomTextField id="password" variant="outlined" fullWidth type="password" value={formData.password} onChange={handleChange} />
                </Stack>

                <Button color="primary" variant="contained" size="large" fullWidth onClick={handleRegister}>
                    Sign Up
                </Button>
            </Box>

            {subtitle}
        </>
    );
};

export default AuthRegister;
