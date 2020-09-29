import React, { Component } from 'react'
import { app } from "../../../helpers/firebase";
import * as Cookie from "js-cookie";
import UserLogin from '../UserLogin'
import FormTags from "./constants";

class UserLoginContainer extends Component  {
  
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
      enabledFormLoginWithEmailPass: true, //Controla la visibilidad del formulario de login con email y password
      enabledFormLoginWithPhone: false, //Controla la visibilidad del formulario de login a través del movil
      enabledFormVerification: false, // Controla la visibilidad del formulario para ingresar código enviado al movil
      enabledFormRecoveryPass: false, // Controla la visibilidad del formulario para recuperar la contraseña
      errorLogin: false, 
      errorValidation: false,
      eventId: this.props.eventId
    };
  }

  async componentDidMount(){
    const {eventId} = this.state

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

   //Método ejecutado en el evento onSubmit (onFinish) del formulario de login
   handleLoginEmailPassword = async (values) => {
    this.setState({loading: true})
    await this.loginEmailPassword(values)
    setTimeout(()=>{
      this.setState({loading: false})      
    },3000)
  }

  //Realiza la validación del email y password con firebase  
  loginEmailPassword = (data) => {
    this.setState({errorLogin: false })
    app.auth().signInWithEmailAndPassword(data.email, data.password)
    // .then(response => console.log('response login', response))
    .catch(()=>{
      console.error('Error: Email or password invalid')
      this.setState({errorLogin: true })
      this.setState({loading: false})
    });
  }
  
  //Se ejecuta en caso que haya un error en el formulario de login en el evento onSubmit
  onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };
  
  handleOpenRecoveryPass = () => {
    this.setState({loading: true, enabledFormLoginWithEmailPass: false,})
    setTimeout(()=>{
      this.setState({        
        enabledFormRecoveryPass: true,
        loading: false
      })
    },500)
  }

  handleCloseRecoveryPass = () => {
    this.setState({loading: true, enabledFormRecoveryPass: false})
    setTimeout(()=>{
      this.setState({        
        enabledFormLoginWithEmailPass: true,
        loading: false
      })
    },500)
  }
  
  render(){

    const {
      eventId,
      errorLogin,
      loading,
      enabledFormLoginWithEmailPass,
      enabledFormRecoveryPass      
    } = this.state

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
      />
    )  
  }
} 
export default UserLoginContainer