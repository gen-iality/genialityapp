import { Component } from 'react';
import UserOneTimeLoginLinKForm from '../UserOneTimeLoginLinkForm';

export default class UserOneTimeLoginLink extends Component {
  render() {
    //const { handleCloseRecoveryPass, handleRecoveryPass, loading, errorRecovery, successRecovery } = this.props;
    return (
      <UserOneTimeLoginLinKForm
        title='Si ya estás registrado, digita tu email para iniciar sesión, luego podrás dar clic en episodios y ver el capítulo'
        successMsg='Se ha enviado un ingreso a su correo'
        actionMsg='Solicitar ingreso'
        {...this.props}
      />
    );
  }
}
