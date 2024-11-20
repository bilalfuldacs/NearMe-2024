// App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AppRoutes from "./components/core/AppRoute"; // Ensure the correct path

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
