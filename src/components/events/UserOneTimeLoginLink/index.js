import React, { Component } from 'react';
import { Card, Form, Input, Col, Row, Button, Spin } from 'antd';
import UserOneTimeLoginLinKForm from '../UserOneTimeLoginLinkForm';

export default class UserOneTimeLoginLink extends Component {
  render() {
    //const { handleCloseRecoveryPass, handleRecoveryPass, loading, errorRecovery, successRecovery } = this.props;
    return (
      <UserOneTimeLoginLinKForm
        title='Solicitar un ingreso al  correo'
        successMsg='Se ha enviado un ingreso a su correo'
        actionMsg='Solicitar ingreso'
        {...this.props}
      />
    );
  }
}
