// src/components/Error404.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="error-404">
      <h1>Error 404</h1>
      <p>La página que buscas no existe.</p>
      <button onClick={handleGoHome}>Volver a la página principal</button>
    </div>
  );
};

export default Error404;
