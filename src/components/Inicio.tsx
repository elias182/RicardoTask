import React from "react";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Tema de PrimeReact
import "primereact/resources/primereact.min.css"; // Estilos de los componentes de PrimeReact
import "primeicons/primeicons.css"; // Iconos de PrimeReact
import CompanyList from "./Companylist"; // Asegúrate de que el componente esté correctamente importado
import UserList from "./UserList"; // Asegúrate de que el componente esté correctamente importado

const Inicio: React.FC = () => {
  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* Contenedor Principal */}
      <div className="row flex-grow-1">
        {/* Columna Principal (Ocupa todo el ancho) */}
        <div className="col-12 d-flex flex-column justify-content-center align-items-center p-5">
          <div className="content-container bg-light p-5 rounded shadow-sm w-100">
            <h1 className="display-4 text-center text-primary mb-4">
              Bienvenido a la Página de Administración
            </h1>
            <p className="lead text-center mb-4">
              Gestiona las compañías y usuarios, edita o elimina datos según sea necesario.
            </p>

            {/* Botón de Acción de Bienvenida */}
            <div className="d-flex justify-content-center">
              <Button
                label="Ver Compañías"
                icon="pi pi-building"
                className="p-button-primary p-button-lg"
                onClick={() => (window.location.href = "/companias")}
              />
              <Button
                label="Ver Usuarios"
                icon="pi pi-users"
                className="p-button-secondary p-button-lg ml-3"
                onClick={() => (window.location.href = "/usuarios")}
              />
            </div>
          </div>
        </div>

        {/* Columna de Listados (Mitades) */}
        <div className="col-12 d-flex flex-wrap justify-content-between mt-4">
          {/* Columna de Compañías */}
          <div className="col-md-6 mb-4">
            
            <div className="list-container">
              <CompanyList />
            </div>
          </div>

          {/* Columna de Usuarios */}
          <div className="col-md-6 mb-4">
            
            <div className="list-container">
              <UserList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
