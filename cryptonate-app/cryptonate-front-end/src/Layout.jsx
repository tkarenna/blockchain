import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { privateRoutes, publicRoutes } from "./routes";
import { Drawer, Box, CssBaseline, Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

function Layout() {
  let location = useLocation();
  let [showSidebar, setShowsidebar] = useState(true);
  const noSidebarPages = ["/login", "/", "/choosecharity"];
  const navigate = useNavigate();
  const [authenticated, setAuthnticated] = useState(() =>
    sessionStorage.getItem("address") ? true : false
  );
  const [address, setAddress] = useState(() =>
    sessionStorage.getItem("address")
  );
  const [userType, setUserType] = useState("");

  useEffect(() => {
    console.log(location.pathname);
    if (noSidebarPages.includes(location.pathname)) {
      setShowsidebar(false);
    } else {
      setShowsidebar(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const addAddress = (address, role) => {
    setAddress(address);
    sessionStorage.setItem("address", address);
    setAuthnticated(true);
    setUserType(role);
    role === "donor" && navigate("/choosecharity");
  };

  const logout = () => {
    sessionStorage.setItem("address", "");
    setAddress("");
    setAuthnticated(false);
  };

  const drawer = (
    <div>
      <List>
        {privateRoutes
          .filter((route) => route.sideBar)
          .filter((route) => route?.userType?.includes(userType))
          .map((route, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => navigate(route.path)}>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {authenticated ? (
        <>
          {showSidebar && (
            <Drawer
              sx={{
                width: "200px",
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: "200px",
                  boxSizing: "border-box",
                },
              }}
              variant="permanent"
              anchor="left"
            >
              {drawer}
            </Drawer>
          )}
          <Box component="main" sx={{ p: 4 }}>
            <Button
              sx={{
                position: "absolute",
                top: "5px",
                right: "10px",
                zIndex: 5,
              }}
              onClick={() => logout()}
            >
              Logout
            </Button>
            <Routes>
              {privateRoutes.map((route) => (
                <Route path={route.path} element={<route.element />} />
              ))}
              <Route path="*" element={<Navigate to="/allpolls" />} />
            </Routes>
          </Box>
        </>
      ) : (
        <Box>
          <Routes>
            {publicRoutes.map((route) => (
              <Route
                path={route.path}
                element={<route.element addAddress={addAddress} />}
              />
            ))}
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </Box>
      )}
    </Box>
  );
}

export default Layout;
