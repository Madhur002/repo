export const animatedButtonStyle = {
  display: "flex",
  alignItems: "center",
  py: 1,
  fontSize: ".7rem",
  borderRadius: 0,
  whiteSpace: "nowrap",
  textTransform: "capitalize !important",
  position: "relative",
  overflow: "hidden",
  color: (theme) => theme.palette.custom.text1,
  fontWeight: 600,
  "&:hover": {
    color: (theme) => theme.palette.custom.two,
    textDecoration: "none", // Remove default underline
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "2px",
    backgroundColor: (theme) => theme.palette.custom.two,
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.3s ease-out",
  },
  "&:disabled": { color: (theme) => theme.palette.custom.text3 },
  "&:hover::after": {
    transform: "scaleX(1)",
  },
};

export const topBarStyle = {
  display: "flex",
  backgroundColor: (theme) => theme.palette.custom.background1,
  width: "100%",
  height: "35px",
  borderRadius: 2,
  justifyContent: "space-between",
  alignItems: "center",
  overflow: "hidden",
  px: 2,
};

export const topBarSearchStyle = {
  "& .MuiOutlinedInput-root": {
    p: 0,
    backgroundColor: "transparent",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      border: "none",
      borderColor: "transparent",
    },
    "& .MuiInputBase-input::placeholder": {
      color: (theme) => theme.palette.custom.text2,
      fontSize: "0.7rem !important",
    },

    "& .MuiInputBase-input": {
      color: (theme) => theme.palette.custom.text2,
      fontSize: "0.7rem !important",
    },
  },
};

export const dialogCancelButtonStyle = {
  color: (theme) => theme.palette.custom.two,
  fontSize: "0.7rem !important",
  transition: "all 0.3s ease",
  "&:hover": {
    bgcolor: (theme) => theme.palette.custom.two,
    color: (theme) => theme.palette.custom.light,
  },
  px: 3,
  py: 1,
  borderRadius: 10,
  width: "80px",
};

export const dialogButtonStyle = {
  bgcolor: (theme) => theme.palette.custom.one,
  color: (theme) => theme.palette.custom.two,
  fontSize: "0.7rem !important",
  transition: "all 0.3s ease",
  "&:hover": {
    bgcolor: (theme) => theme.palette.custom.two,
    color: (theme) => theme.palette.custom.light,
  },
  px: 3,
  py: 1,
  borderRadius: 10,
  width: "80px",
  "&.Mui-disabled": {
    color: (theme) => theme.palette.custom.two,
  },
};

export const dialogStyle = {
  "& .MuiDialog-paper": {
    borderRadius: 3,
    bgcolor: (theme) => theme.palette.custom.light,
    border: 2,
    borderColor: (theme) => theme.palette.custom.zeroBlur,
    boxShadow: 24,
    p: 0,
  },
};

export const iconButtonStyle = {
  color: (theme) => theme.palette.custom.text2,
  fontSize: "1rem !important",
  "&.Mui-disabled": {
    color: (theme) => theme.palette.custom.background1,
  },
};

export const textfieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "& fieldset": {
      borderColor: (theme) => theme.palette.custom.one,
    },
    "&:hover fieldset": {
      borderColor: (theme) => theme.palette.custom.one,
    },
    "&.Mui-focused fieldset": {
      borderColor: (theme) => theme.palette.custom.one,
    },
  },
  "& .MuiInputBase-input": {
    color: (theme) => theme.palette.custom.text2,
    fontSize: "0.7rem",
  },
};

export const topBarSearchStyle2 = {
  "& .MuiOutlinedInput-root": {
    px: 1,
    borderRadius: 2,
    border: "none",
    backgroundColor: (theme) => theme.palette.custom.paper,
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      border: "none",
      borderColor: "transparent",
    },
    "& .MuiInputBase-input::placeholder": {
      color: (theme) => theme.palette.custom.text2,
      fontSize: "0.7rem !important",
    },

    "& .MuiInputBase-input": {
      color: (theme) => theme.palette.custom.text2,
      fontSize: "0.7rem !important",
      p: 0.5,
    },
  },
};

export const dialogButtonStyleTwo = {
  color: (theme) => theme.palette.custom.two,
  fontSize: "0.7rem !important",
  transition: "all 0.3s ease",
  "&:hover": {
    bgcolor: (theme) => theme.palette.custom.two,
    color: (theme) => theme.palette.custom.light,
  },
  px: 3,
  py: 1,
  borderRadius: 10,
  minWidth: "80px",
  maxWidth: "200px",
};

export const buttonStyleThree = {
  ...dialogButtonStyle,
  width: "110px",
  px: 0,
  backgroundColor: (theme) => theme.palette.custom.dark,
  color: (theme) => theme.palette.custom.white,
  textTransform: "none",
  "&:hover": {
    backgroundColor: (theme) => theme.palette.custom.dark,
    color: (theme) => theme.palette.custom.white,
    opacity: 0.8,
    transform: "scale(1.02)",
  },
};
