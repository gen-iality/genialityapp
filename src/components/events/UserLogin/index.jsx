import React, { Component } from 'react';
import { Result, Spin } from 'antd';
import UserLoginWithEmailPass from '../UserLoginWithEmailPass';

import UserLoginRecoveryPass from '../UserLoginRecoveryPass';
import UserOneTimeLoginLink from '../UserOneTimeLoginLink';
import withContext from '../../../context/withContext';
import { SmileOutlined } from '@ant-design/icons';

//import UserLoginRecoveryPass from "../UserLoginRecoveryPass"
class UserLogin extends Component {
  constructor(props) {
    super(props);
    // Estado provisional para el manejo de los sistemas de autenticación
    this.state = {
      enabledWithEmailPass: true,
      enabledOneTimeLoginLink: false,
      UserLoginRecoveryPass: false,
    };
  }

  componentDidMount() {
    this.setState({
      enabledWithEmailPass:
        this.props.eventId === '5fdb975f2f82e93507305ac2' ||
        '601470367711a513cc7061c2' ||
        '5ea23acbd74d5c4b360ddde2' ||
        (this.props.eventId === '5fb69178cb4e49174574ed12' && true),
      UserLoginRecoveryPass:
        this.props.eventId === '5fdb975f2f82e93507305ac2' ||
        '601470367711a513cc7061c2' ||
        '5ea23acbd74d5c4b360ddde2' ||
        (this.props.eventId === '5fb69178cb4e49174574ed12' && true),
      enabledOneTimeLoginLink: this.props.eventId === '5f99a20378f48e50a571e3b6' && true,
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
            {enabledFormLoginWithEmailPass && this.props.cEventUser.value == null && (
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
            {!enabledFormRecoveryPass && this.props.cEventUser.value !== null && (
              <Result
                icon={<SmileOutlined />}
                title='Bienvenido..!'
                subTitle='Desde ahora puedes disfrutar de nuestro evento'></Result>
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

export default withContext(UserLogin);
