const transferForm = {
  titleModal: 'Transferir ticket a Usuario',
  formButton: 'Transferir ticket',
  resultTitle: 'Transferencia realizada exitosamente!',
  loadingMessage: 'Realizando transferencia',
  successMessage: 'Transferencia realizada',
  errorMessage: 'Error... Intentalo mas tarde'
};

const registerForm = {
  titleModal: 'Formulario de Registro',
  formButton: 'Registrarse',
  resultTitle: 'Ha sido registrado exitosamente!',
  loadingMessage: 'Registrando usuario',
  successMessage: '',
  errorMessage: 'Error... Intentalo mas tarde'
};

export const setSuccessMessageInRegisterForm = (statusResponse) => {
  registerForm.successMessage = statusResponse === 'CREATED' ? 'Registrado' : 'Actualizado';
};

export default (formType) => {
  switch (formType) {
    case 'register':
      return registerForm;

    case 'transfer':
      return transferForm;
    default:
      break;
  }
};
