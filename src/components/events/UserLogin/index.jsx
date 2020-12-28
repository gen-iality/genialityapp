import React, { Component } from 'react';
import { Spin } from 'antd';
import UserLoginWithEmailPass from '../UserLoginWithEmailPass';

import UserLoginRecoveryPass from '../UserLoginRecoveryPass';
import UserOneTimeLoginLink from '../UserOneTimeLoginLink';

//import UserLoginRecoveryPass from "../UserLoginRecoveryPass"
class UserLogin extends Component {
  constructor(props) {
    super(props);
    // Estado provisional para el manejo de los sistemas de autenticación
    this.state = {
      enabledWithEmailPass: false,
      enabledOneTimeLoginLink: false,
      UserLoginRecoveryPass: false,
    };
  }

  componentDidMount() {
    this.setState({
      enabledWithEmailPass: this.props.eventId === '5fdb975f2f82e93507305ac2' && true,
      UserLoginRecoveryPass: this.props.eventId === '5fdb975f2f82e93507305ac2' && true,
      enabledOneTimeLoginLink:
        this.props.eventId === '5f99a20378f48e50a571e3b6' ||
        (this.props.eventId === '5fb69178cb4e49174574ed12' && true),
    });
  }

  render() {
    const {
      eventId,
      FormTags,
      handleLoginEmailPassword,
      errorLogin,
      loading,
      onFinishFailed,
      enabledFormLoginWithEmailPass,
      enabledFormRecoveryPass,
      handleOpenRecoveryPass,
      handleCloseRecoveryPass,
      handleRecoveryPass,
      errorRecovery,
      successRecovery,
    } = this.props;

    const { enabledOneTimeLoginLink, enabledWithEmailPass } = this.state;
    return (
      <>
        {loading && <Spin />}
        {enabledWithEmailPass && (
          <>
            {enabledFormLoginWithEmailPass && (
              <UserLoginWithEmailPass
                eventId={eventId}
                FormTags={FormTags}
                handleLoginEmailPassword={handleLoginEmailPassword}
                onFinishFailed={onFinishFailed}
                loading={loading}
                errorLogin={errorLogin}
                handleOpenRecoveryPass={handleOpenRecoveryPass}
              />
            )}

            {enabledFormRecoveryPass && (
              <UserLoginRecoveryPass
                handleCloseRecoveryPass={handleCloseRecoveryPass}
                handleRecoveryPass={handleRecoveryPass}
                loading={loading}
                errorRecovery={errorRecovery}
                successRecovery={successRecovery}
              />
            )}
          </>
        )}

        {enabledOneTimeLoginLink && (
          <UserOneTimeLoginLink
            handleRecoveryPass={handleRecoveryPass}
            loading={loading}
            errorRecovery={errorRecovery}
            successRecovery={successRecovery}
          />
        )}
      </>
    );
  }
}

export default UserLogin;
