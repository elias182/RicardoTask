import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const User = () => {
  const { isAuthenticated, userProfile, updateUserProfile, logout } =
    useContext(AuthContext);

  const [nombre, setNombre] = useState(userProfile?.nombre || "");
  const [compania, setCompania] = useState(userProfile?.compania || "");
  const [isEditing, setIsEditing] = useState(false);
  const [companias, setCompanias] = useState<any[]>([]);
  const [selectedCompaniaId, setSelectedCompaniaId] = useState<string>(
    userProfile?.compania || ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/companias")
      .then((response) => response.json())
      .then((data) => setCompanias(data))
      .catch((error) => {
        console.error("Error al cargar las compañías:", error);
        setError("Error al cargar las compañías");
      });
  }, []);

  useEffect(() => {
    if (selectedCompaniaId) {
      fetch(`http://localhost:5000/companias/${selectedCompaniaId}`)
        .then((response) => response.json())
        .then((data) => {
          setCompania(data.nombre); // Actualiza el nombre de la compañía en el estado
        })
        .catch((error) => {
          console.error("Error al obtener la compañía:", error);
          setError("Error al obtener la compañía");
        });
    }
  }, [selectedCompaniaId]);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleCompaniaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompaniaId(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/usuarios/${userProfile?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            compania: selectedCompaniaId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Usuario actualizado:", data);
        updateUserProfile({
          nombre,
          compania: { id: selectedCompaniaId, nombre: compania },
        });
        setIsEditing(false);
      } else {
        throw new Error("Error al guardar los datos");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud PUT:", error);
      setError("Hubo un error al guardar la información");
    }
  };

  const handleDeleteAccount = async () => {
    if (userProfile?.id) {
      try {
        const response = await fetch(
          `http://localhost:5000/usuarios/${userProfile.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          console.log("Cuenta eliminada exitosamente");
          logout();
        } else {
          throw new Error("Error al eliminar la cuenta");
        }
      } catch (error) {
        console.error("Error al hacer la solicitud DELETE:", error);
        setError("Hubo un error al eliminar la cuenta");
      }
    }
  };

  if (!isAuthenticated) {
    return <p>You arent authenticated</p>;
  }

  return (
    <div className="user-profile card p-3 mb-3">
      {error && <p className="error">{error}</p>}
      <h3 className="card-title">
        name:{" "}
        {isEditing ? (
          <input
            type="text"
            value={nombre}
            onChange={handleNombreChange}
            className="form-control"
          />
        ) : (
          nombre
        )}
      </h3>

      <p className="card-text">
        Company:{" "}
        {isEditing ? (
          <select
            value={selectedCompaniaId}
            onChange={handleCompaniaChange}
            className="form-control"
          >
            <option value="">Seleccionar Compañía</option>
            {companias.map((compania) => (
              <option key={compania.id} value={compania.id}>
                {compania.nombre}
              </option>
            ))}
          </select>
        ) : (
          compania || "No company asignated."
        )}
      </p>

      <div className="d-flex justify-content-between">
        {isEditing ? (
          <button className="btn btn-success" onClick={handleSave}>
            save
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}

        <button className="btn btn-danger" onClick={handleDeleteAccount}>
          delete acount
        </button>
      </div>
    </div>
  );
};

export default User;
