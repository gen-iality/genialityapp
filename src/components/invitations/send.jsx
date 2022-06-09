import { Component } from 'react';
import { Redirect, Link, withRouter } from 'react-router-dom';
import Moment from 'moment';
import 'moment/locale/es-us';
import { EventsApi } from '../../helpers/request';
/* import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; */
import { FormattedMessage } from 'react-intl';
import Quill from 'react-quill';
import EviusReactQuill from '../shared/eviusReactQuill';
import { Button, Checkbox, Row, Col, Form, Input, Modal, Spin, Card, Typography } from 'antd';
Moment.locale('es-us');
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import { CalendarOutlined, FieldTimeOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '../../context/MessageService';
import ImageUploaderDragAndDrop from '../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import Loading from '../profile/loading';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class SendRsvp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvp: {},
      include_date: true,
      selection: [],
      showimgDefault: true,
      loading_image: false,
      isLoading: true,
    };
    this.submit = this.submit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
  }

  componentDidMount() {
    let default_header = ' Has sido invitado a: <br /> <span className="strong">' + this.props.event.name + '</span> ';
    this.setState({
      rsvp: {
        ...this.state.rsvp,
        content_header: default_header,
        subject: this.props.event.name,
        message: this.props.event.description,
        image: this.props.event.picture,
        image_header:
          this.props.event.styles && this.props.event.styles.banner_image_email
            ? this.props.event.styles.banner_image_email
            : this.props.event.styles.banner_image
            ? this.props.event.styles.banner_image
            : this.props.event.picture,
        image_footer:
          this.props.event.styles && this.props.event.styles.banner_footer
            ? this.props.event.styles.banner_footer
            : this.props.event.picture,
      },
      selection: this.props.selection === undefined ? 'Todos' : this.props.selection,
      isLoading: false,
    });
  }

  changeImg = (imageUrl) => {
    this.setState({
      rsvp: {
        ...this.state.rsvp,
        image: imageUrl,
      },
    });
  };

  changeImgHeader = (imageUrl) => {
    this.setState({
      rsvp: {
        ...this.state.rsvp,
        image_header: imageUrl,
      },
    });
  };

  changeImgFooter = (imageUrl) => {
    this.setState({
      rsvp: {
        ...this.state.rsvp,
        image_footer: imageUrl,
      },
    });
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({
      rsvp: { ...this.state.rsvp, [name]: value },
    });
  };

  QuillComplement2 = (content) =>
    this.setState({
      rsvp: { ...this.state.rsvp, message: content },
    });

  QuillComplement1 = (content) =>
    this.setState({
      rsvp: { ...this.state.rsvp, content_header: content },
    });

  async submit() {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se envíe la información...',
      action: 'show',
    });
    const { event } = this.props;
    const { rsvp, include_date, selection } = this.state;
    let users = [];
    if (selection === 'Todos') {
      users = 'all';
    } else {
      selection.map((item) => {
        return users.push(item._id);
      });
    }
    this.setState({ dataMail: users, disabled: true });
    try {
      let data;

      if (this.state.showimgDefault) {
        data = {
          content_header: rsvp.content_header,
          subject: rsvp.subject,
          message: rsvp.message,
          image_header: rsvp.image_header,
          image_footer: rsvp.image_footer,
          image: rsvp.image,
          eventUsersIds: users,
          include_date: include_date,
        };
      } else {
        data = {
          content_header: rsvp.content_header,
          subject: rsvp.subject,
          message: rsvp.message,
          image_header: rsvp.image_header,
          image_footer: rsvp.image_footer,
          eventUsersIds: users,
          include_date: include_date,
        };
      }

      /* console.log('Dataenviar', data); */
      await EventsApi.sendRsvp(JSON.stringify(data), event._id);
      this.setState({ disabled: false, redirect: true, url_redirect: '/eventadmin/' + event._id + '/messages' });
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'success',
        msj: 'Las notificaciones se mandaron de manera satisfactoria',
        action: 'show',
      });
    } catch (e) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: `Lo sentimos las notificaciones no pudieron ser enviadas, código de error ${e.response.status}`,
        action: 'show',
      });
      this.setState({ disabled: false, redirect: true, url_redirect: '/eventadmin/' + event._id + '/messages' });
    }
  }

  closeModal = () => {
    this.setState((prevState) => {
      return { modal: !prevState.modal };
    });
  };

  /*PLANTILLAS  en lenguaje MJML
    https://mjml.io/try-it-live/templates/austin
    https://mjml.io/try-it-live/templates/sphero-droids
    https://mjml.io/try-it-live/templates/ticketshop
    
    */

  onChangeDate(e) {
    this.setState({
      include_date: e.target.checked,
    });
  }

  render() {
    const { disabled, include_date, isLoading } = this.state;
    if (this.state.redirect) return <Redirect to={{ pathname: this.state.url_redirect }} />;
    return (
      <>
        <Form {...formLayout}>
          <Header
            title={'Detalle de la comunicación'}
            back
            form
            save
            saveMethod={() => this.setState({ modal: true })}
            saveName={'Enviar'}
          />

          <Row justify='center' wrap gutter={8}>
            {isLoading ? (
              <Loading />
            ) : (
              <Col span={14}>
                <Form.Item label={`Asunto del correo (Por defecto será el nombre del curso)`}>
                  <Input
                    name={'subject'}
                    placeholder={'Escribe aquí el asunto del correo'}
                    onChange={(e) => this.handleChange(e)}
                    value={this.state.rsvp.subject}
                  />
                </Form.Item>

                <Form.Item>
                  <label>
                    Sube una imagen <br /> <small>(Por defecto será la imagen del banner)</small>
                  </label>

                  <ImageUploaderDragAndDrop
                    imageDataCallBack={(imageUrl) => this.changeImgHeader(imageUrl)}
                    imageUrl={this.state.rsvp?.image_header}
                    width='1080'
                    height='1080'
                  />
                </Form.Item>

                <Form.Item label={'Cabecera del correo'}>
                  <EviusReactQuill
                    name='content_header'
                    data={this.state.rsvp.content_header}
                    handleChange={(e) => this.QuillComplement1(e)}
                  />
                  {/* <Quill value={this.state.rsvp.content_header} onChange={this.QuillComplement1} name='content_header' /> */}
                </Form.Item>

                <Form.Item label={'Específicar fecha del curso'}>
                  <Checkbox style={{ marginRight: '2%' }} defaultChecked={include_date} onChange={this.onChangeDate} />
                </Form.Item>

                {include_date && (
                  <Row gutter={[8, 8]} wrap>
                    <Col span={12}>
                      <p>
                        {' '}
                        <CalendarOutlined /> Fecha inicio
                      </p>
                      <p className='date'>{Moment(this.props.event.datetime_from).format('DD MMM YYYY')}</p>
                    </Col>
                    <Col span={12}>
                      <p>
                        {' '}
                        <FieldTimeOutlined /> Hora
                      </p>
                      <p className='date'>{Moment(this.props.event.datetime_from).format('HH:mm')}</p>
                    </Col>
                    <Col span={12}>
                      <p>
                        {' '}
                        <CalendarOutlined /> Fecha fin
                      </p>
                      <p className='date'>{Moment(this.props.event.datetime_to).format('DD MMM YYYY')}</p>
                    </Col>
                    <Col span={12}>
                      <p>
                        {' '}
                        <FieldTimeOutlined /> Hora
                      </p>
                      <p className='date'>{Moment(this.props.event.datetime_to).format('HH:mm')}</p>
                    </Col>
                  </Row>
                )}
                <Row justify='center'>
                  <Col>
                    <EnvironmentOutlined />
                    Ubicación del curso
                    <br />
                    <span className='rsvp-location'>
                      {this.props.event.location !== null && this.props.event.location.FormattedAddress}
                    </span>
                  </Col>
                </Row>
                <Form.Item>
                  <label>
                    Sube una imagen <br /> <small>(Por defecto será la del curso)</small>
                  </label>

                  <Row style={{ margin: 10 }}>
                    {!this.state.showimgDefault ? (
                      <Button onClick={() => this.setState({ showimgDefault: true })} type='success'>
                        Mostrar imagen por defecto
                      </Button>
                    ) : (
                      <Button onClick={() => this.setState({ showimgDefault: false })} danger>
                        Quitar imagen por defecto
                      </Button>
                    )}
                  </Row>

                  {this.state.showimgDefault && (
                    <ImageUploaderDragAndDrop
                      imageDataCallBack={(imageUrl) => this.changeImg(imageUrl)}
                      imageUrl={this.state.rsvp?.image}
                      width='1080'
                      height='1080'
                    />
                  )}
                </Form.Item>

                <Form.Item label={'Cuerpo de la invitación (Por defecto será la descripción del curso)'}>
                  <EviusReactQuill
                    name='message'
                    data={this.state.rsvp.message}
                    handleChange={(e) => this.QuillComplement2(e)}
                  />
                  {/* <Quill value={this.state.rsvp.message} onChange={this.QuillComplement2} name='message' /> */}
                </Form.Item>

                <Form.Item>
                  <label>
                    Sube una imagen <br />{' '}
                    <small>
                      (Por defecto será la imagen footer del curso o la image del organizador, la que este disponible)
                    </small>
                  </label>
                  <ImageUploaderDragAndDrop
                    imageDataCallBack={(imageUrl) => this.changeImgFooter(imageUrl)}
                    imageUrl={this.state.rsvp?.image_footer}
                    width='1080'
                    height='1080'
                  />
                </Form.Item>

                <Card>
                  <Row gutter={[8, 8]} wrap justify='center'>
                    <Col span={24}>
                      <Typography.Paragraph>
                        Seleccionados{' '}
                        <span>{this.state.selection === 'Todos' ? 'Todos' : this.state.selection.length}</span>
                      </Typography.Paragraph>
                    </Col>
                    <Typography.Paragraph>
                      {this.state.selection === 'Todos'
                        ? null
                        : this.state.selection?.map((el) => {
                            return el.properties.email + ', ';
                          })}
                    </Typography.Paragraph>
                  </Row>
                  <Row gutter={8} wrap>
                    {this.state.selection === 'Todos' ? (
                      <p>{this.state.selection}</p>
                    ) : (
                      this.state.selection?.map((item, key) => {
                        return (
                          <p key={key} className='selection'>
                            {item.email}
                          </p>
                        );
                      })
                    )}
                  </Row>
                  <Row justify='center' gutter={8} wrap>
                    <Link to={{ pathname: `${this.props.matchUrl}` }}>
                      <Button type='primary'>Editar seleccionados</Button>
                    </Link>
                  </Row>
                </Card>
              </Col>
            )}
          </Row>
          <Modal
            visible={this.state.modal}
            onCancel={this.closeModal}
            title={'Confirmación'}
            onOk={this.submit}
            okButtonProps={{ disabled: this.state.disabled }}
            confirmLoading={this.state.disabled}
            cancelText={'Cancelar'}
            okText={'Enviar'}>
            <p>
              Se van a enviar {this.state.selection === 'Todos' ? 'a todos las' : this.state.selection.length}{' '}
              {this.state.selection?.length === 1 ? 'invitación' : 'invitaciones'}
            </p>
          </Modal>
          <BackTop />
        </Form>
      </>
    );
  }
}

export default withRouter(SendRsvp);
