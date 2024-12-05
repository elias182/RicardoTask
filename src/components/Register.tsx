import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap"; // Usando React Bootstrap
import { useNavigate } from "react-router-dom"; // Importando useNavigate

const Register: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [typeUsuario, setTypeUsuario] = useState("");  // Estado para type_usuario
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [companyName, setCompanyName] = useState("");  // Estado para nombre de compañía si es empresario
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Inicializar useNavigate

  // Cargar las compañías al cargar el componente
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:5000/companias");
        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de compañías");
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        setError("No se pudo obtener la lista de compañías");
      }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !password || (typeUsuario === "user" && !selectedCompany) || (typeUsuario === "empresario" && !companyName)) {
      setError("Por favor complete todos los campos");
      return;
    }

    try {
      // Primero, crear el usuario
      const responseUser = await fetch("http://localhost:5000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          compania: "",  // La compañía se asignará después si es empresario
          type_usuario: typeUsuario, // Enviar el tipo de usuario
        }),
      });

      if (!responseUser.ok) {
        throw new Error("Error al crear el usuario");
      }

      const user = await responseUser.json();
      console.log("Usuario creado:", user);

      let companyId = selectedCompany;  // ID de la compañía, por defecto es la seleccionada para usuario

      if (typeUsuario === "empresario") {
        // Si es empresario, crear una nueva compañía
        const responseCompany = await fetch("http://localhost:5000/companias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: companyName,
            propietario: user.id,  // El propietario es el ID del nuevo usuario creado
          }),
        });

        if (!responseCompany.ok) {
          throw new Error("Error al crear la compañía");
        }

        const newCompany = await responseCompany.json();
        companyId = newCompany.id;  // Obtener el ID de la nueva compañía creada
      }

      // Ahora actualizar el usuario con la compañía creada
      const responseUpdateUser = await fetch(`http://localhost:5000/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          compania: companyId,  // Asignar la compañía al usuario
        }),
      });

      if (!responseUpdateUser.ok) {
        throw new Error("Error al actualizar la compañía del usuario");
      }

      // Redirigir al login después de un registro exitoso
      navigate("/login");
    } catch (error) {
      setError("Hubo un error al registrar el usuario");
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100">
      <div className="register-box p-5 shadow-lg rounded bg-light">
        <h2 className="text-center mb-4">Registro</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombre" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="type_usuario" className="mb-3">
            <Form.Label>Type of user</Form.Label>
            <Form.Control
              as="select"
              value={typeUsuario}
              onChange={(e) => {
                setTypeUsuario(e.target.value);
                // Limpiar la selección de compañía si cambia el tipo de usuario
                setSelectedCompany("");
                setCompanyName("");
              }}
              required
            >
              <option value="">Select type of user</option>
              <option value="user">User</option>
              <option value="empresario">Emp</option>
            </Form.Control>
          </Form.Group>

          {/* Si el tipo de usuario es "empresario", mostramos un campo para el nombre de la compañía */}
          {typeUsuario === "empresario" ? (
            <Form.Group controlId="companyName" className="mb-3">
              <Form.Label>Name of the company</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de su compañía"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </Form.Group>
          ) : (
            // Si el tipo de usuario es "user", mostramos un dropdown de compañías
            <Form.Group controlId="compania" className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                as="select"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                required
              >
                <option value="">Select company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.nombre}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
