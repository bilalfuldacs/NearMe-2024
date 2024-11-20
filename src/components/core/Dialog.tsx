import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert, Close } from "@mui/icons-material"; // Import Close icon
import { LoadingButton } from "@mui/lab";
import AppForm, { type AppFormField } from "./Form";
import validate from "./Form";
import AppButton from "./Button";

export interface SecondaryAction {
  name: string;
  tooltip?: string;
  isDisabled?: boolean;
  confirmTitle: string;
  confirmText: string;
  handler: () => unknown;
  element: JSX.Element;
}

interface FormDialogProps {
  title: string;
  fields?: AppFormField[];
  //   cols?: GridColDef[];
  data?: object[];
  ConfirmLabel?: string;
  CancelLabel?: string;
  disableInteraction?: boolean | undefined;
  onCancel?: () => void;
  onConfirm?: (newData: AppFormField[] | object[]) => void;
  onColsConfirm?: () => void;
  secondaryActions?: SecondaryAction[];
  pageSize?: number;
  isLoading?: boolean;
  enableCheckbox?: boolean;
  onCheckboxChange?: (selectedRow: any) => void;
  selectedRowId?: string | number;
  onAppButtonClick?: () => void;
  children?: React.ReactNode;
  //   selectedRows?: Requirement[];
  dialogWidth?: "sm" | "md" | "lg" | "xl";
  disableButton?: boolean;
  enableRadioButton?: boolean;
  groupRequirements?: boolean;
  showStepper?: boolean; // New prop to control the display of the stepper
  steps?: string[]; // New prop for stepper steps
  activeStep?: number; // New prop for active step in the stepper
  showCloseIcon?: boolean; // New prop to control the display of the close icon
  setIsDialogOpen?: (isOpen: boolean) => void;
  extraContent?: React.ReactNode; // Add extraContent prop
  hideActionsMenu?: boolean;
  alertText?: string;
  showAlert?: boolean;
  mainTitle?: string;
  onBackdropClick?: () => void;
}
export default function FormDialog({
  title,
  onColsConfirm,
  isLoading,
  fields,
  pageSize,
  //   cols,
  data = [],
  ConfirmLabel = "Save",
  CancelLabel,
  onCancel,
  onConfirm,
  disableInteraction,
  secondaryActions = [],
  enableCheckbox = false,
  onCheckboxChange,
  selectedRowId,
  //   selectedRows = [],
  onAppButtonClick,
  children,
  dialogWidth = "sm",
  disableButton = false,
  enableRadioButton = false,
  groupRequirements = false,
  showStepper = false, // Default to not showing the stepper
  steps = [], // Default empty steps
  activeStep = 0, // Default to the first step
  showCloseIcon = false, // Default to not showing the close icon
  setIsDialogOpen,
  extraContent,
  hideActionsMenu = false,
  alertText,
  showAlert = false,
  mainTitle,
  onBackdropClick,
}: FormDialogProps) {
  const [inputFields, setInputFields] = useState<AppFormField[]>(fields || []);
  const [secondaryActionIdx, setSecondaryActionIdx] = useState(-1);
  const [secActionsEl, setSecActionsEl] = useState<null | HTMLElement>(null);
  const isActionsMenuOpen = Boolean(secActionsEl);
  const isControlled = typeof disableInteraction === "boolean";

  const handleChange = (newData: AppFormField[]) => {
    setInputFields([...newData]);
  };

  const handleSave = () => {
    if (cols && !children) {
      onColsConfirm?.();
    } else if (!cols && !children) {
      const { isValid, data } = validate(inputFields);
      setInputFields([...data]);
      if (!isValid) {
        return;
      }
      onConfirm?.([...inputFields]);
    } else {
      onColsConfirm?.();
    }
  };
  const handleClose = () => {
    //setIsDialogOpen(false);
  };

  const handleAppButtonClick = () => {
    onAppButtonClick?.(); // Notify parent that the button was clicked
  };

  function openActionsMenu(e: React.MouseEvent<HTMLButtonElement>) {
    setSecActionsEl(e.currentTarget);
  }

  function closeActionsMenu() {
    setSecActionsEl(null);
  }

  function handleActionsMenu(id: string) {
    const existingAction = secondaryActions.findIndex(
      (action) => action.name === id
    );

    if (existingAction > -1) {
      setSecondaryActionIdx(existingAction);
      closeActionsMenu();
    }
  }

  function closeConfirm() {
    setSecondaryActionIdx(-1);
  }

  return (
    <Dialog
      PaperProps={{
        sx: {
          position: "fixed",
          top: "5%", // Fixed top position
          bottom: "auto", // Allow growth from the bottom
          maxHeight: "80vh", // Limit max height to 80% of the viewport
          overflowY: "auto", // Enable scrolling if content exceeds
        },
      }}
      open={true}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          onBackdropClick?.();
        } else {
          !isControlled && onCancel?.();
        }
      }}
      maxWidth={dialogWidth}
      fullWidth={true}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div>{mainTitle ? mainTitle : title}</div>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {secondaryActions.length > 0 && (
            <div>
              <IconButton
                id="actions-trigger"
                aria-controls={isActionsMenuOpen ? "actions-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={isActionsMenuOpen ? "true" : undefined}
                onClick={openActionsMenu}
              >
                <MoreVert />
              </IconButton>
              <Menu
                id="actions-menu"
                anchorEl={secActionsEl}
                open={isActionsMenuOpen}
                onClose={closeActionsMenu}
                MenuListProps={{
                  "aria-labelledby": "actions-trigger",
                }}
              >
                {secondaryActions.map((action) => (
                  <MenuItem
                    key={action.name}
                    disabled={action.isDisabled}
                    onClick={() => handleActionsMenu(action.name)}
                  >
                    {action.element}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}
          {/* Conditionally render the close icon */}
          {showCloseIcon && (
            <IconButton
              onClick={() => setIsDialogOpen?.(false)}
              sx={{
                ml: 1,
              }}
            >
              <Close />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      {<AlertText alertText={alertText} showAlert={showAlert} />}
      <DialogContent>
        {/* Conditionally render the stepper */}
        {showStepper && (
          <Stepper
            activeStep={activeStep}
            sx={{
              "& .MuiStepConnector-root": {
                left: "calc(-50% + 12px)", // Bring line closer to the circle
                right: "calc(50% + 12px)", // Bring line closer to the circle
              },
              "& .MuiStepLabel-label": {
                display: "none", // Hide the label
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
        <br></br>
        {mainTitle && (
          <TitledInputBlock className="dataset-block" title={title} />
        )}
        {children ? (
          children
        ) : cols && !groupRequirements ? (
          <AppDataGrid
            cols={cols}
            data={data}
            entityName="folder"
            pageSize={pageSize}
            isLoading={isLoading}
            enableCheckbox={enableCheckbox}
            onCheckboxChange={onCheckboxChange}
            selectedRowId={selectedRowId}
            selectedRows={selectedRows}
            enableRadioButton={enableRadioButton}
            searchBarDisplayStyle={true}
          />
        ) : (
          <AppForm fields={inputFields} onChange={handleChange} />
        )}
        {groupRequirements && (
          <ExpandableTable
            data={data as Requirement[]}
            onCheckboxChange={onCheckboxChange}
            selectedRows={selectedRows}
            isLoading={isLoading}
          />
        )}
        {extraContent && extraContent}
      </DialogContent>
      {!hideActionsMenu && (
        <DialogActions sx={{ pb: 3, px: 3, pt: 0 }}>
          <Button
            disabled={disableInteraction}
            onClick={onCancel}
            variant="outlined"
            color="primary"
          >
            {CancelLabel || "Cancel"}
          </Button>
          <LoadingButton
            loading={disableInteraction}
            onClick={handleSave}
            variant="contained"
            disabled={disableButton}
          >
            {ConfirmLabel || (showStepper ? "Next" : "Save")}
          </LoadingButton>
        </DialogActions>
      )}
    </Dialog>
  );
}
