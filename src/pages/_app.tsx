import "@/styles/globals.css";
import { Box, Container, CssBaseline, styled, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { baselightTheme } from "./v1/utils/theme/DefaultColors";
import Sidebar from "./v1/components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import Header from "./v1/components/header/Header";
import Cookies from "js-cookie";
import SignIn from "./v1/auth/sign-in";
import { useRouter } from "next/router";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  padding: "20px",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const currentPath = router.pathname;

    if (token) {
      setIsAuth(true);
      if (currentPath === "/v1/auth/sign-in") {
        router.replace("/");
      }
    } else {
      setIsAuth(false);
      if (currentPath !== "/v1/auth/sign-in") {
        router.replace("/v1/auth/sign-in");
      }
    }
    
    setLoading(false);
  }, [router.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={baselightTheme}>
      <CssBaseline />
      {!isAuth ? <SignIn /> : (<MainWrapper className="mainwrapper">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
        <PageWrapper className="page-wrapper">
          <Container
            sx={{
              maxWidth: "1300px !important",
            }}
          >
            <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
            <Box sx={{ minHeight: "calc(100vh - 170px)", py: 3 }}>
              <Component {...pageProps} />
            </Box>
          </Container>
        </PageWrapper>
      </MainWrapper>)}
    </ThemeProvider>
  );
}