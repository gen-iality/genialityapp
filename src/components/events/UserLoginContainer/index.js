import React, { Component } from 'react';
import { app } from '../../../helpers/firebase';
import UserLogin from '../UserLogin';
import FormTags from './constants';
import { Actions } from '../../../helpers/request';
class UserLoginContainer extends Component {
  constructor(props) {
    super(props);
    //this.reCaptchaRef = React.createRef();
    this.state = {
      user: {},
      emailError: false,
      valid: true,
      extraFields: [],
      loading: false,
      initialValues: {},
      eventUsers: [],
      registeredUser: false,
      submittedForm: false,
      successMessage: null,
      refreshToken: null,
      enabledFormLoginWithEmailPass: true, //Controla la visibilidad del formulario de login con email y password
      enabledFormLoginWithPhone: false, //Controla la visibilidad del formulario de login a través del movil
      enabledFormVerification: false, // Controla la visibilidad del formulario para ingresar código enviado al movil
      enabledFormRecoveryPass: false, // Controla la visibilidad del formulario para recuperar la contraseña
      errorLogin: false,
      errorValidation: false,
      errorRecovery: false,
      successRecovery: false,
      eventId: this.props.eventId,
    };
  }

  async componentDidMount() {
    this.setState({ successRecovery: false });
  }

  //Método ejecutado en el evento onSubmit (onFinish) del formulario de login
  handleLoginEmailPassword = async (values) => {
    this.setState({ loading: true });
    await this.loginEmailPassword(values);
    setTimeout(() => {
      this.setState({ loading: false });
    }, 3000);
  };

  //Realiza la validación del email y password con firebase
  loginEmailPassword = (data) => {
    this.setState({ errorLogin: false });
    app
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      // .then(response =>
      .catch(() => {
        console.error('Error: Email or password invalid');
        this.setState({ errorLogin: true });
        this.setState({ loading: false });
      });
  };

  //Se ejecuta en caso que haya un error en el formulario de login en el evento onSubmit
  onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  handleOpenRecoveryPass = () => {
    this.setState({ loading: true, enabledFormLoginWithEmailPass: false });
    setTimeout(() => {
      this.setState({
        enabledFormRecoveryPass: true,
        loading: false,
      });
    }, 500);
  };

  handleCloseRecoveryPass = () => {
    this.setState({ loading: true, enabledFormRecoveryPass: false });
    setTimeout(() => {
      this.setState({
        enabledFormLoginWithEmailPass: true,
        loading: false,
      });
    }, 500);
  };

  handleRecoveryPass = async ({ email }) => {
    this.setState({ loading: true, errorRecovery: false, successRecovery: false });
    const urlRequest =
      `https://api.evius.co/api/events/${this.state.eventId}/changeUserPassword?destination=` + window.location.origin;
    await Actions.put(urlRequest, { email })
      .then(() => {
        this.setState({ loading: false, successRecovery: true });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false, errorRecovery: true });
      });
  };

  render() {
    const {
      eventId,
      errorLogin,
      loading,
      enabledFormLoginWithEmailPass,
      enabledFormRecoveryPass,
      errorRecovery,
      successRecovery,
    } = this.state;

    return (
      <UserLogin
        eventId={eventId}
        FormTags={FormTags}
        handleLoginEmailPassword={this.handleLoginEmailPassword}
        onFinishFailed={this.onFinishFailed}
        errorLogin={errorLogin}
        loading={loading}
        enabledFormLoginWithEmailPass={enabledFormLoginWithEmailPass}
        enabledFormRecoveryPass={enabledFormRecoveryPass}
        handleOpenRecoveryPass={this.handleOpenRecoveryPass}
        handleCloseRecoveryPass={this.handleCloseRecoveryPass}
        handleRecoveryPass={this.handleRecoveryPass}
        errorRecovery={errorRecovery}
        successRecovery={successRecovery}
      />
    );
  }
}
export default UserLoginContainer;
