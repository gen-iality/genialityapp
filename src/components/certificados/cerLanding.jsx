import React, { Component } from 'react';
import Moment from 'moment';
import { firestore } from '../../helpers/firebase';
import { CertsApi, RolAttApi } from '../../helpers/request';
import { Button, Card, Col, Alert, Modal, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';
import withContext from '../../Context/withContext';

// Estructura de boton para descargar certificados

const IconText = ({ icon, text, onSubmit }) => (
  <Button htmlType='submit' type='primary' onClick={onSubmit}>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </Button>
);

class CertificadoLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [
        { tag: 'event.name', label: 'Nombre del Evento', value: 'name' },
        { tag: 'event.start', label: 'Fecha Inicio del Evento', value: 'datetime_from' },
        { tag: 'event.end', label: 'Fecha Fin del Evento', value: 'datetime_to' },
        { tag: 'event.venue', label: 'Lugar del Evento', value: 'venue' },
        { tag: 'event.address', label: 'Dirección del Evento', value: 'location.FormattedAddress' },
        { tag: 'user.names', label: 'Nombre(s) de asistente', value: 'names' },
        { tag: 'user.email', label: 'Correo de asistente', value: 'email' },
        { tag: 'ticket.name', label: 'Nombre del tiquete', value: 'ticket.title' },
        { tag: 'rol.name', label: 'Nombre del Rol' },
      ],
      disabled: true,
      toSearch: '',
      dataUser: [],
      message: false,
    };
    this.usersRef = '';
    this.generateCert = this.generateCert.bind(this);
    this.searchCert = this.searchCert.bind(this);
  }

  componentDidMount() {
    const { user_properties } = this.props.cEvent.value;

    let fields = user_properties.filter((item) => item.name !== 'names' && item.name !== 'email');
    const list = [...this.state.tags];
    fields.map((field) =>
      list.push({
        tag: `user.${field.name}`,
        value: field.name,
        label: field.label,
      })
    );

    this.usersRef = firestore.collection(`${this.props.cEvent.value._id}_event_attendees`);
    this.setState({ tags: list });
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentUser !== prevProps.currentUser) {
      this.searchCert(this.props.usuarioRegistrado);
    }
  }

  onChange = (e) => {
    const { value } = e.target;
    this.setState({ toSearch: value, disabled: !(value.length > 0), message: false, dataUser: {} });
  };

  async searchCert(e) {
    try {
      const valueToSearch = e;
      const modal = Modal.success({
        title: 'Buscando usuario para: ${ valueToSearch }',
        content: <Spin>Espera</Spin>,
      });

      //Busca por cedula primero
      let record = await this.usersRef.where('properties.cedula', '==', valueToSearch.trim()).get();
      //Si no encuentra busca por email
      if (record.docs.length <= 0)
        record = await this.usersRef.where('properties.email', '==', valueToSearch.trim()).get();
      //Si encuentra sigue secuencia
      modal.destroy();
      if (record.docs.length > 0) {
        const dataUser = record.docs.map((doc) => {
          const data = doc.data();
          data.ticket = data.ticket_id
            ? this.props.cEvent.value.tickets.find((ticket) => ticket._id === data.ticket_id).title
            : 'Sin Tiquete';
          return data;
        });
        //Para generar el certificado el usuario tiene que estar checkqueado !!checked_in
        //if(!dataUser.checked_in) this.setState({message:'Usuario no checkeado'});

        this.setState({ dataUser });
      } else {
        this.setState({ message: 'No se encontraron certificados para este documento' });
      }
    } catch (error) {
      error;
    }
  }

  async generateCert(dataUser) {
    const modal = Modal.success({
      title: 'Generando certificado',
      content: <Spin>Espera</Spin>,
    });

    const certs = await CertsApi.byEvent(this.props.cEvent.value._id);
    const roles = await RolAttApi.byEvent(this.props.cEvent.value._id);
    this.props.cEvent.value.datetime_from = Moment(this.props.cEvent.value.datetime_from).format('DD/MM/YYYY');
    this.props.cEvent.value.datetime_to = Moment(this.props.cEvent.value.datetime_to).format('DD/MM/YYYY');
    //Por defecto se trae el certificado sin rol
    let rolCert = certs.find((cert) => !cert.rol_id);
    //Si el asistente tiene rol_id y este corresponde con uno de los roles attendees, encuentra el certificado ligado
    if (dataUser.rol_id && roles.find((rol) => rol._id === dataUser.rol_id))
      rolCert = certs.find((cert) => cert.rol_id === dataUser.rol_id);
    let content = rolCert.content;
    this.state.tags.map((item) => {
      let value;
      if (item.tag.includes('event.')) value = this.props.cEvent.value[item.value];
      else if (item.tag.includes('ticket.')) value = dataUser.ticket;
      else if (item.tag.includes('rol.')) {
        if (dataUser.rol_id && roles.find((ticket) => ticket._id === dataUser.rol_id))
          value = roles.find((ticket) => ticket._id === dataUser.rol_id).name.toUpperCase();
        else value = 'ASISTENTE';
      } else value = dataUser.properties[item.value];
      return (content = content.replace(`[${item.tag}]`, value));
    });
    const body = { content, image: rolCert.background };
    const file = await CertsApi.generateCert(body);
    const blob = new Blob([file.blob], { type: file.type, charset: 'UTF-8' });
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob);
      return;
    }
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.dataType = 'json';
    link.href = data;
    link.download = 'certificado.pdf';
    link.dispatchEvent(new MouseEvent('click'));
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      modal.destroy();
    }, 60);
  }

  render() {
    let checkedInUsers = this.props.cEventUser.value ? [this.props.cEventUser.value] : [];

    return (
      <>
        {this.props.cUser.value && this.props.cUser.value._id && checkedInUsers && checkedInUsers.length > 0 && (
          <Col xs={22} sm={22} md={8} lg={8} xl={8} style={{ margin: '0 auto' }}>
            <Card>
              {/* Alert informativo de certificados disponibles */}
              {this.props.cUser.value.rol_id == '619d0c9161162b7bd16fcb82' ||
              this.props.cUser.value.rol_id == '619d0c8a4c361c44e83f4312' ? (
                <>
                  <Alert message='Certificados disponibles' type='success' />
                  {checkedInUsers.map((user, key) => (
                    <div key={key}>
                      <br />
                      {/* Nombre de evento */}

                      {/* Importacion del boton para descargar certificado */}
                      <IconText
                        text='Descargar Certificado'
                        icon={DownloadOutlined}
                        onSubmit={() => this.generateCert(user)}
                      />
                      <br />
                    </div>
                  ))}
                </>
              ) : (
                <h1
                  style={{
                    fontSize: '27px',
                  }}>{`Hola ${this.props.cUser.value.displayName} 👋, los certificados solo estan Disponibles para usuarios Universo y Super Heróe  `}</h1>
              )}
            </Card>
          </Col>
        )}

        {!this.props.cUser.value ||
          (!this.props.cUser.value._id && <p>Debes ingresar con tu usuario para descargar el certificado</p>)}

        {this.props.cUser.value && this.props.cUser.value._id && checkedInUsers && checkedInUsers.length <= 0 && (
          <h1
            style={{
              justifyContent: 'center',
              fontSize: '27px',
              alignItems: 'center',
              display: 'flex',
              fontWeight: 'bold',
            }}>
            Debes estar registrado en el evento para poder descargar tu certificado{' '}
          </h1>
        )}

        {this.props.cUser.value && this.props.cUser.value._id && checkedInUsers && checkedInUsers.length <= 0 && (
          <h1 style={{ justifyContent: 'center', fontSize: '27px', alignItems: 'center', display: 'flex' }}>
            Debes Haber asistido para descargar el certificado
          </h1>
        )}
      </>
    );
  }
}

let CertificadoLandingwithContext = withContext(CertificadoLanding);
export default withRouter(CertificadoLandingwithContext);
