import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Company {
  id: string;
  nombre: string;
  propietario: string;
}

const EditCompany: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID de la URL
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`http://localhost:5000/companias/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los detalles de la compañía");
        }
        const data = await response.json();
        setCompany(data); // Almacenar los detalles de la compañía
        setName(data.nombre); // Solo editamos el nombre
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]); // Cuando cambia el ID en la URL, vuelve a hacer la solicitud

  const handleSave = async () => {
    if (!name) {
      alert("Por favor, completa todos los campos");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/companias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name, // Solo enviamos el nombre
        }),
      });

      if (response.ok) {
        alert("Compañía actualizada con éxito");
        navigate("/"); // Redirige a la lista de compañías o cualquier otra página
      } else {
        alert("Error al actualizar la compañía");
      }
    } catch (error) {
      alert("Error al guardar los cambios");
    }
  };

  const handleCancel = () => {
    navigate("/"); // Redirige a la lista de compañías sin hacer cambios
  };

  if (loading) {
    return <div>Loading Companies...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="edit-company-container">
      <h2>Edit Company</h2>
      {company && (
        <div>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleSave}>
              Save Changes
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCompany;
