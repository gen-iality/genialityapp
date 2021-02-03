import React, { Component } from 'react';
import { Card, Form, Input, Col, Row, Button, Spin } from 'antd';
import UserOneTimeLoginLinKForm from '../UserOneTimeLoginLinkForm';
import { injectIntl } from 'react-intl';

class UserLoginRecoveryPass extends Component {
  render() {
    const { intl } = this.props;
    //const { handleCloseRecoveryPass, handleRecoveryPass, loading, errorRecovery, successRecovery } = this.props;
    return (
      <UserOneTimeLoginLinKForm
        title={intl.formatMessage({ id: 'restore.login.title' })}
        successMsg={intl.formatMessage({ id: 'restore.login.success' })}
        actionMsg={intl.formatMessage({ id: 'button.restore.password' })}
        {...this.props}
      />
    );
  }
}

export default injectIntl(UserLoginRecoveryPass);
