// Custom text field component

// @mui material components
import InputBase from "@mui/material/InputBase";
import React, { useRef, useState } from "react";
import { Box, Button, Typography, FormHelperText } from "@mui/material";
import { AttachFile, UploadFile } from "@mui/icons-material";

const getMinDateTime = () => {
  const now = new Date();
  now.setDate(now.getDate());
  return now.toISOString().slice(0, 16); // format: yyyy-MM-ddTHH:mm
};

const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10); // format: yyyy-MM-dd
};

export const InputField = ({
  placeholder,
  value,
  onChange,
  name,
  type = "text",
  endAdornment,
  disabled,
  accept,
  error,
  sx, // Add sx prop to accept external styles
  backgroundColor = "transparent",
  disablePastDates = false,
  onclickFunction = () => {}
}) => {
  const inputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  // For date inputs, create a function to open the native datepicker
  const openDatePicker = () => {
    if (type === "date" && inputRef.current) {
      inputRef.current.showPicker && inputRef.current.showPicker();
    }
  };

  // For file inputs, handle the custom button click
  const handleFileButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Handle file selection and display filename
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }

    // Call the original onChange handler
    if (onChange) {
      onChange(e);
    }
  };

  // Get input props based on type and restrictions
  const getInputProps = () => {
    if (type === "datetime-local") {
      return { min: getMinDateTime() };
    }
    if (type === "date" && disablePastDates) {
      return { min: getCurrentDate() };
    }
    return {};
  };

  // If it's a file input, render our custom UI
  if (type === "file") {
    return (
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
            border: "1px solid",
            height: "32px", // Fixed height to match SelectDropdown
            borderColor: error ? "#ff0000" : (theme) => theme.palette.custom.one,
            ...sx, // Apply external styles
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            style={{ display: "none" }}
          />

          <Button
            onClick={handleFileButtonClick}
            endIcon={<AttachFile sx={{ color: (theme) => theme.palette.custom.two }} />}
            disabled={disabled}
            size="small"
            sx={{
              bgcolor: "transparent",
              color: disabled ? "#636363" : (theme) => theme.palette.custom.text2,
              fontWeight: 400,
              display: "flex",
              width: "100%",
              alignItems: "center",
              textAlign: "center",
              py: 1,
              fontSize: "0.7rem",
              height: "100%", // Full height of container
              "&:hover": {
                textDecoration: "underline",
                color: (theme) => theme.palette.custom.two,
              },
              "&.Mui-disabled": {
                color: "#636363",
              },
              whiteSpace: "nowrap",
              textTransform: "capitalize !important",
            }}
          >
            Attach File
          </Button>
        </Box>
        {error && (
          <FormHelperText error sx={{ ml: 1.5, mt: 0.5 }}>
            {error}
          </FormHelperText>
        )}
      </Box>
    );
  }

  // For all other input types, use the original InputBase
  return (
    <Box sx={{ width: "100%" }}>
      <InputBase
        fullWidth
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputProps={getInputProps()}
        disabled={disabled}
        accept={accept}
        inputRef={inputRef}
        onClick={onclickFunction}
        // For date fields, configure custom endAdornment that opens the picker
        endAdornment={
          disabled
            ? null
            : type === "date"
            ? React.cloneElement(endAdornment, {
                onClick: openDatePicker,
                style: { cursor: "pointer" },
              })
            : endAdornment
        }
        sx={{
          py: 0.5,
          px: 1.5,
          borderRadius: 2,
          border: "1px solid",
          backgroundColor: disabled ? (theme) => theme.palette.custom.background1 : backgroundColor,
          borderColor: error ? "#ff0000" : (theme) => theme.palette.custom.background1,
          fontSize: "0.7rem",
          cursor: "pointer",
          height: "32px", // Fixed height to match SelectDropdown
          "& .MuiInputBase-input": {
            cursor: "pointer",
            padding: 0,
            color: (theme) => theme.palette.custom.text2,
            height: "100%", // Full height
            display: "flex",
            alignItems: "center",
          },
          "& .Mui-disabled": {
            color: "#636363",
            cursor: disabled ? "not-allowed" : "pointer",
            WebkitTextFillColor: "#636363", // for Safari
          },
          "&::placeholder": {
            color: (theme) => theme.palette.custom.text2,
          },
          "& .MuiInputAdornment-root": {
            color: (theme) => theme.palette.custom.text2,
            height: "100%",
            display: "flex",
            alignItems: "center",
          },
          color: (theme) => theme.palette.custom.text2,
          // Date input specific styling
          "& input[type='date']": {
            color: (theme) => theme.palette.custom.text2,
            opacity: 0.7,
            "&::-webkit-datetime-edit": {
              color: (theme) => theme.palette.custom.text2,
            },
            "&::-webkit-datetime-edit-fields-wrapper": {
              color: (theme) => theme.palette.custom.text2,
            },
            "&::-webkit-datetime-edit-text": {
              color: (theme) => theme.palette.custom.text2,
            },
            "&::-webkit-datetime-edit-month-field": {
              color: (theme) => theme.palette.custom.text2,
            },
            "&::-webkit-datetime-edit-day-field": {
              color: (theme) => theme.palette.custom.text2,
            },
            "&::-webkit-datetime-edit-year-field": {
              color: (theme) => theme.palette.custom.text2,
            },
            "&::-webkit-calendar-picker-indicator": {
              display: "none",
              opacity: 0,
            },
            "&::-webkit-inner-spin-button": {
              display: "none",
              opacity: 0,
            },
          },
          "& input[type='date']::placeholder": {
            color: (theme) => theme.palette.custom.text2,
            opacity: 0.7,
          },
          // For Firefox
          "& input[type='date']::-moz-placeholder": {
            color: (theme) => theme.palette.custom.text2,
            opacity: 0.7,
          },
          display: "flex",
          alignItems: "center",
          ...sx, // Apply external styles
        }}
      />
      {error && (
        <FormHelperText error sx={{ ml: 1.5, mt: 0.5, fontSize: "0.6rem" }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
};
