import React, { Component } from 'react';
import UserOneTimeLoginLinKForm from '../UserOneTimeLoginLinkForm';

export default class UserOneTimeLoginLink extends Component {
  render() {
    //const { handleCloseRecoveryPass, handleRecoveryPass, loading, errorRecovery, successRecovery } = this.props;
    return (
      <UserOneTimeLoginLinKForm
        title='Si yá se encuentra registrado, ingrese su correo para enviarle un enlace de ingreso'
        successMsg='Se ha enviado un ingreso a su correo'
        actionMsg='Solicitar ingreso'
        {...this.props}
      />
    );
  }
}
