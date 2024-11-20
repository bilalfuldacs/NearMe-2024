import type { ReactElement, MouseEvent } from "react";
import { Button, IconButton, CircularProgress } from "@mui/material";
import { forwardRef } from "react";

interface AppButtonProps {
  sx?: object;
  body?: string;
  icon?: ReactElement;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
  isFilled?: boolean;
  id?: string;
  isFullWidth?: boolean;
  isSubmitting?: boolean;
  loadingText?: string;
  isFullHeight?: boolean;
  size?: "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
}

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      body = null,
      icon = null,
      onClick = () => null,
      isFilled = false,
      id = undefined,
      isFullWidth = false,
      sx = {},
      isSubmitting = false,
      loadingText = "Loading",
      type = "button",
      isFullHeight = false,
      size = "medium",
    },
    ref
  ) => {
    const startIcon = isSubmitting ? (
      <CircularProgress size={20} color="inherit" />
    ) : (
      icon
    );
    const buttonText = isSubmitting ? loadingText : body;
    if (body === null) {
      return (
        <IconButton color="primary" onClick={onClick} ref={ref}>
          {icon}
        </IconButton>
      );
    }
    return (
      <Button
        variant={isFilled ? "contained" : "outlined"}
        startIcon={startIcon}
        onClick={onClick}
        id={id}
        sx={{
          ...sx,
          whiteSpace: "nowrap",
          width: isFullWidth ? "100%" : null,
          height: isFullHeight ? "100%" : null,
        }}
        type={type}
        disabled={isSubmitting}
        size={size}
      >
        {buttonText}
      </Button>
    );
  }
);
AppButton.displayName = "AppButton";
export default AppButton;
