import type { FormEvent } from "react";
import "./LoginForm.css";
import CommunicationController from "../communication/CommunicationController";

const LoginForm = () => {
  function handleLoginClick(e: FormEvent) {
    e.preventDefault();

    const usernameEl = document.getElementById("usernameInputField") as HTMLInputElement;
    const passwordEl = document.getElementById("passwordInputField") as HTMLInputElement;

    const username = usernameEl.value;
    const password = passwordEl.value;

    CommunicationController.sendRequest("POST", "/api/login", { body: { username, password } }).then((response) => {
      if (response.ok) {
        console.log("Login successful!");
        console.log(response);
      } else {
        console.log(":(((((((((((((((");
        console.log(response);
      }
    });
  }

  return (
    <form id="loginForm" onSubmit={handleLoginClick}>
      <input id="usernameInputField" type="text" name="usernameInputField" />
      <input id="passwordInputField" type="password" name="passwordInputField" />
      <button id="logInButton" type="submit">
        LOG IN
      </button>
      <a href="">Continue as guest</a>
      <a href="">Create new account</a>
    </form>
  );
};

export default LoginForm;
