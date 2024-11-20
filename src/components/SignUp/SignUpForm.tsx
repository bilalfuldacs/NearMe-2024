import React, { useState } from "react";
import { AppFormField, AppFormFieldType } from "../core/Form";
import AppForm from "../core/Form";
import { Box, Typography } from "@mui/material";
import AppButton from "../core/Button";
import signupGif from "./signup.webp";
import { Link } from "react-router-dom";

export default function SignupForm() {
  const [formFields, setFormFields] = useState<AppFormField[]>([
    {
      name: "fullName",
      label: "Full Name",
      type: AppFormFieldType.TEXT,
      required: true,
      error: false,
      errorText: "",
    },
    {
      name: "email",
      label: "Email",
      type: AppFormFieldType.TEXT,
      required: true,
      error: false,
      errorText: "",
    },
    {
      name: "confirmEmail",
      label: "Confirm Email",
      type: AppFormFieldType.TEXT,
      required: true,
      error: false,
      errorText: "",
    },
    {
      name: "password",
      label: "Password",
      type: AppFormFieldType.PASSWORD,
      required: true,
      error: false,
      errorText: "",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: AppFormFieldType.PASSWORD,
      required: true,
      error: false,
      errorText: "",
    },
    {
      name: "contactNumber",
      label: "Contact Number",
      type: AppFormFieldType.TEXT,
      required: true,
      error: false,
      errorText: "",
    },
    {
      name: "photo",
      label: "Upload Photo",
      type: AppFormFieldType.TEXT,
      required: false,
      error: false,
      errorText: "",
      inputProps: { type: "file" },
    },
  ]);

  const handleChange = (newData: AppFormField[]) => {
    setFormFields(newData);
  };

  const getFieldValue = (fieldName: string) => {
    const field = formFields.find((f) => f.name === fieldName);
    return field ? (field.value as string) : "";
  };

  const handleSignup = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const updatedFields = formFields.map((field) => {
      if (field.required && !field.value) {
        return { ...field, error: true, errorText: "This field is required" };
      }
      if (field.name === "email" && !emailRegex.test(field.value as string)) {
        return { ...field, error: true, errorText: "Invalid email format" };
      }
      if (
        field.name === "confirmEmail" &&
        field.value !== getFieldValue("email")
      ) {
        return { ...field, error: true, errorText: "Emails do not match" };
      }
      if (
        field.name === "confirmPassword" &&
        field.value !== getFieldValue("password")
      ) {
        return { ...field, error: true, errorText: "Passwords do not match" };
      }
      return { ...field, error: false, errorText: "" };
    });

    const isValid = updatedFields.every((field) => !field.error);

    if (isValid) {
      localStorage.setItem("signupData", JSON.stringify(formFields));
      console.log("Signup data:", formFields); // Replace with actual signup action
      alert(`Signup successful for: ${getFieldValue("fullName")}`);
    } else {
      setFormFields(updatedFields);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
        padding: 2,
        maxWidth: "80%", // Constrain the maximum width of the entire layout
        margin: "0 auto", // Center layout horizontally
      }}
    >
      {/* Left Column - GIF */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          Width: "100%", // Constrain the maximum width for the GIF column
        }}
      >
        <img
          src={signupGif}
          alt="Signup"
          style={{ width: "100%", maxWidth: "100%", height: "100%" }}
        />
      </Box>

      {/* Right Column - Signup Form */}
      <Box
        sx={{
          flex: 1,
          Width: "100%", // Constrain the maximum width for the form column
          padding: 4,
          margin: { xs: "20px auto", md: "0" }, // Center form on small screens, align to the right on large screens
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <AppForm
          fields={formFields}
          direction="column"
          size="medium"
          onChange={handleChange}
        />
        <br />
        <AppButton body="Signup" onClick={handleSignup} isFilled isFullWidth />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Log in</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
