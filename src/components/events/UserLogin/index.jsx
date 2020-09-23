import React, { Component } from 'react'
import { Form, Input, Col, Row, Button, Spin, Card } from "antd";
import { app } from "../../../helpers/firebase";
import * as Cookie from "js-cookie";
import FormTags from "./constants";

const textLeft = {
  textAlign: "left",
};


class UserLogin extends Component {

  constructor( props ) {
    super( props );
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
      formTexts: FormTags('login'),
      email:null,
      password:null,
      errortemporal:null,
    };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


    
  } 
  
  
  handleChange1(event) {
    this.setState({email: event.target.value});
  }
  handleChange2(event) {
    this.setState({password: event.target.value});
  }

  async handleSubmit(event) {
    console.log("UN CLICK asdf");
    event.preventDefault();
    
    let data = {email:this.state.email,password:this.state.password}
    await this.loginEmailPassword(data);
    event.preventDefault();   
  }

  async componentDidMount(){
    const {eventId} = this.props

    //this.initializeCaptcha();    
    
    await app.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(async function (idToken) {
          if(idToken){
            Cookie.set("evius_token", idToken); 
            setTimeout(function () {
              window.location.replace(`/landing/${eventId}?token=${idToken}`);
            }, 1000);
          }
        })
      }
    })
  }
  
  componentDidUpdate ( prevProps, prevState ) {
    let { loading } = this.state;

    if ( prevState.loading !== loading ){
      if ( !loading ){
        // Inicializa el captcha para la autenticacion por SMS
        //this.initializeCaptcha();
      }
    }
  }    
 
  initializeCaptcha = () => {
    let { initialValues } = this.state;
    if ( Object.entries( initialValues ).length == 0 ) {
      //console.log( "this.reCaptchaRef:", this.reCaptchaRef, this.reCaptchaRef.current, this.reCaptchaRef.current.id );
      window.recaptchaVerifier = new app.auth.RecaptchaVerifier( this.reCaptchaRef.current.id, {
        size: "invisible",
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

  handleLoginWithPhoneNumber = ( values ) => {

    
    
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
    //   console.log( "confirmationResult:", confirmationResult );
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
    //console.log('Start signInWithEmailAndPassword...', data)
    this.setState({errorLogin: false })
    const respuesta = app.auth().signInWithEmailAndPassword(data.email, data.password)
    .then(response => console.log('response login', response))
    .catch((e)=>{
      console.error('Error: Email or password invalid')
      this.setState({errorLogin: true })
      this.setState({loading: false})
      this.setState({errortemporal:e.message});
    });
    //console.log('repuesta', respuesta)
  }
  
  handleLoginEmailPassword = async (values) => {
    console.log('Start Login........')
    //console.log('handles',values)
    // Cookie.remove("token");
    // Cookie.remove("evius_token");
    // window.indexedDB.deleteDatabase('firebaseLocalStorageDb')
    // window.indexedDB.deleteDatabase('firestore/[DEFAULT]/eviusauth/main')
    this.setState({loading: true})
    await this.loginEmailPassword(values)
    setTimeout(()=>{
      this.setState({loading: false})      
    },3000)
  }

  handleVerificationWithPhoneNumber= (values) =>{
    this.setState({loading: false})
    var credential = app.auth.PhoneAuthProvider.credential(window.confirmationResult.verificationId, values.verificationCode);
    app.auth().signInWithCredential(credential)
    .then(response=>{
      console.log('response',response)
      this.setState({ errorValidation: false})
    })
    .catch(err=>{
      console.log('upps hubo un error')
      this.setState({ errorValidation: true})
    })
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

  onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  
  render(){
    const {formTexts} = this.state
    return (
    //<div style={{background: '#ffffff', padding: '50px', width: '450px', borderRadius: '15px', margin: 'auto'}}>
    <Card title={formTexts.titleForm} bodyStyle={textLeft}>
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




    {this.state.enabledLoginForm &&
<>
<form onSubmit={this.handleSubmit}>
<Row gutter={[24, 24]}>
          <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
          <Form.Item
              label="E-Mail"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Ingrese E-Mail',
                },
              ]}
              >
                <input type="text" value={this.state.value} onChange={this.handleChange1} />
            </Form.Item>            
          </Col>
</Row>
<Row gutter={[24, 24]}>
          <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
          <Form.Item
              label="Contraseña"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Ingrese su contraseña',
                  
                },
              ]}
              >
                <input type="password" value={this.state.value} onChange={this.handleChange2} />
            </Form.Item>           
          </Col>
</Row>
<Row gutter={[24, 24]}>
          <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
              {this.state.errortemporal }
          </Col>
        </Row>
<Row gutter={[24, 24]}>
          <Col span={24} style={{ display: "inline-flex", justifyContent: "center" }}>
            <Form.Item>
            {this.state.loading ?  <Spin /> : (
              <input type="submit" value="Ingresar" ></input>
            )}
            </Form.Item>
          </Col>
        </Row>



</form>

<br/>
<br/>
<br/><br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
</>
    }


{this.state.enabledLoginForm &&

<form onSubmit={this.handleSubmit}>
<input type="text" value={this.state.email} onChange={this.handleChange1} />
<input type="password" value={this.state.password} onChange={this.handleChange2} />

<input type="submit" value="Ingresar"></input>
</form>

    }


    </Card>
    )
  }
}

export default UserLogin;
