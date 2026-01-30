import { useState, type FormEvent } from "react";
import "./RegisterForm.css";
import CommunicationController from "../communication/CommunicationController";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  function handleRegisterClick(e: FormEvent) {
    e.preventDefault();

    const usernameEl = document.getElementById("regUsernameInput") as HTMLInputElement;
    const passwordEl = document.getElementById("regPasswordInput") as HTMLInputElement;

    const username = usernameEl.value;
    const password = passwordEl.value;

    CommunicationController.sendRequest("POST", "/api/register", {
      body: { username, password },
    }).then((response) => {
      if (response.ok) {
        const payload = response.payload as { token: string };

        if (payload.token) {
          localStorage.setItem("token", payload.token);
          navigate("/chat");
        } else {
          alert("Registration successful! Please log in.");
          navigate("/login");
        }
      } else {
        const payload = response.payload as { message: string };
        setError(payload.message || "Registration failed.");
      }
    });
  }

  return (
    <form id="registerForm" onSubmit={handleRegisterClick}>
      <input id="regUsernameInput" type="text" placeholder="Choose Username" required />
      <input id="regPasswordInput" type="password" placeholder="Choose Password" required />
      {error && <div className="authError">{error}</div>}
      <button id="registerButton" type="submit">
        REGISTER
      </button>
      <Link to="/login">Already have an account? Log in</Link>
    </form>
  );
};

export default RegisterForm;
