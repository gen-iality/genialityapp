const transferForm = {
  titleModal: "Transferir Ticket a Usuario",
  formButton: "Transferir Ticket",
  resultTitle: "Transferencia realizada exitosamente!",
  loadingMessage: "Realizando Transferencia",
  successMessage: "Transferencia Realizada",
  errorMessage: "Error... Intentalo mas tarde",
};

const registerForm = {
  titleModal: "Formulario de Registro",
  formButton: "Registrarse",
  resultTitle: "Has sido registrado exitosamente!",
  loadingMessage: "Registrando Usuario",
  successMessage: "",
  errorMessage: "Error... Intentalo mas tarde",
};

export const setSuccessMessageInRegisterForm = (statusResponse) => {
  registerForm.successMessage = statusResponse == "CREATED" ? "Registrado" : "Actualizado";
};

export default (formType) => {
  switch (formType) {
    case "register":
      return registerForm;
      break;

    case "transfer":
      return transferForm;
      break;

    default:
      break;
  }
};
