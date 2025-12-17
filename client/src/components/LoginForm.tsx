import type { FormEvent } from "react";
import "./LoginForm.css";
import axios from "axios";

const LoginForm = () => {
  function handleLoginClick(e: FormEvent) {
    e.preventDefault();
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
