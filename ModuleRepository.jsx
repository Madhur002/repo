import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowBackIos,
  CalendarToday,
  FilterAlt,
  Search,
  FileDownload,
  ClearAll,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import EmptyStateBox from "layouts/resuableComponents/emptyStateBox";
import { InputField } from "layouts/resuableComponents/inputField";
import { departmentList } from "layouts/resuableComponents/metadata";
import { roleDisplayNames } from "layouts/resuableComponents/rolesDisplayNames";
import { SelectDropdown } from "layouts/resuableComponents/selectDropdown";
import { animatedButtonStyle } from "layouts/resuableComponents/styles";
import {
  iconButtonStyle,
  topBarSearchStyle2,
  topBarStyle,
} from "layouts/resuableComponents/styles";
import { useSelector } from "react-redux";
import { BsTable } from "react-icons/bs";
import DataTable from "examples/Tables/DataTable";
import PaginationFooter from "layouts/resuableComponents/PaginationFooter";
import { createModuleService } from "./moduleServiceFactory";
import { formatObligationTableData, formatGenericTableData } from "./tableFormatters";
import { dialogButtonStyle } from "layouts/resuableComponents/styles";

const ModuleRepository = ({ moduleId, moduleName, onBack, moduleIcon, moduleColor }) => {
  const theme = useTheme();
  const user = useSelector((state) => state.user.user);
  const userRole = user?.role || "COMPLIANCE_MAKER";
  const displayName = roleDisplayNames[userRole] || "Current User";

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Create module service
  const moduleService = useMemo(() => createModuleService(moduleId), [moduleId]);

  // Define filter configurations for each module
  const moduleFilterConfigs = useMemo(
    () => ({
      obligation: {
        status: {
          type: "dropdown",
          label: "Status",
          width: 1.4,
          options: [
            { label: "open", value: "open" },
            { label: "closed", value: "closed" },
          ],
        },
        regulator: {
          type: "input",
          label: "Regulator",
          placeholder: "Regulator name",
          width: 1.6,
        },
        department: {
          type: "dropdown",
          label: "Department",
          width: 1.8,
          options: departmentList,
        },
        year: {
          type: "input",
          label: "Year",
          placeholder: "Year",
          width: 1.3,
        },
        compliance: {
          type: "dropdown",
          label: "Compliance",
          width: 1.8,
          options: [
            { label: "FULLY", value: "FULLY" },
            { label: "PARTIALLY", value: "PARTIALLY" },
            { label: "NOT_COMPLIED", value: "NOT_COMPLIED" },
            { label: "NOT_APPLICABLE", value: "NOT_APPLICABLE" },
          ],
        },
        startDate: {
          type: "date",
          label: "Start Date",
          width: 1.7,
        },
        endDate: {
          type: "date",
          label: "End Date",
          width: 1.7,
        },
      },
      indents: {
        status: {
          type: "dropdown",
          label: "Status",
          options: [
            { label: "Pending", value: "PENDING" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Completed", value: "COMPLETED" },
          ],
        },
        priority: {
          type: "dropdown",
          label: "Priority",
          options: [
            { label: "High", value: "HIGH" },
            { label: "Medium", value: "MEDIUM" },
            { label: "Low", value: "LOW" },
          ],
        },
        department: {
          type: "dropdown",
          label: "Department",
          options: departmentList,
        },
        category: {
          type: "dropdown",
          label: "Category",
          options: [
            { label: "Data Request", value: "DATA_REQUEST" },
            { label: "Compliance Query", value: "COMPLIANCE_QUERY" },
            { label: "Audit Finding", value: "AUDIT_FINDING" },
            { label: "Operational Issue", value: "OPERATIONAL_ISSUE" },
            { label: "Other", value: "OTHER" },
          ],
        },
        startDate: {
          type: "date",
          label: "Start Date",
        },
        endDate: {
          type: "date",
          label: "End Date",
        },
      },
      incidents: {
        status: {
          type: "dropdown",
          label: "Status",
          options: [
            { label: "Reported", value: "REPORTED" },
            { label: "Under Review", value: "UNDER_REVIEW" },
            { label: "Resolved", value: "RESOLVED" },
          ],
        },
        severity: {
          type: "dropdown",
          label: "Severity",
          options: [
            { label: "High", value: "HIGH" },
            { label: "Medium", value: "MEDIUM" },
            { label: "Low", value: "LOW" },
          ],
        },
        department: {
          type: "dropdown",
          label: "Department",
          options: departmentList,
        },
        type: {
          type: "dropdown",
          label: "Type",
          options: [
            { label: "Show Cause", value: "SHOW_CAUSE" },
            { label: "Penalty", value: "PENALTY" },
            { label: "Advisory", value: "ADVISORY" },
            { label: "Current Chest Issue", value: "CURRENT_CHEST_ISSUE" },
            { label: "Other", value: "OTHER" },
          ],
        },
        startDate: {
          type: "date",
          label: "Start Date",
        },
        endDate: {
          type: "date",
          label: "End Date",
        },
      },
      "ise-observation": {
        status: {
          type: "dropdown",
          label: "Status",
          options: [
            { label: "Pending", value: "PENDING" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Completed", value: "COMPLETED" },
          ],
        },
        priority: {
          type: "dropdown",
          label: "Priority",
          options: [
            { label: "High", value: "HIGH" },
            { label: "Medium", value: "MEDIUM" },
            { label: "Low", value: "LOW" },
          ],
        },
        department: {
          type: "dropdown",
          label: "Department",
          options: departmentList,
        },
        theme: {
          type: "dropdown",
          label: "Theme",
          options: [
            { label: "Regulatory", value: "REGULATORY" },
            { label: "Operational", value: "OPERATIONAL" },
            { label: "Financial", value: "FINANCIAL" },
            { label: "Risk Management", value: "RISK_MANAGEMENT" },
            { label: "Other", value: "OTHER" },
          ],
        },
        startDate: {
          type: "date",
          label: "Start Date",
        },
        endDate: {
          type: "date",
          label: "End Date",
        },
      },
      "self-certificate": {
        status: {
          type: "dropdown",
          label: "Status",
          options: [
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
          ],
        },
        department: {
          type: "dropdown",
          label: "Department",
          options: departmentList,
        },
        cycle: {
          type: "dropdown",
          label: "Cycle",
          options: [
            { label: "Quarter", value: "QUARTER" },
            { label: "Half Year", value: "HALF_YEAR" },
            { label: "Year", value: "YEAR" },
          ],
        },
        startDate: {
          type: "date",
          label: "Start Date",
        },
        endDate: {
          type: "date",
          label: "End Date",
        },
      },
    }),
    []
  );

  // Get current module's filter configuration
  const currentFilterConfig = moduleFilterConfigs[moduleId] || {};

  // Fetch data function
  const fetchData = async (page = 1, limit = 10, filterParams = {}, searchQuery = "") => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit,
        ...filterParams,
        ...(searchQuery && { search: searchQuery }),
      };

      const response = await moduleService.getRepository(params);

      if (response.success) {
        setData(response.data || []);
        setPagination({
          page: response.pagination?.page || page,
          limit: response.pagination?.pageSize || limit,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        });
      } else {
        throw new Error(response.message || "Failed to Load data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to Load data");
      toast.error(error.message || "Failed to Load data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [moduleId]);

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    fetchData(1, pagination.limit, filters, searchTerm);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({});
    setAppliedFilters({});
    setSearchTerm("");
    fetchData(1, pagination.limit, {}, "");
  };

  // Handle search
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  // Apply search
  const handleApplySearch = () => {
    fetchData(1, pagination.limit, appliedFilters, searchTerm);
  };

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    fetchData(newPage, pagination.limit, appliedFilters, searchTerm);
  };

  const handleRowsPerPageChange = (event) => {
    const newLimit = event.numericValue;
    fetchData(1, newLimit, appliedFilters, searchTerm);
  };

  // Handle export
  const handleExport = async () => {
    setExporting(true);
    try {
      await moduleService.exportToExcel({ ...appliedFilters, search: searchTerm });
      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error(error.message || "Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  // Render filter field
  const renderFilterField = (filterKey, config) => {
    const value = filters[filterKey] || "";

    const commonStyles = {
      width: "100%",
      height: "32px",
      "& .MuiInputBase-root": {
        height: "32px",
      },
      "& .MuiOutlinedInput-input": {
        padding: "8px 12px",
      },
    };

    const labelStyle = {
      display: "block",
      fontSize: "0.7rem",
      fontWeight: 500,
      color: theme.palette.custom.text3,
      marginBottom: "4px",
    };

    switch (config.type) {
      case "dropdown":
        return (
          <Box sx={{ width: "100%" }}>
            <Typography sx={labelStyle}>{config.label}</Typography>
            <SelectDropdown
              placeholder={`${config.label}`}
              options={config.options}
              value={value}
              onChange={(e) => handleFilterChange(filterKey, e.target.value)}
              sx={commonStyles}
              backgroundColor={theme.palette.custom.paper}
              hideSearch={config.label === "Department" ? false : true}
            />
          </Box>
        );

      case "input":
        return (
          <Box sx={{ width: "100%" }}>
            <Typography sx={labelStyle}>{config.label}</Typography>
            <InputField
              placeholder={config.placeholder}
              value={value}
              onChange={(e) => handleFilterChange(filterKey, e.target.value)}
              name={filterKey}
              sx={commonStyles}
              backgroundColor={theme.palette.custom.paper}
            />
          </Box>
        );

      case "date":
        return (
          <Box sx={{ width: "100%" }}>
            <Typography sx={labelStyle}>{config.label}</Typography>
            <InputField
              placeholder="Select date"
              value={value}
              onChange={(e) => handleFilterChange(filterKey, e.target.value)}
              name={filterKey}
              type="date"
              sx={commonStyles}
              endAdornment={
                <InputAdornment position="end">
                  <CalendarToday sx={{ color: theme.palette.custom.two, fontSize: "1rem" }} />
                </InputAdornment>
              }
              backgroundColor={theme.palette.custom.paper}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  // Format table data based on module type
  const formatTableData = (rawData) => {
    if (moduleId === "obligation") {
      return formatObligationTableData(rawData, {
        onView: (item) => console.log("View:", item),
        onEdit: (item) => console.log("Edit:", item),
        onDelete: (item) => console.log("Delete:", item),
      });
    }

    // For other modules, use generic formatter (will be implemented by other developers)
    return { columns: [], rows: [] };
  };

  const tableData = useMemo(() => formatTableData(data), [data, moduleId]);

  // Check if filters are applied
  const hasFilters = Object.keys(appliedFilters).some((key) => appliedFilters[key]);
  const hasSearch = searchTerm.trim() !== "";

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        position: "relative",
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box sx={{ ...topBarStyle, gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                color: theme.palette.custom.text2,
                "&:hover": {
                  backgroundColor: theme.palette.custom.background1,
                },
              }}
            >
              <ArrowBackIos sx={{ fontSize: "0.9rem !important" }} />
            </IconButton>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.custom.text2,
                textTransform: "capitalize",
                textWrap: "nowrap",
              }}
            >
              <strong>{moduleName}</strong> Repository
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
            <TextField
              fullWidth
              placeholder={`Search ${moduleName.toLowerCase()}...`}
              variant="outlined"
              sx={topBarSearchStyle2}
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleApplySearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="medium" sx={iconButtonStyle} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleApplySearch}
                      sx={{ color: theme.palette.custom.two }}
                    >
                      <Search fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* Filter Action Buttons */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {(filters || appliedFilters || searchTerm) && (
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  disabled={loading}
                  sx={animatedButtonStyle}
                  startIcon={<ClearAll fontSize="small" />}
                >
                  Clear All
                </Button>
              )}
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.custom.text1,
                  opacity: 0.5,
                }}
              >
                |
              </Typography>
              <Button
                size="small"
                onClick={handleExport}
                disabled={exporting || loading}
                sx={animatedButtonStyle}
                startIcon={
                  exporting ? <CircularProgress size={16} /> : <FileDownload fontSize="small" />
                }
              >
                {exporting ? "Exporting..." : "Export"}
              </Button>
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.custom.text1,
                  opacity: 0.5,
                }}
              >
                |
              </Typography>
              <Button
                size="small"
                onClick={handleApplyFilters}
                disabled={loading}
                sx={animatedButtonStyle}
                startIcon={<FilterAlt fontSize="small" />}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Filter Bar */}
      {Object.keys(currentFilterConfig).length > 0 && (
        <Box
          sx={{
            ...topBarStyle,
            px: 2,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            height: "auto",
            minHeight: "70px",
            pb: 2,
            py: 2,
          }}
        >
          <Grid container spacing={1} rowSpacing={3} alignItems="center">
            {Object.entries(currentFilterConfig).map(([filterKey, config]) => (
              <Grid item xs={12} sm={6} md={4} lg={config.width || 2} key={filterKey}>
                <Box sx={{ height: "40px", display: "flex", alignItems: "center" }}>
                  {renderFilterField(filterKey, config)}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        <Box
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loading ? (
            <Box sx={{ p: 2 }}>
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  animation="wave"
                  height={50}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: theme.palette.custom.background1,
                  }}
                />
              ))}
            </Box>
          ) : error ? (
            <EmptyStateBox
              icon={BsTable}
              title="Error Loading Data"
              description={error}
              action={
                <Button
                  onClick={() =>
                    fetchData(pagination.page, pagination.limit, appliedFilters, searchTerm)
                  }
                  sx={animatedButtonStyle}
                  size="small"
                >
                  Retry
                </Button>
              }
            />
          ) : tableData?.rows?.length > 0 ? (
            <Box
              sx={{
                flexGrow: 1,
                overflow: "auto",
                pb: 8,
                display: "flex",
                height: "calc(100vh - 200px)",
                overflow: "auto",
                p: 0,
              }}
            >
              <DataTable
                table={tableData}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            </Box>
          ) : (
            <EmptyStateBox
              icon={BsTable}
              title={
                hasFilters || hasSearch ? "No items found" : `No ${moduleName.toLowerCase()} items`
              }
              description={
                hasFilters || hasSearch
                  ? "No items match your current filters"
                  : `${moduleName} items will appear here when available`
              }
            />
          )}
        </Box>

        {/* Pagination Footer */}
        {!loading && !error && tableData?.rows?.length > 0 && (
          <PaginationFooter
            currentPage={pagination.page}
            rowsPerPage={pagination.limit}
            totalPages={pagination.totalPages}
            totalRecords={pagination.total}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            loading={loading}
            disabled={loading}
          />
        )}
      </Box>
    </Box>
  );
};

export default ModuleRepository;
