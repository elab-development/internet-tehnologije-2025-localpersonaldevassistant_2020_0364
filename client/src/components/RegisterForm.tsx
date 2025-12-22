import type { FormEvent } from "react";
import "./RegisterForm.css";
import CommunicationController from "../communication/CommunicationController";
import { Link } from "react-router-dom";

const RegisterForm = () => {
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
        console.log("Registration successful!");
      } else {
        console.error("Registration failed:", response);
      }
    });
  }

  return (
    <form id="registerForm" onSubmit={handleRegisterClick}>
      <input id="regUsernameInput" type="text" placeholder="Choose Username" required />
      <input id="regPasswordInput" type="password" placeholder="Choose Password" required />
      <button id="registerButton" type="submit">
        REGISTER
      </button>
      <Link to="/login">Already have an account? Log in</Link>
    </form>
  );
};

export default RegisterForm;
