import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { ReactElement } from "react";
import { useMemo } from "react";

export enum AppFormFieldType {
  TEXT = "text",
  PASSWORD = "password", // Add PASSWORD type
  SELECT = "select",
  MULTISELECT = "multiselect",
  TEXTMULTILINE = "textmultiline",
  TEXTAREA = "textarea",
  TOGGLE = "toggle",
}

export interface AppFormFieldOption {
  value: string | number;
  text: string;
  subTitle?: string;
  group?: string;
  icon?: ReactElement;
}

export interface AppFormField {
  sx?: object;
  inputProps?: object;
  name: string;
  label?: string;
  value?: string | string[];
  type?: AppFormFieldType;
  internalValue?: string | string[];
  required?: boolean;
  options?: AppFormFieldOption[];
  readonly?: boolean;
  allowNew?: boolean;
  error?: boolean;
  errorText?: string;
  confirmNew?: boolean;
  confirmNewLabel?: string;
  displayValueAsText?: boolean;
  maxLength?: number;
}

interface AppFormProps {
  fields: AppFormField[];
  onChange: (inputFields: AppFormField[]) => void;
  direction?: "row" | "column";
  size?: "small" | "medium";
}

export default function AppForm({
  fields,
  onChange,
  direction = "column",
  size = "medium",
}: AppFormProps) {
  const inputFields = useMemo<AppFormField[]>(
    () =>
      fields.map((field) => ({
        ...field,
        type: field.type ?? AppFormFieldType.TEXT,
        value:
          field.value ??
          (field.type === AppFormFieldType.MULTISELECT ? [] : ""),
      })),
    [fields]
  );

  const handleChange = (
    name: string,
    value: string | string[] | null,
    isMultiselect = false
  ) => {
    const newFields = inputFields.map((field) => {
      if (field.name === name) {
        field.value = isMultiselect
          ? Array.from(new Set(value as string[]))
          : value ?? ""; // Fallback for undefined values
      }
      return field;
    });
    onChange(newFields); // Pass the updated fields back to LoginForm
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2} sx={{ pt: 1 }} direction={direction}>
        {inputFields.map((field: AppFormField) => {
          const { name, label, required, readonly, error, errorText } = field;
          const type = field.type ?? AppFormFieldType.TEXT;

          if (
            type === AppFormFieldType.TEXT ||
            type === AppFormFieldType.TEXTMULTILINE ||
            type === AppFormFieldType.PASSWORD
          ) {
            return (
              <TextField
                key={name}
                id={name}
                label={label}
                type={type === AppFormFieldType.PASSWORD ? "password" : "text"}
                required={required}
                fullWidth
                onChange={(e) => handleChange(name, e.target.value)}
                value={field.value as string}
                error={error}
                helperText={errorText}
                multiline={type === AppFormFieldType.TEXTMULTILINE}
                rows={type === AppFormFieldType.TEXTMULTILINE ? 4 : 1}
                InputProps={{ readOnly: readonly, ...field.inputProps }}
                size={size}
                sx={{ ...field.sx }}
              />
            );
          } else if (type === AppFormFieldType.SELECT) {
            return (
              <FormControl
                key={name}
                error={error}
                required={required}
                fullWidth
              >
                <InputLabel>{label}</InputLabel>
                <Select
                  value={field.value as string}
                  onChange={(e) => handleChange(name, e.target.value)}
                  input={<OutlinedInput label={label} />}
                  disabled={readonly}
                  size={size}
                >
                  {field.options?.map((option) => (
                    <MenuItem value={String(option.value)} key={option.value}>
                      <Typography>{option.text}</Typography>
                      {option.subTitle && (
                        <Typography variant="body2" color="text.secondary">
                          {option.subTitle}
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Select>
                {error && (
                  <Typography variant="caption" color="error">
                    {errorText}
                  </Typography>
                )}
              </FormControl>
            );
          } else if (type === AppFormFieldType.MULTISELECT) {
            return (
              <Autocomplete
                key={name}
                multiple
                disableCloseOnSelect
                options={field.options?.map((option) => option.text) ?? []}
                value={field.value as string[]}
                freeSolo={field.allowNew}
                onChange={(e, value) => handleChange(name, value, true)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                      size={size}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={label}
                    error={error}
                    helperText={errorText}
                  />
                )}
                size={size}
              />
            );
          } else if (type === AppFormFieldType.TEXTAREA) {
            return (
              <TextField
                key={name}
                id={name}
                label={label}
                type="text"
                required={required}
                fullWidth
                multiline
                rows={4}
                onChange={(e) => handleChange(name, e.target.value)}
                value={field.value as string}
                error={error}
                helperText={errorText}
                InputProps={{ readOnly: readonly, ...field.inputProps }}
                size="medium"
                sx={{ ...field.sx }}
              />
            );
          } else if (type === AppFormFieldType.TOGGLE) {
            const selectedOption = field.options?.find(
              (opt) => opt.value === field.value
            );
            return (
              <Box display="flex" gap={2} key={name} alignItems="center">
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(e, v) => handleChange(name, v)}
                >
                  {field.options?.map((option) => (
                    <ToggleButton
                      value={option.value}
                      key={option.value}
                      size="large"
                    >
                      {option.icon}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {selectedOption && (
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedOption.text}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOption.subTitle}
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          }

          return <p key={name}>{label}</p>;
        })}
      </Stack>
    </Box>
  );
}
