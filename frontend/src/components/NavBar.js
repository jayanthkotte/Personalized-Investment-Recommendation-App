import React from "react";
import { AppBar, Toolbar, Button, IconButton, Typography, Box } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { motion } from "framer-motion";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/bank-upload", label: "Bank Data", icon: <UploadFileIcon /> },
    { path: "/investment", label: "Investments", icon: <AccountBalanceWalletIcon /> },
    { path: "/recommendation", label: "Recommendations", icon: <TrendingUpIcon /> },
    { path: "/tips", label: "Tips", icon: <TipsAndUpdatesIcon /> },
    { path: "/profile", label: "Profile", icon: <PersonIcon /> }
  ];

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <AppBar position="sticky" color="default" elevation={4} sx={{ background: 'linear-gradient(90deg, #0f2027 0%, #2c5364 100%)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton edge="start" color="primary" sx={{ background: 'white', mr: 1 }}>
              <Typography variant="h6" color="primary" fontWeight={700}>₹</Typography>
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              InvestSmart
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                color={location.pathname === item.path ? "primary" : "inherit"}
                variant={location.pathname === item.path ? "contained" : "text"}
                sx={{
                  borderRadius: 2,
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  background: location.pathname === item.path ? 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)' : 'none',
                  color: location.pathname === item.path ? 'white' : 'inherit',
                  boxShadow: location.pathname === item.path ? 3 : 0,
                  transition: 'all 0.2s',
                  mx: 0.5
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              onClick={handleSignOut}
              startIcon={<LogoutIcon />}
              color="secondary"
              variant="outlined"
              sx={{ borderRadius: 2, fontWeight: 700, ml: 2 }}
            >
              Sign Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}

export default NavBar; 