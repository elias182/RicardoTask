import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Asegúrate de tener configurado AuthContext
import { Button } from "react-bootstrap"; // Usando botones de React Bootstrap

const Header = () => {
  const { isAuthenticated, userProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Función para navegar al perfil del usuario
  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout(); // Llamada al método logout
    navigate("/"); // Redirigir al inicio después de cerrar sesión
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Enlace al inicio */}
        <Link to="/" className="navbar-brand">
          Companies and Users
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Enlaces de navegación */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/companias" className="nav-link">
                Companies
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/usuarios" className="nav-link">
                Users
              </Link>
            </li>
          </ul>

          {/* Enlaces de usuario autenticado */}
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link" onClick={handleProfileClick}>
                    {userProfile?.nombre}
                  </span>
                </li>
                {userProfile?.compania && (
                  <li className="nav-item">
                    <span className="nav-link">
                      {userProfile?.compania.nombre}
                    </span>
                  </li>
                )}
                <li className="nav-item">
                  <Button
                    className="btn btn-outline-light"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Log in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
