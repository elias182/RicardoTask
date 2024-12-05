import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Error404 from "./components/Error404";
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/header"; // Importar el Header
import Inicio from "./components/Inicio";
import CompanyInfo from "./components/Companyinfo";
import Login from "./components/Login";
import Register from "./components/Register";
import "bootstrap/dist/css/bootstrap.min.css";

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import User from "./components/User";
import EditCompany from "./components/EditCompany";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header /> {/* Agregar el Header aquí */}
          <div className="main">
            <div className="content">
              <Routes>
                <Route path="/profile" element={<User />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/company-info/:companyId"
                  element={<CompanyInfo />}
                />
                <Route path="/" element={<Inicio />} />
                <Route path="/edit-company/:id" element={<EditCompany />} />
                <Route path="/*" element={<Error404 />} />{" "}
                {/* Catch-all route for 404 */}
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
