import React, { Component } from 'react'
import { Form, Input, Col, Row, Button } from "antd";
import { app } from "../../../helpers/firebase";
import * as Cookie from "js-cookie";
import { parseUrl } from "../../../helpers/constants";
import privateInstance,{ Actions } from "../../../helpers/request";

class UserLogin extends Component {

  constructor( props ) {
    super( props );
    this.reCaptchaRef = React.createRef();
    this.state = {
      user: {},
      emailError: false,
      valid: true,
      extraFields: [],
      loading: true,
      initialValues: {},
      eventUsers: [],
      registeredUser: false,
      submittedForm: false,
      successMessage: null,
      refreshToken: null
    };
  }  

  async componentDidMount (){
    this.initializeCaptcha();
    
    
    await app.auth().onAuthStateChanged((user) => {
      fetch(`https://api.evius.co/api/user/loginorcreatefromtoken?refresh_token=${user.refreshToken}`,{redirect:"manual"}).then((response)=>{
        console.log('Response in component did mount',response)
        return response
      })
      .then( data => {
        console.log(data.body)
      })
    })
    
  }
  
  componentDidUpdate ( prevProps, prevState ) {
    let { loading } = this.state;

    if ( prevState.loading !== loading )
      if ( !loading )
        // Inicializa el captcha para la autenticacion por SMS
        this.initializeCaptcha();

    // if (prevState.refreshToken !== this.state.refreshToken){
    //   console.log('cambió el refresh token')
    // }    
  }

  initializeCaptcha = () => {
    let { initialValues } = this.state;

    if ( Object.entries( initialValues ).length == 0 ) {
      console.log( "this.reCaptchaRef:", this.reCaptchaRef, this.reCaptchaRef.current, this.reCaptchaRef.current.id );
      window.recaptchaVerifier = new app.auth.RecaptchaVerifier( this.reCaptchaRef.current.id, {
        size: "normal",
        callback: function ( response ) {
          console.log( "response,", response );
        },
        "expired-callback": function () {
          console.log( "response callback expired" );
        },
      } );

      window.recaptchaVerifier.render().then( function ( widgetId ) {
        window.recaptchaWidgetId = widgetId;
      } );
    }
  };

  handleLogin = ( values ) => {
    var appVerifier = window.recaptchaVerifier;
    let phone = `+57${ values.phone }`;
        
    app
    .auth()
    .signInWithPhoneNumber( phone, appVerifier )
    .then( function ( confirmationResult ) {
      window.confirmationResult = confirmationResult;
      console.log( "confirmationResult:", confirmationResult );
    })
    .catch( function ( error ) {
      console.log( "error:", error );
    });
  };

  handleVerification(values){

    var credential = app.auth.PhoneAuthProvider.credential(window.confirmationResult.verificationId, values.verificationCode);
    app.auth().signInWithCredential(credential)
    .then(response=>console.log('response',response))
    // window.confirmationResult.confirm(values.verificationCode)
    // .then(function (result) {
    //   const user = result.user;
    //   return  user.refreshToken
      
    //   //window.localStorage.setItem('refresh_token', user.refreshToken)
    // })
    // .then((refreshToken)=>{
    //   this.setState({refreshToken: refreshToken})
    //   console.log('*********************refreshtoken',refreshToken)
    // })    
    // .catch(function (error) {
    //  console.error(error)
    // });
  }

  
  render(){

    return (
  <div style={{background: '#ffffff', padding: '50px', width: '450px', borderRadius: '15px', margin: 'auto'}}>
    <Form onFinish={this.handleLogin}>
      {/* <Row gutter={[24, 24]}>
        <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
          <Form.Item
              label="E-Mail"
              name="email"
              rules={[
              {
                  required: true,
                  message: 'Ingrese su E-Mail',
              },
              ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row> */}
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
          <Form.Item
              label="Celular"
              name="phone"
              rules={[
              {
                  required: true,
                  message: 'Ingrese número de celular',
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

<Form onFinish={this.handleVerification}>
<Row gutter={[24, 24]}>
  <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
    <Form.Item
        label="Código de verificación"
        name="verificationCode"
        rules={[
        {
            required: true,
            message: 'Ingrese el código de verificación',
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
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Verificar
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
    </div>
      )
  }
}

export default UserLogin;
