// AppRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import SignupForm from "../SignUp/SignUpForm";
import LoginForm from "../LoginComponent/LoginForm";
import EventHome from "../Events/EventHome";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/events" element={<EventHome />} />
      {/* <Route
        path="/protected"
        element={
          <ProtectedRoute>
            <ProtectedPage />
          </ProtectedRoute>
        }
      /> */}
    </Routes>
  );
}
