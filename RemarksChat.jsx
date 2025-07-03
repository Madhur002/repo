import { Comment, Done, Edit, Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const RemarksChat = ({
  remarks = [],
  onSendRemark,
  currentUser,
  placeholder = "Add your remarks...",
  disabled = false,
  onEditRemark,
}) => {
  const user = useSelector((state) => state.user.user);
  const [newRemark, setNewRemark] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [editRemark, setEditRemark] = useState(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const allowEditRemark = ({ remark, index, remarks }) => {
    const isLastRemark = index === remarks.length - 1;
    const isMyRemark = remark.role === user.role;

    // const isWithMe = currStep === getStepForRole(user.role);

    return isMyRemark && isLastRemark;
  };

  useEffect(() => {
    if (editMode && editRemark) {
      setNewRemark(editRemark.content);
    }
  }, [editMode, editRemark]);
  useEffect(() => {
    scrollToBottom();
  }, [remarks]);

  const handleSendRemark = async () => {
    if (!newRemark.trim() || isLoading) return;

    setIsLoading(true);
    try {
      if (editMode && editRemark) {
        await onEditRemark(editRemark.id, newRemark.trim());
        setEditMode(false);
        setEditRemark(null);
      } else {
        await onSendRemark(newRemark.trim());
      }
      setNewRemark("");
    } catch (error) {
      console.error("Error sending remark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendRemark();
    }
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const handleEditClick = (remark) => {
    setEditMode(true);
    setEditRemark(remark);
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return format(date, "h:mm a");
      } else if (diffInHours < 168) {
        // 7 days
        return format(date, "EEE h:mm a");
      } else {
        return format(date, "MMM d, h:mm a");
      }
    } catch (error) {
      return "Just now";
    }
  };

  const formatRoleName = (role) => {
    return role
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "500px",
        width: "100%",
      }}
    >
      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          backgroundColor: theme.palette.custom.light,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: theme.palette.background.paper,
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.divider,
            borderRadius: "3px",
          },
        }}
      >
        {remarks.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: theme.palette.custom.text2,
            }}
          >
            <Comment
              sx={{ fontSize: "1rem", opacity: 0.3, mb: 1, color: theme.palette.custom.text2 }}
            />
            <Typography variant="caption" sx={{ opacity: 0.7, color: theme.palette.custom.text2 }}>
              No Remarks yet !
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {remarks.map((remark, index) => {
              const isCurrentUser = remark.role === currentUser?.role;
              const canEdit = allowEditRemark({ remark, index, remarks });

              return (
                <Box
                  key={remark.id || index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      minWidth: "120px",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ flexDirection: isCurrentUser ? "row" : "row-reverse" }}
                    >
                      {canEdit && (
                        <IconButton onClick={() => handleEditClick(remark)} disabled={editMode}>
                          <Edit fontSize="small" sx={{ fontSize: "0.9rem !important" }} />
                        </IconButton>
                      )}
                      <Paper
                        elevation={1}
                        sx={{
                          px: 1.5,
                          py: 1,
                          width: "100%",
                          backgroundColor: isCurrentUser
                            ? theme.palette.custom.translucent
                            : theme.palette.custom.background1,
                          color: isCurrentUser
                            ? theme.palette.custom.text1
                            : theme.palette.custom.text1,
                          borderRadius: isCurrentUser ? "12px 12px 2px 12px" : "2px 12px 12px 12px",
                          wordBreak: "break-word",
                          boxShadow: "none",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.4,
                            fontSize: "0.7rem",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {remark.content || remark.message || remark.text}
                        </Typography>
                      </Paper>
                      <Avatar
                        sx={{
                          width: 25,
                          height: 25,
                          backgroundColor: isCurrentUser
                            ? theme.palette.custom.translucent
                            : theme.palette.custom.background1,
                          color: isCurrentUser
                            ? theme.palette.custom.text2
                            : theme.palette.custom.text2,
                          fontSize: "0.6rem",
                        }}
                      >
                        {getInitials(remark.role || "User")}
                      </Avatar>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                        px: 1,
                        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.custom.text2,
                          opacity: 0.7,
                          fontSize: "0.6rem",
                        }}
                      >
                        {formatRoleName(remark.role || "User")}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.custom.text2,
                          opacity: 0.7,
                          fontSize: "0.6rem",
                        }}
                      >
                        {remark?.isEdited
                          ? formatTimestamp(remark.updatedAt)
                          : formatTimestamp(remark.createdAt || remark.timestamp || new Date())}
                      </Typography>
                      {remark?.isEdited && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.custom.text2,
                                opacity: 0.7,
                                fontSize: "0.6rem",
                                textAlign: "right",
                                width: "100%",
                              }}
                            >
                              <strong> Edited</strong>
                            </Typography>
                          </Box>
                        )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Section */}
      <Box
        sx={{
          p: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            autoFocus
            maxRows={5}
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                px: 1,
                fontSize: "0.7rem",
                backgroundColor: theme.palette.custom.background1,
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-input": {
                color: theme.palette.custom.text1,
                "&::placeholder": {
                  color: theme.palette.custom.text2,
                  opacity: 0.7,
                },
              },
            }}
          />

          <Button
            variant="outlined"
            size="small"
            onClick={handleSendRemark}
            disabled={disabled || isLoading}
            sx={{
              height: "35px",
              minWidth: "48px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: theme.palette.custom.background1,
              color: theme.palette.custom.text2,
              "&:hover": {
                backgroundColor: theme.palette.custom.two,
                color: "#ffffff",
                border: "none",
              },
              "&:disabled": {
                backgroundColor: theme.palette.custom.background1,
                color: theme.palette.custom.text2,
                border: "none",
              },
            }}
          >
            {editMode ? <Done sx={{ fontSize: "1.8rem" }} /> : <Send sx={{ fontSize: "1.2rem" }} />}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RemarksChat;
