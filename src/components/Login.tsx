import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Button, Form } from "react-bootstrap"; // Usando React Bootstrap para estilos

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!email || !password) {
      setError("Por favor complete todos los campos");
      return;
    }

    try {
      // Llamada a la API simulada para obtener los usuarios
      const response = await fetch("http://localhost:5000/usuarios");
      const usuarios = await response.json();

      // Buscar el usuario que coincida con el correo ingresado
      const usuario = usuarios.find((u: { correo: string }) => u.correo === email);

      if (!usuario) {
        throw new Error("Correo no encontrado");
      }

      // Verificar la contraseña
      if (usuario.password !== password) {
        throw new Error("Contraseña incorrecta");
      }

      // Guardar los datos del usuario en el localStorage
      localStorage.setItem("user", JSON.stringify(usuario));
      login();

      // Redirigir al dashboard si las credenciales son correctas
      navigate("/"); 
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-box p-5 shadow-lg rounded bg-light">
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">Iniciar sesión</Button>
        </Form>
        <div className="mt-3 text-center">
          <p>
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
