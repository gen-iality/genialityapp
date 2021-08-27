import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MessageUser from './messageUser';
import EmailPrev from './emailPreview';
import API from '../../helpers/request';

class InvitationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      users:[]
    };
    console.log("PROPS==>",props)
  }
  

  componentDidMount(){
    let eventId=this.props.event._id;
    let idEnvio=this.props.match.params.id;
    console.log("ID ENVIO==>",idEnvio)
    if(eventId && idEnvio){
      getData().then((data)=>{
        this.setState({users:data})  
      })
          
    }
      function getData(){
        return new Promise((resolve, reject) => {
          API.get(`/api/events/${eventId}/message/${idEnvio}/messageUser`)
            .then(({ data }) => { 
              //PERMITE ORDENAR LOS MAILS
              const ordersMails = [
                "Delivery",
                "Open" ,
                "Click" ,
                "Send" ,
                "Complaint",
                 "Bounce"              
             ];
             console.log("RESP==>",data.data)
              let respOrder;
              if(data && data.data){
               respOrder= data.data.sort((a,b)=>ordersMails.indexOf(a.status)-ordersMails.indexOf(b.status))
              } 

              console.log("RESPORDER==>", respOrder)                  
              resolve(respOrder);
            })
            .catch((e) => {
              reject(e);
            });
        });
      }
    }

  close = () => {
    this.props.history.goBack();
  };

  render() {
    const { item } = this.props.location.state;
    const {users}=this.state  
    const layout = [
    users.length>0 && <MessageUser key='users' users={users.length>0 && users} />,
      <EmailPrev key='email' event={this.props.event} item={item} />,
    ];
    return (
      <React.Fragment>
        <nav className='tabs' aria-label='breadcrumbs'>
          <ul>
            <li onClick={this.close}>
              <a>
                <span className='icon is-medium'>
                  <i className='far fa-arrow-left fas fa-lg' />
                </span>
              </a>
            </li>
            <li
              className={`${this.state.step === 0 ? 'is-active' : ''}`}
              onClick={() => {
                this.setState({ step: 0 });
              }}>
              <a>Reporte Envios</a>
            </li>
            <li
              className={`${this.state.step === 1 ? 'is-active' : ''}`}
              onClick={() => {
                this.setState({ step: 1 });
              }}>
              <a>Mensaje Enviado</a>
            </li>
          </ul>
        </nav>
        {layout[this.state.step]}
      </React.Fragment>
    );
  }
}

export default withRouter(InvitationDetail);
