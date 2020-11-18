import React, { Component } from 'react';
import { Spin } from 'antd';
import UserLoginWithEmailPass from '../UserLoginWithEmailPass';

import UserLoginRecoveryPass from '../UserLoginRecoveryPass';
import UserOneTimeLoginLink from '../UserOneTimeLoginLink';

//import UserLoginRecoveryPass from "../UserLoginRecoveryPass"
class UserLogin extends Component {
  constructor(props) {
    super(props);
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

    let enabledOneTimeLoginLink = true;
    let enabledWithEmailPass = false;

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
            handleCloseRecoveryPass={handleCloseRecoveryPass}
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
