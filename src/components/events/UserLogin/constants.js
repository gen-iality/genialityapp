const loginForm = {
  titleForm: "Iniciar sesión",
  errorLoginEmailPassword: "E-mail o Contraseña incorrecta"
  
};
  
export default (formType) => {
  switch (formType) {
    case "login":
      return loginForm
      break;

    default:
      break;
  }
};
  