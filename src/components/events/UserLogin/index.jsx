import { Component } from 'react'
import { Result, Spin } from 'antd'
import UserLoginWithEmailPass from '../UserLoginWithEmailPass'

import UserLoginRecoveryPass from '../UserLoginRecoveryPass'
import UserOneTimeLoginLink from '../UserOneTimeLoginLink'
import withContext from '@context/withContext'
import { SmileOutlined } from '@ant-design/icons'

class UserLogin extends Component {
  constructor(props) {
    super(props)
    // Estado provisional para el manejo de los sistemas de autenticación
    this.state = {
      enabledWithEmailPass: true,
      enabledOneTimeLoginLink: false,
      UserLoginRecoveryPass: false,
    }
  }

  componentDidMount() {
    this.setState({
      enabledWithEmailPass: false,
      UserLoginRecoveryPass: false,
      enabledOneTimeLoginLink: true,
    })
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
    } = this.props

    const { enabledOneTimeLoginLink, enabledWithEmailPass } = this.state

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
                title="Bienvenido..!"
                subTitle="Desde ahora puedes disfrutar de nuestro curso"
              ></Result>
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
    )
  }
}

export default withContext(UserLogin)
