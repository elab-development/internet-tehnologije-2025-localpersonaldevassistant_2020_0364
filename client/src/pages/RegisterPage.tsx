import RegisterForm from "../components/RegisterForm";
import "./RegisterPage.css";

const RegisterPage = () => {
  return (
    <div id="registerPage">
      <h1>Register to Local Personal Dev Assistant!</h1>
      <p id="descriptionText">Always available. Secure. Smart.</p>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
