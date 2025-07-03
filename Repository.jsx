import React, { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  Chip,
  Stack,
} from "@mui/material";
import {
  Search,
  ArrowBack,
  Assignment,
  Message,
  VerifiedUser,
  History,
  AccountBalance,
  ReportProblem,
  Visibility,
  Assessment,
  ChevronRight,
  HorizontalSplit,
  Mail,
  CardMembershipRounded,
  SpellcheckOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { roleDisplayNames } from "layouts/resuableComponents/rolesDisplayNames";
import {
  topBarStyle,
  topBarSearchStyle2,
  iconButtonStyle,
} from "layouts/resuableComponents/styles";
import EmptyStateBox from "layouts/resuableComponents/emptyStateBox";
import { BsTable } from "react-icons/bs";
import ModuleRepository from "./ModuleRepository";

const Repository = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.user.user);
  const userRole = user?.role || "COMPLIANCE_MAKER";
  const displayName = roleDisplayNames[userRole] || "Current User";

  const [selectedModule, setSelectedModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModuleRepository, setShowModuleRepository] = useState(false);

  // Module definitions
  const modules = useMemo(
    () => [
      {
        id: "obligation",
        title: "Obligation",
        description: "Manage and track compliance obligations",
        icon: <HorizontalSplit />,
        category: "Obligation",
        color: theme.palette.custom.text1,
      },
      {
        id: "self-certificate",
        title: "Self Certificate",
        description: "Track and manage self-certification processes",
        icon: <CardMembershipRounded />,
        category: "Self-Certification",
        color: theme.palette.custom.text1,
      },
      {
        id: "iba",
        title: "IBA",
        description: "Track Internal Business Analytics",
        icon: <AccountBalance />,
        category: "Analytics",
        color: theme.palette.custom.text1,
        children: [
          {
            id: "indents",
            title: "Indents",
            description: "Manage indentation requests and approvals",
            icon: <Assessment />,
            category: "IBA Module",
            color: theme.palette.custom.text1,
          },
          {
            id: "incidents",
            title: "Incidents",
            description: "Handle incident reporting and management",
            icon: <ReportProblem />,
            category: "IBA Module",
            color: theme.palette.custom.text1,
          },
          {
            id: "ise-observation",
            title: "ISE Observation",
            description: "Internal system evaluation and observations",
            icon: <Visibility />,
            category: "IBA Module",
            color: theme.palette.custom.text1,
          },
        ],
      },
    ],
    [theme]
  );

  // Get all modules including sub-modules for finding by ID
  const allModules = useMemo(() => {
    const flatModules = [...modules];
    modules.forEach((module) => {
      if (module.children) {
        flatModules.push(...module.children);
      }
    });
    return flatModules;
  }, [modules]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return modules;

    return modules.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [modules, searchTerm]);

  const handleCardClick = (moduleId) => {
    console.log("Clicked module ID:", moduleId);
    // Find the module in all modules (including sub-modules)
    const clickedModule = allModules.find((m) => m.id === moduleId);

    if (clickedModule) {
      // Navigate directly to module repository page
      setSelectedModule(clickedModule);
      setShowModuleRepository(true);
    }
  };

  const handleChipClick = (event, moduleId) => {
    // Prevent event bubbling to parent card
    event.stopPropagation();
    handleCardClick(moduleId);
  };

  const handleBack = () => {
    setShowModuleRepository(false);
    setSelectedModule(null);
    setSearchTerm("");
  };

  const getCurrentModuleName = () => {
    if (!selectedModule) return "Repository";
    return selectedModule?.title || "Repository";
  };

  // If showing module repository, render that component
  if (showModuleRepository && selectedModule) {
    return (
      <ModuleRepository
        moduleId={selectedModule.id}
        moduleName={selectedModule.title}
        moduleIcon={selectedModule.icon}
        moduleColor={selectedModule.color}
        onBack={handleBack}
      />
    );
  }

  const renderRegularCard = (item) => {
    return (
      <Card
        key={item.id}
        elevation={0}
        onClick={() => !item.children && handleCardClick(item.id)}
        sx={{
          width: "250px",
          height: "160px",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          cursor: "pointer",
          position: "relative",
          transition: "all 0.2s ease-in-out",
          backgroundColor: theme.palette.custom.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0px 0px 15px rgba(166, 166, 166, 0.5)",
            borderColor: theme.palette.custom.one,
            "& .card-icon": {
              color: item.color || theme.palette.custom.two,
            },
          },
        }}
      >
        <CardContent sx={{ p: 1.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            {item.icon && (
              <Box
                className="card-icon"
                sx={{
                  mr: 1.5,
                  color: item.color || theme.palette.custom.text1,
                  transition: "color 0.2s ease",
                  display: "flex",
                  p: 1,
                  borderRadius: 2,
                }}
              >
                {React.cloneElement(item.icon, { fontSize: "medium" })}
              </Box>
            )}
            <Typography
              variant="h6"
              component="h3"
              fontWeight="600"
              sx={{
                color: theme.palette.custom.text1,
                fontSize: "0.95rem",
              }}
            >
              {item.title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.custom.text2,
              fontSize: "0.8rem",
              flexGrow: 1,
              lineHeight: 1.4,
              mb: 1.5,
            }}
          >
            {item.description}
          </Typography>

          {/* Sub-modules for IBA */}
          {item.children ? (
            <Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {item.children.map((child) => (
                  <Chip
                    key={child.id}
                    label={child.title}
                    size="small"
                    icon={<ChevronRight fontSize="small" />}
                    onClick={(event) => handleChipClick(event, child.id)}
                    sx={{
                      alignSelf: "flex-start",
                      color: theme.palette.custom.text2,
                      fontSize: "0.65rem",
                      height: "22px",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      backgroundColor: theme.palette.custom.background1,
                      "&:hover": {
                        backgroundColor: theme.palette.custom.dark,
                        color: theme.palette.custom.white,
                        transform: "scale(1.05)",
                        "& .MuiChip-icon": {
                          color: theme.palette.custom.white,
                        },
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          ) : (
            <Chip
              label={item.category}
              size="small"
              icon={<ChevronRight fontSize="small" />}
              sx={{
                alignSelf: "flex-start",
                backgroundColor: theme.palette.custom.background1,
                color: theme.palette.custom.text2,
                fontSize: "0.65rem",
                height: "22px",
              }}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "relative",
      }}
    >
      {/* Top Bar */}
        <Box sx={topBarStyle}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {showModuleRepository && (
              <IconButton
                onClick={handleBack}
                size="small"
                sx={{
                  color: theme.palette.custom.text2,
                  "&:hover": {
                    backgroundColor: theme.palette.custom.background1,
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
            )}
            <Typography
              variant="caption"
              sx={{ color: theme.palette.custom.text2, ml: 1, textTransform: "capitalize" }}
            >
              <strong>{getCurrentModuleName()} Modules</strong> - <span style={{textTransform: "none"}}>Select a module to view details</span>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <TextField
              fullWidth
              placeholder="Search modules..."
              variant="outlined"
              sx={topBarSearchStyle2}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="medium" sx={iconButtonStyle} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "calc(100vh - 140px)",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {filteredData.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              padding: 2,
              alignItems: "flex-start",
              alignContent: "flex-start",
            }}
          >
            {filteredData.map((item) => renderRegularCard(item))}
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px dashed",
              borderColor: theme.palette.custom.text3,
              padding: 5,
              justifyContent: "center",
              borderRadius: 3,
              color: theme.palette.custom.text3,
              textAlign: "center",
              px: 2,
              margin: 2,
            }}
          >
            <EmptyStateBox
              icon={BsTable}
              title={searchTerm ? "No modules found" : "No modules available"}
              description={
                searchTerm
                  ? `No modules match your search criteria "${searchTerm}"`
                  : "Repository modules will appear here"
              }
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Repository;
