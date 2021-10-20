import React, { Component } from 'react';
import ImageInput from '../shared/imageInput';
import axios from 'axios/index';
import { toast } from 'react-toastify';
import { Actions, OrganizationApi } from '../../helpers/request';
import { FormattedMessage } from 'react-intl';
import LogOut from '../shared/logOut';
import { SketchPicker } from 'react-color';
import { Button, Card, message, Typography, Modal, Space, Row, Col, Form, Input, Tag, Select } from 'antd';
import ReactQuill from 'react-quill';
import { toolbarEditor } from '../../helpers/constants';
import Header from '../../antdComponents/Header';

const { Title, Text } = Typography;
const { Option } = Select;
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

class Styles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: this.props.eventId,
      loading: true,
      styles: {},
      isLoading: false,
      editIsVisible: false,
      //Se realizan estas constantes para optimizar mas el codigo,de esta manera se mapea en el markup para utilizarlo posteriormente
      colorDrawer: [
        {
          title: `Color de fondo para ${this.props.org?._id ? 'la organización' : 'el evento'}`,
          description: 'Si escoges luego una imagen de fondo, esa imagen reemplazara este color.',
          fieldColorName: 'containerBgColor',
          editIsVisible: false,
        },
        {
          title: 'Color de fondo para el menu',
          fieldColorName: 'toolbarDefaultBg',
          editIsVisible: false,
        },
        // {
        //   title: 'Color de fondo para la zona social ',
        //   fieldColorName: 'toolbarMenuSocial',
        //   editIsVisible: false,
        // },
        {
          title: 'Color del texto para el menu',
          fieldColorName: 'textMenu',
          editIsVisible: false,
        },
        // {
        //   title: 'Elige un color para los botones',
        //   fieldColorName: 'bgButtonsEvent',
        //   editIsVisible: false,
        // },
        // {
        //   title: 'Elige un color para seleccion de fecha de la agenda',
        //   fieldColorName: 'bgCalendarDayEvent',
        //   editIsVisible: false,
        // },
        // {
        //   title: 'Color del texto de los tabs de fechas de la agenda',
        //   fieldColorName: 'color_tab_agenda',
        //   editIsVisible: false,
        // },
        // {
        //   title: 'Color de los iconos para la zona social',
        //   fieldColorName: 'color_icon_socialzone',
        //   editIsVisible: false,
        // },
        /*                 
                {
                  title: "Elige un color para los botones",
                  fieldColorName: "brandPrimary",
                  editIsVisible: false,
                },
        
               {
                  title: "Elige un color para el texto del menu",
                  fieldColorName: "textMenu",
                  editIsVisible: false,
                },
                {
                  title: "Elige un color para item seleccionado del menu",
                  fieldColorName: "activeText",
                  editIsVisible: false,
                }, */
      ],
    };
    //Se establecen las funciones para su posterior uso
    this.saveEventImage = this.saveEventImage.bind(this);
    this.getDataLoaderPage = this.getDataLoaderPage.bind(this);
    this.submit = this.submit.bind(this);

    this.imageDrawer = [
      {
        title: 'Elige una imagen para el banner superior en desktop: (Tamaño recomendado 1920x540)',
        description:
        `Por defecto en el baner superior se muestra la imagen prinicpal ${this.props.org?._id ? 'de la organización' : 'del evento'} aqui la puedes cambiar`,
        imageFieldName: 'banner_image',
        button: 'Eliminar banner superior',
        width: 1920,
        height: 540,
      },
      {
        title: 'Elige una imagen para el banner del email: (Tamaño recomendado 600x280)',
        description: 'Por defecto se reduce la imagen automaticamente del banner superior',
        imageFieldName: 'banner_image_email',
        button: 'Eliminar banner de email',
        width: 320,
        height: 180,
      },
      {
        title:
          'Elige una imagen para el banner en mobile (opcional en caso de no observar bien el banner superior en celular): (Tamaño recomendado 1080x556)',
        imageFieldName: 'mobile_banner',
        button: 'eliminar banner en mobile',
        width: 1080,
        height: 556,
      },
      {
        title: 'Elige una imagen(textura) para el fondo: (Tamaño recomendado 1920x2160)',
        imageFieldName: 'BackgroundImage',
        button: 'Eliminar textura de fondo',
        width: 1920,
        height: 2160,
      },
      {
        title: 'Elige una imagen para tu logo: (Tamaño recomendado 320x180)',
        imageFieldName: 'event_image',
        button: 'Eliminar Logo',
        width: 320,
        height: 180,
      },
      {
        title: `Elige una imagen para el footer ${this.props.org?._id ? 'de la organización' : 'del evento'}: (Tamaño recomendado 1920x280)`,
        imageFieldName: 'banner_footer',
        button: 'Eliminar pie de pagina',
        width: 1920,
        height: 280,
      },
      {
        title: 'Elige una imagen para el footer del email: (Tamaño recomendado 600x220)',
        description: `Por defecto se reduce la imagen automaticamente del footer ${this.props.org?._id ? 'de la organización' : 'del evento'}`,
        imageFieldName: 'banner_footer_email',
        button: 'Eliminar pie de pagina de email',
        width: 600,
        height: 220,
      },
      //{ title: "Elige una imagen de encabezado de menu", imageFieldName: "menu_image" },
    ];
    this.selectsDrawer = [
      // {
      //   label: 'Introduccion de inicio',
      //   defaultValue: 'no',
      //   name: 'loader_page',
      //   options: [
      //     {
      //       label: 'No',
      //       value: 'no',
      //     },
      //     {
      //       label: 'Video',
      //       value: 'text',
      //     },
      //     {
      //       label: 'Texto / Imagen',
      //       value: 'code',
      //     },
      //   ],
      // },
      {
        label: 'Franja de titulo  y fecha',
        defaultValue: false,
        name: 'show_title',
        options: [
          {
            label: 'Si',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
          
        ],
      },
      {
        label: 'Mostrar widget de videos grabados',
        defaultValue: false,
        name: 'show_video_widget',
        options: [
          {
            label: 'Si',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
          
        ],
      },
      {
        label: 'Habilitar banner Superior',
        name: 'show_banner',
        defaultValue: 'true',
        options: [
          {
            label: 'Si',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ],
      },
      {
        label: 'Habilitar Informacíon sobre el banner superior',
        name: 'show_card_banner',
        defaultValue: false,
        options: [
          {
            label: 'Si',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ],
      },
      // {
      //   label: 'Habilitar inscripción de agenda',
      //   name: 'show_inscription',
      //   defaultValue: 'true',
      //   options: [
      //     {
      //       label: 'Si',
      //       value: true,
      //     },
      //     {
      //       label: 'No',
      //       value: false,
      //     },
      //   ],
      // },
      {
        label: 'Agrupar la actividades de la agenda en TABS ',
        name: 'hideDatesAgenda',
        defaultValue: false,
        options: [
          {
            label: 'Si',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ],
      },
      {
        label: 'Ocultar fechas de las actividades de la agenda',
        name: 'hideDatesAgendaItem',
        defaultValue: false,
        options: [
          {
            label: 'Si',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ],
      },
      // {
      //   label: 'Ocultar horas de las actividades de la agenda',
      //   name: 'hideHoursAgenda',
      //   defaultValue: false,
      //   options: [
      //     {
      //       label: 'Si',
      //       value: true,
      //     },
      //     {
      //       label: 'No',
      //       value: false,
      //     },
      //   ],
      // },
      {
        label: 'Mostrar boton de detalle de la agenda',
        name: 'hideBtnDetailAgenda',
        defaultValue: false,
        options: [
          {
            label: 'Si',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ],
      },
    ];
  }
  //Se consulta la api para traer los datos ya guardados y enviarlos al state
  async componentDidMount() {
    const thereIsAnOrganization = this.props.org?._id
    let dataStyles
    let info

    if(thereIsAnOrganization){
      dataStyles = this.props.org?.styles ? this.props.org.styles : {}
    }else{
      info = await Actions.getAll(`/api/events/${this.props.eventId}`);
     dataStyles = info.styles ? info.styles : {};
    }
    
      if (dataStyles) {
      this.setState({
        styles: {
          brandPrimary: dataStyles.brandPrimary || '#FFFFFF',
          brandSuccess: dataStyles.brandSuccess || '#FFFFFF',
          brandInfo: dataStyles.brandInfo || '#FFFFFF',
          brandDanger: dataStyles.brandDanger || '#FFFFFF',
          containerBgColor: dataStyles.containerBgColor || '#FFFFFF',
          brandWarning: dataStyles.brandWarning || '#FFFFFF',
          toolbarDefaultBg: dataStyles.toolbarDefaultBg || '#FFFFFF',
          brandDark: dataStyles.brandDark || '#FFFFFF',
          brandLight: dataStyles.brandLight || '#FFFFFF',
          textMenu: dataStyles.textMenu || '#000000',
          toolbarMenuSocial: dataStyles.toolbarMenuSocial || '#FFFFFF',
          activeText: dataStyles.activeText || '#FFFFFF',
          bgButtonsEvent: dataStyles.bgButtonsEvent || '#FFFFFF',
          // color de los iconos del menu derecho
          color_icon_socialzone: dataStyles.color_icon_socialzone || '#000000',
          color_tab_agenda: dataStyles.color_tab_agenda || '#000000',
          // bgCalendarDayEvent: info.style.bgCalendarDayEvent || "#FFFFFF",
          event_image: dataStyles.event_image || null,
          banner_image: dataStyles.banner_image || null,
          banner_image_email: dataStyles.banner_image_email || null,
          menu_image: dataStyles.menu_image || null,
          BackgroundImage: dataStyles.BackgroundImage || null,
          FooterImage: dataStyles.FooterImage || null,
          banner_footer: dataStyles.banner_footer || null,
          mobile_banner: dataStyles.mobile_banner || null,
          banner_footer_email: dataStyles.banner_footer_email || null,
          show_banner: dataStyles.show_banner || false,
          show_title: dataStyles?.show_title  || false,
          show_video_widget: dataStyles?.show_video_widget  || false,
          show_card_banner: dataStyles.show_card_banner || true,
          show_inscription: info?.show_inscription || false,
          hideDatesAgenda: dataStyles.hideDatesAgenda || false,
          hideBtnDetailAgenda: dataStyles.hideBtnDetailAgenda || true,
          loader_page: dataStyles.loader_page || 'no',
          data_loader_page: dataStyles.data_loader_page || '',
          // Estilos de las actividades de la agenda
          hideDatesAgendaItem: dataStyles.hideDatesAgendaItem || false,
          hideHoursAgenda: dataStyles.hideHoursAgenda || false,
        },
      });
    }
  }

  //funciones para cargar imagenes y enviar un popup para avisar al usuario que la imagen ya cargo o cambiar la imagen
  async saveEventImage(files, imageFieldName) {
    const file = files[0];
    let imageUrl = null;
    const url = '/api/files/upload',
      self = this;
    if (file) {
      this.setState({
        imageFile: file,
        event: { ...this.state.event, picture: null },
      });

      //envia el archivo de imagen como POST al API
      const uploaders = files.map((file) => {
        let data = new FormData();
        data.append('file', file);
        return Actions.post(url, data).then((image) => {
          if (image) imageUrl = image;
        });
      });
      this.setState({ isLoading: true });

      //cuando todaslas promesas de envio de imagenes al servidor se completan
      axios.all(uploaders).then(async () => {
        let temp = { ...this.state.styles };
        temp[imageFieldName] = imageUrl;

        //Si estamos subiendo el banner_image generamos una más pequena de 600px para usar en los correos
        if (imageFieldName === 'banner_image') {
          let imageObject = {
            banner_image_email: imageUrl,
            type: 'email',
          };
          let image_event_name = 'banner_image_email';
          let imageUrl_email = await Actions.post(`/api/files/uploadbase/${image_event_name}`, imageObject);
          temp[image_event_name] = imageUrl_email;
        }

        if (imageFieldName === 'banner_footer') {
          let imageObject = {
            banner_footer_email: imageUrl,
            type: 'email',
          };
          let image_event_name = 'banner_footer_email';
          let imageFooter_email = await Actions.post(`/api/files/uploadbase/${image_event_name}`, imageObject);
          temp[image_event_name] = imageFooter_email;
        }

        this.setState({ styles: temp, isLoading: false });

        self.setState({
          fileMsg: 'Imagen subida con exito',
        });

        toast.success(<FormattedMessage id='toast.img' defaultMessage='Ok!' />);
      });
    } else {
      this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
    }
  }

  // banner_image  BackgroundImage  FooterImage event_image

  //Se realiza una funcion asincrona submit para enviar los datos a la api
  async submit(e) {
    const loadingSave = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere..</>,
    });
    if (e !== undefined) {
      e.preventDefault();
      e.stopPropagation();
    }
    let info
    const { eventId } = this.state;
    const thereIsAnOrganization = this.props.org?._id

    this.state.data = { styles: this.state.styles };
    try {
      if(thereIsAnOrganization){
         info = await OrganizationApi.editOne(this.state.data, thereIsAnOrganization);
      }else{
         info = await Actions.put(`/api/events/${eventId}`, this.state.data);
      }

      this.setState({ loading: false });
      if (info._id) {
        toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
        message.destroy(loadingSave.key);
        message.open({
          type: 'success',
          content: <> Información guardada correctamente</>,
        });
      } else {
        toast.warn(<FormattedMessage id='toast.warning' defaultMessage='Idk' />);
        this.setState({ msg: 'Cant Create', create: false });
        message.destroy(loadingSave.key);
        message.open({
          type: 'error',
          content: <> Error al guardar</>,
        });
      }
    } catch (error) {
      toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
      if (error.response) {
        console.error(error.response);
        const { status, data } = error.response;
        console.error('STATUS', status, status === 401);
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;
        console.error('Error', error.message);
        if (error.request) {
          console.error(error.request);
          errorData = error.request;
        }

        this.setState({ serverError: true, loader: false, errorData });
        message.destroy(loadingSave.key);
        message.open({
          type: 'error',
          content: <> Error al guardar</>,
        });
      }
    }
  }

  onColorChange = function(color, fieldName) {
    let temp = { ...this.state.styles };
    temp[fieldName] = color.hex;
    this.setState({ styles: temp });
  };

  handleClickSelectColor = (key) => {
    //react recomiendo copiar las cosas antes de modificarlas
    //Copiamos el array ColorDrawer a uno nuevo usando el spread operator (...)
    let newColorDrawer = [...this.state.colorDrawer];
    //invertimos el valor de editIsVisible del elemento clikeado indicado por key
    newColorDrawer[key].editIsVisible = !newColorDrawer[key].editIsVisible;
    //Actualizamos el estado
    this.setState({ colorDrawer: newColorDrawer });
  };

  async deleteInfoBanner(value) {
    let styles = { ...this.state.styles };
    let empty = null;
    styles[value] = empty;

    const stylesToSave = { styles };

    this.setState({ styles: styles });

    const info = await Actions.put(`/api/events/${this.state.eventId}`, stylesToSave);

    this.setState({ loading: false });

    if (info._id) {
      toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
    } else {
      toast.warn(<FormattedMessage id='toast.warning' defaultMessage='Idk' />);
      this.setState({ msg: 'Cant Create', create: false });
    }
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;

    let styles = { ...this.state.styles };
    styles[name] = value;

    this.setState({ styles: styles });
  }

  getDataLoaderPage(data) {
    let styles = { ...this.state.styles };
    styles['data_loader_page'] = data;
    this.setState({ styles: styles });
  }

  render() {
    const { timeout } = this.state;

    return (
      <React.Fragment>
        <Form
          onFinish={this.submit}
          {...formLayout}
        >
          <Header 
            title={'Configuración de Estilos'}
            save
            form
          />

          <Row justify='center' wrap gutter={[8, 8]}>
            <Col span={12}>
              {this.state.colorDrawer.map((item, key) => (
                
                <div key={key}>
                  {item.editIsVisible && (
                    <Modal
                      closable={false}
                      footer={[
                        <Button key='ok' type='primary' onClick={() => this.handleClickSelectColor(key)}>
                          Aceptar
                        </Button>,
                      ]}
                      title={<Title level={5}>{item.title}</Title>}
                      visible={item.editIsVisible}>
                      <Space wrap size='large' align='start'>
                        <SketchPicker
                          color={this.state.styles[item.fieldColorName]}
                          onChangeComplete={(color) => {
                            this.onColorChange(color, item.fieldColorName);
                          }}
                        />
                        <Space direction='vertical'>
                          <Text
                            style={{ fontSize: '20px' }}
                            code
                            copyable={{
                              text: `${this.state.styles[item.fieldColorName].toUpperCase()}`,
                              onCopy: () => message.success('Color hexadecimal copiado'),
                            }}>{`HEX ${this.state.styles[item.fieldColorName].toUpperCase()}`}</Text>
                          <Text
                            style={{ fontSize: '20px' }}
                            code
                            copyable={{
                              text: `${this.hexToRgb(this.state.styles[item.fieldColorName])?.r},${
                                this.hexToRgb(this.state.styles[item.fieldColorName])?.g
                              },${this.hexToRgb(this.state.styles[item.fieldColorName])?.b}`,
                              onCopy: () => message.success('Color rgb copiado'),
                            }}>{`RGB (${this.hexToRgb(this.state.styles[item.fieldColorName])?.r},${
                            this.hexToRgb(this.state.styles[item.fieldColorName])?.g
                          },${this.hexToRgb(this.state.styles[item.fieldColorName])?.b})`}</Text>
                        </Space>
                      </Space>
                    </Modal>
                  )}

                  <Form.Item label={item.title} onClick={() => this.handleClickSelectColor(key)}>
                    {item.description && <label className='label has-text-grey-light'>{item.description}</label>}
                    <Tag style={{ width: '20%' }} color={this.state.styles[item.fieldColorName]}>
                      {this.state.styles[item.fieldColorName]}
                    </Tag>
                  </Form.Item>
                </div>
              ))}

              {this.selectsDrawer.map((item, key) => (
                <div key={key}>
                  <Form.Item label={item.label}>
                    <Select
                      defaultValue={item.defaultValue}
                      value={this.state.styles[item.name]}
                      name={item.name}
                      onChange={(e) => this.handleChange(e)}
                      style={{ width: 120 }}
                    >
                      {item.options.map((item2, key) => (
                        <Option key={key} value={item2.value}>
                          {item2.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  {item.name === 'loader_page' && this.state.styles.loader_page === 'text' && (
                    <Form.Item label={'Link de video'}>
                      <Input
                        defaultValue={this.state.styles['data_loader_page']}
                        type='text'
                        onChange={(e) => this.getDataLoaderPage(e.target.value)}
                      />
                    </Form.Item>
                  )}
                  {item.name === 'loader_page' && this.state.styles.loader_page === 'code' && (
                    <Form.Item>
                      <ReactQuill
                        id={item.name}
                        onChange={this.getDataLoaderPage}
                        defaultValue={this.state.styles.data_loader_page}
                        style={{ marginTop: '5%' }}
                        modules={toolbarEditor}
                      />
                    </Form.Item>
                  )}
                </div>
              ))}

              {this.imageDrawer.map((item, key) => (
                <div key={key}>
                  <Form.Item label={item.title}>
                    {item.description && <label className='label has-text-grey-light'>{item.description}</label>}

                    <ImageInput
                      picture={this.state.styles[item.imageFieldName]}
                      width={item.width}
                      height={item.height}
                      changeImg={(files) => {
                        this.saveEventImage(files, item.imageFieldName);
                      }}
                      errImg={this.state.errImg}
                    />
                    {this.state.styles[item.imageFieldName] && (
                      <Button onClick={() => this.deleteInfoBanner(item.imageFieldName)}>{item.button}</Button>
                    )}
                  </Form.Item>

                  {this.state.fileMsg && <p className='help is-success'>{this.state.fileMsg}</p>}
                </div>
              ))}
            </Col>
          </Row>
        </Form>
        {timeout && <LogOut />}
      </React.Fragment>
    );
  }
}

export default Styles;
