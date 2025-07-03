import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  useTheme,
  Typography,
  Box,
} from "@mui/material";
import { InputField } from "./inputField";
import RemarksChat from "./RemarksChat";
import { dialogStyle } from "./styles";
import { roleDisplayNames } from "./rolesDisplayNames";

const RemarksInputDialog = ({
  value = "",
  onChange,
  placeholder = "Click to view remarks...",
  label,
  error,
  name,
  remarks = [],
  onSendRemark,
  onEditRemark,
  currentUser,
  dialogTitle = "Remarks & Comments",
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (remarks.length > 0) {
      const latestRemark = remarks[remarks.length - 1];
      const latestText = latestRemark.content || latestRemark.message || latestRemark.text || "";
      const truncatedText =
        latestText.length > 50 ? `${latestText.substring(0, 25)}...` : latestText;

      setDisplayValue(truncatedText);
    } else {
      setDisplayValue("");
    }
  }, [remarks]);

  const handleSendRemark = async (remarkText) => {
    const role = currentUser?.role;
    const displayName = roleDisplayNames[role] || "Current User";

    const newRemark = {
      content: remarkText,
      author: displayName,
      timestamp: new Date().toISOString(),
    };

    const truncated = remarkText.length > 50 ? `${remarkText.substring(0, 25)}...` : remarkText;
    setDisplayValue(truncated);

    if (onChange) {
      onChange({
        target: {
          name,
          value: remarkText,
        },
      });
    }

    await onSendRemark(newRemark);

    setDialogOpen(false);
  };

  const handleEditRemark = async (remarkId, remarkText) => {
    const truncated = remarkText.length > 50 ? `${remarkText.substring(0, 25)}...` : remarkText;
    setDisplayValue(truncated);
    if (onChange) {
      onChange({
        target: {
          name,
          value: remarkText,
        },
      });
    }
    await onEditRemark(remarkId, remarkText);
    setDialogOpen(false);
  };

  const handleIconClick = () => {
    if (!disabled) {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <InputField
        placeholder={placeholder}
        value={displayValue}
        onChange={() => {}}
        error={error}
        name={name}
        readOnly
        disabled={disabled}
        endAdornment={
          <InputAdornment position="end">
            <Icon
              onClick={handleIconClick}
              disabled={disabled}
              sx={{
                color: theme.palette.custom.two,
                fontSize: "1.2rem",
                cursor: "pointer",
                "&:disabled": {
                  color: theme.palette.action.disabled,
                },
              }}
            />
          </InputAdornment>
        }
        onclickFunction={handleIconClick}
        {...props}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
        sx={dialogStyle}
      >
        <DialogTitle
          sx={{
            color: theme.palette.custom.two,
            fontSize: "0.9rem !important",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
            px: 2,
          }}
        >
          {dialogTitle}

          <Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.custom.text2,
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              Total Remarks{" "}
              {remarks.length > 0 && (
                <Box
                  component="span"
                  sx={{
                    backgroundColor: theme.palette.custom.one,
                    color: "white",
                    borderRadius: "12px",
                    px: 1,
                    py: 0.5,
                    fontSize: "0.75rem",
                    ml: 1,
                  }}
                >
                  {remarks.length}
                </Box>
              )}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <RemarksChat
            remarks={remarks}
            onSendRemark={handleSendRemark}
            currentUser={currentUser}
            placeholder="Type your remark here..."
            disabled={disabled}
            onEditRemark={handleEditRemark}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemarksInputDialog;
