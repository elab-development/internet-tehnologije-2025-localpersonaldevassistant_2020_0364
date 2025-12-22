import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div id="loginPage">
      <h1>Login to Local Personal Dev Assistant!</h1>
      <p id="descriptionText">Always available. Secure. Smart.</p>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
