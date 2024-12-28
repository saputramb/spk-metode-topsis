import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  IconButton,
  Typography,
} from "@mui/material";
import { IconMenu } from "@tabler/icons-react";
import { Logout } from "@mui/icons-material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  background: theme.palette.primary.light,
  justifyContent: "center",
  backdropFilter: "blur(4px)",
  borderRadius: 13,
  [theme.breakpoints.up("lg")]: {
    minHeight: "70px",
  },
}));
const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: "100%",
  color: theme.palette.text.secondary,
}));

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const router = useRouter()

  const [dataUser, setDataUser] = useState<{ name: string, role: string }>({ name: '', role: '' })

  useEffect(() => {
    if (Cookies.get('token')) {
      const decode: any = jwtDecode(Cookies.get('token')!)
      setDataUser({ name: decode.name, role: decode.role })
    }
  }, [])

  const signOut = () => {
    Cookies.remove('token')
    router.push('/v1/auth/sign-in')
  }

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <Typography variant="h6" color="textPrimary">
          YAYASAN DHARMA KASIH
        </Typography>

        <Box flexGrow={1} />
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="h6" color="textPrimary">
            {dataUser.name}
          </Typography>
          <Typography variant="subtitle1" textAlign={'end'} color="textPrimary">
            {dataUser.role}
          </Typography>
        </Box>
        <Box flexGrow={0.05} />
        <IconButton onClick={signOut}>
          <Logout color="primary" width="20" height="20" />
        </IconButton>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: Object,
};

export default Header;
