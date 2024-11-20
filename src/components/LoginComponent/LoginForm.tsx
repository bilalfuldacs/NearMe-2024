import React, { useState } from "react";
import { AppFormField, AppFormFieldType } from "../core/Form";
import AppForm from "../core/Form";
import { Box, Typography } from "@mui/material";
import AppButton from "../core/Button";
import Image from "./login.gif";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate

export default function LoginForm() {
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [formFields, setFormFields] = useState<AppFormField[]>([
    {
      name: "username",
      label: "Username",
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
  ]);

  const handleChange = (newData: AppFormField[]) => {
    setFormFields([...newData]);
  };

  const handleLogin = () => {
    // Check for empty fields
    const updatedFields = formFields.map((field) => {
      if (field.required && !field.value) {
        return { ...field, error: true, errorText: "This field is required" };
      }
      return { ...field, error: false, errorText: "" };
    });

    const isValid = updatedFields.every((field) => !field.error);
    if (isValid) {
      // Retrieve signup data from localStorage
      const signupData = JSON.parse(localStorage.getItem("signupData") ?? "{}");

      // Get entered username and password from formFields
      const enteredUsername = formFields.find(
        (field) => field.name === "username"
      )?.value;
      const enteredPassword = formFields.find(
        (field) => field.name === "password"
      )?.value;

      // Check if username and password match signup data
      if (
        signupData &&
        signupData.find(
          (field: any) =>
            field.name === "email" && field.value === enteredUsername
        ) &&
        signupData.find(
          (field: any) =>
            field.name === "password" && field.value === enteredPassword
        )
      ) {
        // Redirect to /events page if login is successful
        navigate("/events");
      } else {
        alert("Invalid username or password");
      }
    } else {
      setFormFields(updatedFields);
    }
  };

  return (
    <Box sx={{ width: "30%", margin: "0 auto", padding: "2rem" }}>
      <img src={Image} alt="Login" style={{ width: "100%" }} />
      <AppForm
        fields={formFields}
        direction="column"
        size="medium"
        onChange={handleChange}
      />
      <br />
      <AppButton body="Login" onClick={handleLogin} isFilled isFullWidth />

      {/* Add a line with a link to the signup page */}
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Typography variant="body2">
          If you do not have an account, <Link to="/signup">sign up</Link>
        </Typography>
      </Box>
    </Box>
  );
}
