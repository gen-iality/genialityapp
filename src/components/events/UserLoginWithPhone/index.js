import React, { Component } from 'react';
import { Form, Input, Col, Row, Button, Spin, Card } from 'antd';
import { app } from '../../../helpers/firebase';
import * as Cookie from 'js-cookie';
import FormTags from './constants';
import { injectIntl } from 'react-intl';

const textLeft = {
  textAlign: 'left'
};

class UserLogin extends Component {
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
      enabledLoginForm: true,
      enabledVerificationForm: false,
      errorLogin: false,
      errorValidation: false,
      eventId: this.props.eventId,
      formTexts: FormTags('login')
    };
  }

  async componentDidMount() {
    const { eventId } = this.props;

    //this.initializeCaptcha();

    await app.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(async function(idToken) {
          if (idToken) {
            Cookie.set('evius_token', idToken);
            setTimeout(function() {
              window.location.replace(`/landing/${eventId}?token=${idToken}`);
            }, 1000);
          }
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let { loading } = this.state;

    if (prevState.loading !== loading) {
      if (!loading) {
        // Inicializa el captcha para la autenticacion por SMS
        //this.initializeCaptcha();
      }
    }
  }

  initializeCaptcha = () => {
    let { initialValues } = this.state;
    if (Object.entries(initialValues).length == 0) {
      //
      window.recaptchaVerifier = new app.auth.RecaptchaVerifier(this.reCaptchaRef.current.id, {
        size: 'invisible',
        callback: function(response) {},
        'expired-callback': function() {}
      });

      window.recaptchaVerifier.render().then(function(widgetId) {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  handleLoginWithPhoneNumber = (values) => {
    app
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .catch(function(error) {
        // Handle Errors here.
        console.error(error.code);
        console.error(error.message);
        // ...
      });

    /* El script comentariado en este método corresponde al método de autenticacion con celular
    NO BORRAR
    */

    // var appVerifier = window.recaptchaVerifier;
    //let phone = `+57${ values.phone }`;

    // app
    // .auth()
    // .signInWithPhoneNumber( phone, appVerifier )
    // .then( function ( confirmationResult ) {
    //   window.confirmationResult = confirmationResult;
    //
    // })
    // .catch( function ( error ) {
    //   console.error( "error:", error.message );
    //   this.setState({errorLogin: true})
    // });
    // this.setState({enabledLoginForm: false})
    // this.setState({loading: true})

    // setTimeout(()=>{
    //   this.setState({loading: true})
    //   this.setState({enabledVerificationForm: true})
    // },1000)
  };

  loginEmailPassword = (data) => {
    //
    this.setState({ errorLogin: false });
    const respuesta = app
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then((response) => 
      .catch(() => {
        console.error('Error: Email or password invalid');
        this.setState({ errorLogin: true });
        this.setState({ loading: false });
      });
    //
  };

  handleLoginEmailPassword = async (values) => {
    //
    //
    // Cookie.remove("token");
    // Cookie.remove("evius_token");
    // window.indexedDB.deleteDatabase('firebaseLocalStorageDb')
    // window.indexedDB.deleteDatabase('firestore/[DEFAULT]/eviusauth/main')
    this.setState({ loading: true });
    await this.loginEmailPassword(values);
    setTimeout(() => {
      this.setState({ loading: false });
    }, 3000);
  };

  handleVerificationWithPhoneNumber = (values) => {
    this.setState({ loading: false });
    var credential = app.auth.PhoneAuthProvider.credential(
      window.confirmationResult.verificationId,
      values.verificationCode
    );
    app
      .auth()
      .signInWithCredential(credential)
      .then((response) => {
        this.setState({ errorValidation: false });
      })
      .catch((err) => {
        this.setState({ errorValidation: true });
      });
    // window.confirmationResult.confirm(values.verificationCode)
    // .then(function (result) {
    //   const user = result.user;
    //   return  user.refreshToken

    //   //window.localStorage.setItem('refresh_token', user.refreshToken)
    // })
    // .then((refreshToken)=>{
    //   this.setState({refreshToken: refreshToken})
    //   
    // })
    // .catch(function (error) {
    //  console.error(error)
    // });
  };

  onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  render() {
    const { formTexts } = this.state;
    const { intl } = this.props;
    return (
      //<div style={{background: '#ffffff', padding: '50px', width: '450px', borderRadius: '15px', margin: 'auto'}}>
      <Card title={intl.formatMessage({ id: 'restore.login.title' })} bodyStyle={textLeft}>
        {/* {this.state.enabledLoginForm && (
      <Form onFinish={this.handleLoginWithPhoneNumber}>
        <Row gutter={[24, 24]}>
          <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
            <Form.Item
              label="Celular"
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Ingrese nÃºmero de celular',
                },
              ]}
              >
                <Input />
            </Form.Item>
          </Col>
        </Row>  
        <Row gutter={[24, 24]}>
          <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
            <div ref={ this.reCaptchaRef } id="este-test"></div>
          </Col>
        </Row>
        {this.state.errorLogin && (
          <Row gutter={[24, 24]}>
            <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
              <span style={{color: 'red'}}>Sucedió un error, verifique la información ingresada</span>
            </Col>
          </Row> 
        )}    
        <Row gutter={[24, 24]}>
          <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Ingresar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )} */}

        {/* Inicio  de formulario para autenticación con Email y contraseña */}
        {this.state.enabledLoginForm && (
          <Form onFinish={this.handleLoginEmailPassword} onFinishFailed={this.onFinishFailed}>
            <Row gutter={[24, 24]}>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <Form.Item
                  label='E-Mail'
                  name='email'
                  rules={[
                    {
                      required: true,
                      message: 'Ingrese E-Mail'
                    }
                  ]}>
                  <Input style={{ width: '300px' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <Form.Item
                  label='Contraseña'
                  name='password'
                  rules={[
                    {
                      required: true,
                      message: 'Ingrese su contraseña'
                    }
                  ]}>
                  <Input type='password' style={{ width: '300px' }} />
                </Form.Item>
              </Col>
            </Row>
            {this.state.errorLogin && (
              <Row gutter={[24, 24]}>
                <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  <span style={{ color: 'red' }}>{formTexts.errorLoginEmailPassword}</span>
                </Col>
              </Row>
            )}
            <Row gutter={[24, 24]}>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <Form.Item>
                  {this.state.loading ? (
                    <Spin />
                  ) : (
                    <Button type='primary' htmlType='submit'>
                      Ingresar
                    </Button>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <span>Olvidé mi contraseña</span>
            </Row>
            {/* <Row gutter={[24, 24]}>
          <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
            <div ref={ this.reCaptchaRef } id="este-test"></div>
          </Col>
        </Row> */}
          </Form>
        )}

        {/* Inicio del formulario de verificación del código envia al celular */}
        {this.state.enabledVerificationForm && (
          <Form onFinish={this.handleVerificationWithPhoneNumber}>
            <Row gutter={[24, 24]}>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <Form.Item
                  label='Código de verificación'
                  name='verificationCode'
                  rules={[
                    {
                      required: true,
                      message: 'Ingrese el código de verificación'
                    }
                  ]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            {/* <Row gutter={[24, 24]}>
        <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
          <div ref={ this.reCaptchaRef } id="este-test"></div>
        </Col>
      </Row> */}
            {this.state.errorValidation && (
              <Row gutter={[24, 24]}>
                <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                  <span style={{ color: 'red' }}>Código de verificación invalido</span>
                </Col>
              </Row>
            )}
            <Row gutter={[24, 24]}>
              <Col span={24} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                <Form.Item>
                  <Button type='primary' htmlType='submit'>
                    Verificar
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    );
  }
}

export default injectIntl(UserLogin);
