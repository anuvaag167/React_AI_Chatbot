import { AppBar, Toolbar, Box } from "@mui/material";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

export default function Header() {
  const auth = useAuth();

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink bg="#00fffc" to="/chat" text="Go To Chat" textColor="black" />
              <NavigationLink bg="#51538f" to="/" text="Logout" textColor="white" onClick={auth.logout} />
            </>
          ) : (
            <>
              <NavigationLink bg="#00fffc" to="/login" text="Go To Chat" textColor="black" />
              <NavigationLink bg="#51538f" to="/signup" text="Signup" textColor="white" />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
