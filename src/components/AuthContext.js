import React, { createContext, useState, useEffect } from "react";

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Al cargar la aplicación, verifica si el usuario está autenticado usando el localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("user"); // Almacenamos el correo del usuario en lugar de un token
    if (storedEmail) {
      setIsAuthenticated(true);
      setUserProfile(JSON.parse(storedEmail));
    }
  }, []);

  // Función para obtener las compañías relacionadas con el usuario
  const fetchCompanyData = async (user) => {
    try {
      const response = await fetch(
        `http://localhost:5000/companias/${user.compania}`,
      );
      const companyData = await response.json();

      if (response.ok) {
        setUserProfile((prevState) => ({
          ...prevState,
          compania: companyData,
        }));
      } else {
        console.error("Error fetching company data:", companyData);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  // Función para hacer login
  const login = () => {
    setIsAuthenticated(true);

      const storedEmail = localStorage.getItem("user"); // Almacenamos el correo del usuario en lugar de un token
      if (storedEmail) {
        setIsAuthenticated(true);
        setUserProfile(JSON.parse(storedEmail));
      }
    
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem("user"); // Eliminar el correo del localStorage
    setIsAuthenticated(false);
    setUserProfile(null);
  };





  // Función para actualizar el perfil del usuario
  const updateUserProfile = async ({ nombre, compania }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/usuarios/${userProfile?.id}`,
        {
          method: "PUT", // Método de actualización
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre, // Nombre del usuario
            compania, // Compañía seleccionada (puede incluir ID y nombre)
          }),
        },
      );

      if (response.ok) {
        const updatedUser = await response.json(); // Obtener el perfil actualizado desde la API
        setUserProfile(updatedUser); // Actualizamos el estado local con los nuevos datos
        console.log("Perfil actualizado correctamente");
      } else {
        console.error("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud PUT:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userProfile, login, logout, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
