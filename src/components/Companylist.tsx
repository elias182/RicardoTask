import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Asegúrate de que AuthContext esté configurado correctamente

interface Company {
  id: string;
  nombre: string;
  propietario: string;
}

const CompanyList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useContext(AuthContext); // Obtener datos del usuario desde el contexto
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Verificar si el usuario es admin
  const isAdmin = userProfile?.type_usuario == "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/companias");
        if (!response.ok) {
          throw new Error("Error al obtener las compañías");
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setCompanies(data);
        } else {
          throw new Error("Datos de compañías no válidos");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompanyClick = (id: string) => {
    navigate(`/company-info/${id}`);
  };

  const handleDeleteCompany = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta compañía?")) {
      try {
        const response = await fetch(`http://localhost:5000/companias/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setCompanies((prevCompanies) =>
            prevCompanies.filter((company) => company.id !== id),
          );
        } else {
          alert("Error al eliminar la compañía");
        }
      } catch (error) {
        alert("Error al eliminar la compañía");
      }
    }
  };

  const handleEditCompany = (id: string) => {
    navigate(`/edit-company/${id}`); // Redirigir a una página para editar la compañía
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h3>Cargando compañías...</h3>
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
      <h2 className="text-center mb-4">Lista de Compañías</h2>
      <div className="row">
        {companies.length > 0 ? (
          companies.map((company) => (
            <div key={company.id} className="col-md-6 col-lg-4 mb-4">
              <div className="company-item p-4 border rounded shadow-sm h-100">
                <h5 className="mb-2 text-primary">{company.nombre}</h5>

                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleCompanyClick(company.id)}
                  >
                    Ver Detalles
                  </button>
                  {isAdmin && (
                    <div>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEditCompany(company.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteCompany(company.id)}
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
            <p className="text-center">No se encontraron compañías.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
