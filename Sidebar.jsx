import {
  ChevronLeft,
  ChevronRight,
  DataThresholding,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationItems } from "routes";

// import { navigationItems } from "../../Routes.js/index.js";

const DRAWER_WIDTH = 220;
const DRAWER_COLLAPSED_WIDTH = 50;

const Sidebar = ({ open, onToggle, userRole }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState({});

  // Set initial open state for items based on current path
  useEffect(() => {
    const path = location.pathname;
    const newOpenItems = {};

    navigationItems.forEach((group) => {
      group.children?.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some(
            (child) => child.path === path || path.startsWith(child.path + "/")
          );
          if (isChildActive) {
            newOpenItems[item.id] = true;
          }
        }
      });
    });

    setOpenItems(newOpenItems);
  }, [location.pathname]);

  const handleItemClick = (item) => {
    if (item.children) {
      setOpenItems((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isItemVisible = (item) => {
    return !item.roles || item.roles.includes(userRole);
  };

  const isItemActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const renderNavItems = (items) => {
    return items.filter(isItemVisible).map((item) => {
      // Skip rendering if it's a group with no visible children
      if (item.type === "group") {
        const visibleChildren = item.children?.filter(isItemVisible) || [];
        if (visibleChildren.length === 0) return null;
      }

      if (item.type === "group") {
        return (
          <Box key={item.id} sx={{ mb: 1 }}>
            {open && (
              <Typography
                variant="caption"
                sx={{
                  px: 3,
                  mb: 1,
                  display: "block",
                  color: (theme) => theme.palette.custom.text2,
                  fontWeight: 600,
                  fontSize: "0.6rem",
                }}
              >
                {item.title}
              </Typography>
            )}
            {renderNavItems(item.children || [])}
          </Box>
        );
      }

      const isActive = isItemActive(item.path);
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openItems[item.id];

      return (
        <React.Fragment key={item.id}>
          <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleItemClick(item)}
              sx={{
                minHeight: 38,
                px: open ? 1.5 : 1.5,
                py: 1,
                borderRadius: "8px",
                mx: open ? 2 : 1,
                gap: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: open ? "initial" : "center",
                ...(isActive && {
                  bgcolor: (theme) => theme.palette.custom.one,
                  color: (theme) => theme.palette.custom.text2,
                  "& .MuiListItemIcon-root": {
                    color: (theme) => theme.palette.custom.text2,
                  },
                }),
              }}
            >
              {item.icon && (
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    fontSize: "medium",
                    justifyContent: "center",
                    color: isActive
                      ? (theme) => theme.palette.custom.text1
                      : (theme) => theme.palette.custom.text1,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              )}

              {open && (
                <>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      color: (theme) => theme.palette.custom.text2,
                      opacity: open ? 1 : 0,
                      "& .MuiTypography-root": {
                        fontWeight: isActive ? 600 : 600,
                        fontSize: "0.8rem",
                      },
                    }}
                  />

                  {hasChildren &&
                    (isOpen ? (
                      <ExpandLess sx={{ color: (theme) => theme.palette.custom.two }} />
                    ) : (
                      <ExpandMore sx={{ color: (theme) => theme.palette.custom.two }} />
                    ))}
                </>
              )}
            </ListItemButton>
          </ListItem>

          {hasChildren && open && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.filter(isItemVisible).map((child) => (
                  <ListItemButton
                    key={child.id}
                    onClick={() => navigate(child.path)}
                    sx={{
                      pl: 4,
                      py: 0.75,
                      minHeight: 38,
                      borderRadius: "8px",
                      mx: 2,
                      ...(isItemActive(child.path) && {
                        bgcolor: (theme) => theme.palette.custom.one,
                        color: (theme) => theme.palette.custom.two,
                      }),
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: (theme) => theme.palette.custom.text2,
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    ></Box>
                    <ListItemText
                      sx={{ color: (theme) => theme.palette.custom.text2 }}
                      primary={child.title}
                      primaryTypographyProps={{
                        fontSize: "0.7rem",
                        fontWeight: isItemActive(child.path) ? 500 : 400,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          mt: 1,
          ml: 1,
          mb: 0,
          height: "calc(100vh - 16px)",
          width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          backgroundColor: theme.palette.custom.light,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pt: 1,
          px: 1,
          justifyContent: open ? "space-between" : "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {open && (
            <>
              <Box
                // src="/logo.svg"
                // alt="Logo"
                // variant="rounded"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  color: "white",
                  fontSize: "1.2rem",
                  ml: 2
                }}
              >
                <DataThresholding sx={{ color: (theme) => theme.palette.custom.two }} />
              </Box>

              <Typography
                variant="subtitle2"
                sx={{
                  ml: 1,
                  fontWeight: 600,
                  color: (theme) => theme.palette.custom.two,
                  flexGrow: 1,
                }}
              >
                DMI Finance
              </Typography>
            </>
          )}
        </Box>

        <IconButton
          onClick={onToggle}
          sx={{
            display: open ? "flex" : "flex",
            color: (theme) => theme.palette.custom.two,
          }}
        >
          {open ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "&:hover ": {
                  bgcolor: (theme) => theme.palette.custom.zero,
                },
                borderRadius: "50%",
                p: 0.4,
              }}
            >
              <ChevronLeft />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: (theme) => theme.palette.custom.zero,
                borderRadius: "50%",
                p: 0.4,
              }}
            >
              <ChevronRight />
            </Box>
          )}
        </IconButton>
      </Box>
      <Box sx={{ px: 2 }}>
        <Divider sx={{ bgcolor: (theme) => theme.palette.custom.two }} />
      </Box>

      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          width: "100%",
          "&::-webkit-scrollbar": { display: "none" },
          "msOverflowStyle": "none",
          "scrollbarWidth": "none",
          display: "flex",
          justifyContent: open ? "start" : "center",
          alignItems: "start",
        }}
      >
        <List sx={{ width: "100%" }}>{renderNavItems(navigationItems)}</List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
