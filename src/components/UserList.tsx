import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Asegúrate de que AuthContext esté configurado correctamente

interface User {
  id: string;
  nombre: string;
  correo: string;
  type_usuario: string; // Agregar tipo de usuario (admin, usuario común)
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useContext(AuthContext); // Obtener datos del usuario desde el contexto
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Verificar si el usuario es admin
  const isAdmin = userProfile?.type_usuario === "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/usuarios");
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setUsers(data);
        } else {
          throw new Error("Datos de usuarios no válidos");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserClick = (id: string) => {
    navigate(`/user-info/${id}`);
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:5000/usuarios/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== id),
          );
        } else {
          alert("Error al eliminar el usuario");
        }
      } catch (error) {
        alert("Error al eliminar el usuario");
      }
    }
  };

  const handleEditUser = (id: string) => {
    navigate(`/edit-user/${id}`); // Redirigir a una página para editar el usuario
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h3>Cargando usuarios...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <h3>Error: {error}</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lista de Usuarios</h2>
      <div className="row">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="col-md-6 col-lg-4 mb-4">
              <div className="user-item p-4 border rounded shadow-sm h-100">
                <h5 className="mb-2 text-primary">{user.nombre}</h5>
                <p className="mb-1"><strong>Correo:</strong> {user.correo}</p>
                <p className="mb-3"><strong>Tipo:</strong> {user.type_usuario}</p>
                <div className="d-flex justify-content-between">
                  
                  {isAdmin && (
                    <div>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEditUser(user.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center">No se encontraron usuarios.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
