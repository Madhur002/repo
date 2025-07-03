import { Delete, Edit } from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import MDTypography from "components/MDTypography";
import CustomTooltip from "layouts/resuableComponents/customTooltip";

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Format date time for display
export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Format status with color
export const formatStatus = (status) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return (theme)=> theme.palette.custom.approve;
      case "closed":
        return "primary";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };
  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return (theme)=> theme.palette.custom.approveText;
      case "closed":
        return "primary";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Chip
      label={status || "N/A"}
      size="small"
      sx={{
        backgroundColor: getStatusColor(status),
        fontSize: "0.7rem",
        height: "20px",
        color: getStatusTextColor(status),
        textTransform: "lowercase !important",
      }}
    />
  );
};

// Format text with truncation
export const formatText = (text, maxLength = 50) => {
  if (!text)
    return (
      <MDTypography
        variant="button"
        sx={{
          color: (theme) => theme.palette.custom.text2,
          fontSize: "0.7rem !important",
        }}
      >
        N/A
      </MDTypography>
    );
  const truncated =
    text.length > maxLength
      ? `${text.substring(0, maxLength).toLowerCase()}...`
      : text.toLowerCase();

  return (
    <Typography
      sx={{
        color: (theme) => theme.palette.custom.text2,
        fontSize: "0.7rem !important",
        cursor: text.length > maxLength ? "pointer" : "default",
        textTransform: "capitalize !important",
      }}
    >
      {truncated}
    </Typography>
  );
};

// Format actions column
export const formatActions = (item, onView, onEdit, onDelete, moduleType) => {
  return (
    <Box gap={1} display="flex">
      {/* {onView && (
        <CustomTooltip title={`View ${moduleType}`}>
          <IconButton
            size="small"
            sx={{ color: (theme) => theme.palette.custom.text2 }}
            onClick={() => onView(item)}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </CustomTooltip>
      )} */}
      {onEdit && (
        <CustomTooltip title={`Edit ${moduleType}`}>
          <IconButton
            size="small"
            sx={{ color: (theme) => theme.palette.custom.text2 }}
            onClick={() => onEdit(item)}
          >
            <Edit fontSize="small" />
          </IconButton>
        </CustomTooltip>
      )}
      {onDelete && (
        <CustomTooltip title={`Delete ${moduleType}`}>
          <IconButton
            size="small"
            sx={{ color: (theme) => theme.palette.custom.text2 }}
            onClick={() => onDelete(item)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </CustomTooltip>
      )}
    </Box>
  );
};

// Obligation specific table formatter
export const formatObligationTableData = (rawData, actions = {}) => {
  if (!Array.isArray(rawData)) {
    return { columns: [], rows: [] };
  }

  const columns = [
    { Header: "ID", accessor: "id", width: "5%", align: "left" },
    { Header: "Title", accessor: "title", width: "20%", align: "left" },
    { Header: "Regulator", accessor: "regulator", width: "17%", align: "left" },
    { Header: "Department", accessor: "department", width: "12%", align: "left" },
    { Header: "Status", accessor: "status", width: "8%", align: "center" },
    { Header: "Year", accessor: "year", width: "8%", align: "center" },
    // { Header: "Updated", accessor: "updatedAt", width: "10%", align: "center" },
    // { Header: "Actions", accessor: "actions", width: "10%", align: "center" },
  ];

  const rows = rawData.map((item) => ({
    id: formatText(item.id, 15),
    title: formatText(item.title, 40),
    regulator: formatText(item.regulator, 20),
    department: formatText(item.department?.replace(/_/g, " "), 20),
    status: formatStatus(item.finalStatus),
    year: formatText(item.year, 10),
    // updatedAt: formatText(formatDate(item.updatedAt), 15),
    // actions: formatActions(item, actions.onView, actions.onEdit, actions.onDelete, "obligation"),
  }));

  return { columns, rows };
};

// Generic table formatter that can be extended for other modules
export const formatGenericTableData = (rawData, moduleType, columnConfig, actions = {}) => {
  if (!Array.isArray(rawData)) {
    return { columns: [], rows: [] };
  }

  const columns = columnConfig.map((col) => ({
    Header: col.header,
    accessor: col.accessor,
    width: col.width || "auto",
    align: col.align || "left",
  }));

  // Add actions column if actions are provided
  if (Object.keys(actions).length > 0) {
    columns.push({
      Header: "Actions",
      accessor: "actions",
      width: "10%",
      align: "center",
    });
  }

  const rows = rawData.map((item) => {
    const row = {};

    columnConfig.forEach((col) => {
      const value = item[col.accessor];

      switch (col.type) {
        case "status":
          row[col.accessor] = formatStatus(value);
          break;
        case "date":
          row[col.accessor] = formatText(formatDate(value));
          break;
        case "datetime":
          row[col.accessor] = formatText(formatDateTime(value));
          break;
        case "text":
          row[col.accessor] = formatText(value, col.maxLength || 50);
          break;
        default:
          row[col.accessor] = formatText(value);
      }
    });

    // Add actions if provided
    if (Object.keys(actions).length > 0) {
      row.actions = formatActions(
        item,
        actions.onView,
        actions.onEdit,
        actions.onDelete,
        moduleType
      );
    }

    return row;
  });

  return { columns, rows };
};
