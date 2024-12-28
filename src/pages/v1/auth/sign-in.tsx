import { FormControl } from "@mui/base";
import { useRouter } from "next/router";
import { useState } from "react";
import { CustomizedHelperText, CustomizedLabel, CustomizedTextField } from "../components/CustomizedTextField";
import Cookies from "js-cookie";
import PageContainer from "../components/container/PageContainer";
import { Alert, Box, Button, Card, Grid2, Snackbar, SnackbarCloseReason, Typography } from "@mui/material";
import Image from "next/image";
import client from "../services";

interface SnackBar {
    status: 'error' | 'success' | 'info' | 'warning' | undefined,
    message: string,
    isOpen: boolean
}

const SignIn = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [snackBar, setSnackBar] = useState<SnackBar>({ status: undefined, message: '', isOpen: false });

    const openSnackBar = ({ status, message }: SnackBar) => {
        setSnackBar({ status: status, message: message, isOpen: true });
    };

    const closeSnackBar = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBar({ status: undefined, message: '', isOpen: false });
    };

    const signIn = async (e: any) => {
        e.preventDefault();

        try {
            const result = await client.post('/api/services/auth/sign-in', { email: formData.email, password: formData.password })
            Cookies.set('token', result.data.token)
            openSnackBar({ status: result.data.status.toLowerCase(), message: result.data.message, isOpen: true })
            setTimeout(() => {
                router.push('/')
            }, 2000)
        } catch (error: any) {
            openSnackBar({ status: error.response.data.status.toLowerCase(), message: error.response.data.message, isOpen: true })
        }
    }

    return (
        <PageContainer title="Login" description="this is Login page">
            <Box
                sx={{
                    position: "relative",
                    "&:before": {
                        content: '""',
                        background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
                        backgroundSize: "400% 400%",
                        animation: "gradient 15s ease infinite",
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        opacity: "0.3",
                    },
                }}
            >
                <Grid2
                    container
                    spacing={0}
                    justifyContent="center"
                    sx={{ height: "100vh" }}
                >
                    <Grid2
                        size={{
                            xs: 12,
                            sm: 12,
                            lg: 4,
                            xl: 3,
                        }}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Card
                            elevation={9}
                            sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
                        >
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Image src="/images/logos/Logo.png" alt="logo" height={100} width={100} priority />
                            </Box>
                            <Typography fontWeight="700" variant="h3" mb={1} textAlign={'center'}>
                                YAYASAN DHARMA KASIH
                            </Typography>
                            <form onSubmit={signIn}>
                                <Box sx={{ height: '25vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                                    <FormControl required>
                                        <CustomizedLabel>Email</CustomizedLabel>
                                        <CustomizedTextField placeholder="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" />
                                        <CustomizedHelperText />
                                    </FormControl>
                                    <FormControl required>
                                        <CustomizedLabel>Password</CustomizedLabel>
                                        <CustomizedTextField placeholder="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" name="password" id="password" />
                                        <CustomizedHelperText />
                                    </FormControl>
                                    <Box>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            type="submit"
                                        >
                                            Sign In
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        </Card>
                    </Grid2>
                </Grid2>
            </Box>
            <Snackbar open={snackBar.isOpen} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={closeSnackBar}>
                <Alert
                    onClose={closeSnackBar}
                    severity={snackBar.status}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: '20px' }}
                >
                    {snackBar.message}
                </Alert>
            </Snackbar>
        </PageContainer>
    )
}

export default SignIn