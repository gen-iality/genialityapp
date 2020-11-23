import React, { Component } from 'react';
import { Card, Form, Input, Col, Row, Button, Spin } from 'antd';
import UserOneTimeLoginLinKForm from '../UserOneTimeLoginLinkForm';

export default class UserLoginRecoveryPass extends Component {
  render() {
    //const { handleCloseRecoveryPass, handleRecoveryPass, loading, errorRecovery, successRecovery } = this.props;
    return (
      <UserOneTimeLoginLinKForm
        title='Restablecimiento de contraseña'
        successMsg='Se ha enviado una nueva contraseña a su correo'
        actionMsg='Solicitar una contraseña'
        {...this.props}
      />
    );
  }
}
