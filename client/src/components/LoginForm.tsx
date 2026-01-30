import type { FormEvent } from "react";
import "./LoginForm.css";
import CommunicationController from "../communication/CommunicationController";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  function handleLoginClick(e: FormEvent) {
    e.preventDefault();

    const usernameEl = document.getElementById("usernameInputField") as HTMLInputElement;
    const passwordEl = document.getElementById("passwordInputField") as HTMLInputElement;

    const username = usernameEl.value;
    const password = passwordEl.value;

    CommunicationController.sendRequest("POST", "/api/login", { body: { username, password } }).then((response) => {
      if (response.ok) {
        console.log(response);

        const payload = response.payload as { token: string; message: string };
        localStorage.setItem("token", payload.token);

        console.log("Login successful and token set!");

        navigate("/chat");
      } else {
        console.log(response);
      }
    });
  }

  function handleGuestLogin(e: React.MouseEvent) {
    e.preventDefault();

    CommunicationController.sendRequest("POST", "/api/guest", {}).then((response) => {
      if (response.ok) {
        const payload = response.payload as { token: string };
        localStorage.setItem("token", payload.token);
        navigate("/chat");
      } else {
        alert("Failed to start guest session.");
      }
    });
  }

  return (
    <form id="loginForm" onSubmit={handleLoginClick}>
      <input id="usernameInputField" type="text" name="usernameInputField" placeholder="Username" />
      <input id="passwordInputField" type="password" name="passwordInputField" placeholder="Password" />
      <button id="logInButton" type="submit">
        LOG IN
      </button>
      <a href="#" onClick={handleGuestLogin}>Continue as guest</a>
      <Link to="/register">Create new account</Link>
    </form>
  );
};

export default LoginForm;
