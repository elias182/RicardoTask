import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Alert, Card, ListGroup } from "react-bootstrap"; // Utilizando React Bootstrap para mejor diseño

interface User {
  id: string;
  nombre: string;
  email: string;
  type_usuario: string;
  compania: string | null;
}

interface CompanyInfoProps {
  companyId: string;
}

const CompanyInfo: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>(); // Obtener el companyId desde la URL
  const [company, setCompany] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [owner, setOwner] = useState<string>(""); // Estado para el nombre del propietario
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/companias/${companyId}`
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos de la compañía");
        }
        const companyData = await response.json();
        setCompany(companyData);

        // Obtener el propietario de la compañía usando el id del propietario
        const ownerResponse = await fetch(
          `http://localhost:5000/usuarios/${companyData.propietario}`
        );
        if (!ownerResponse.ok) {
          throw new Error("Error al obtener los datos del propietario");
        }
        const ownerData = await ownerResponse.json();
        setOwner(ownerData.nombre); // Guardar el nombre del propietario
      } catch (error: any) {
        setError("No se pudo obtener la compañía o el propietario");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/usuarios");
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }
        const usersData = await response.json();
        const filteredUsers = usersData.filter(
          (user: User) => user.compania === companyId
        );
        setUsers(filteredUsers);
      } catch (error: any) {
        setError("No se pudo obtener los usuarios");
      }
    };

    if (companyId) {
      fetchCompanyData();
      fetchUsers();
    }
  }, [companyId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading Information...</span>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="company-info container my-5">
      {company && (
        <Card className="shadow-lg">
          <Card.Header as="h3" className="text-center">
            Information of the company
          </Card.Header>
          <Card.Body>
            <Card.Title className="text-center">{company.nombre}</Card.Title>
            <Card.Text>
              <strong>Owner:</strong> {owner}
            </Card.Text>

            <h4>Users</h4>
            <ListGroup variant="flush">
              {users.length > 0 ? (
                users.map((user) => (
                  <ListGroup.Item key={user.id}>
                    <strong>{user.nombre}</strong> - {user.email}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No hay usuarios asociados a esta compañía.</ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CompanyInfo;

