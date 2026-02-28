import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Tik from "./components/Ticket"; 
import Admin from "./components/Admin";
import Porti from "./components/Port";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Porti" element={<Porti />} />
        <Route path="/" element={<Navigate to="/Porti" replace />} />
        <Route path="/tickets/*" element={<Tik />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;