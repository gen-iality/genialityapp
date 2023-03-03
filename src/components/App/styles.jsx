import { Component } from 'react';
import { Actions, OrganizationApi } from '@helpers/request';
import { injectIntl } from 'react-intl';
import { SketchPicker } from 'react-color';
import { Button, Typography, Modal, Space, Row, Col, Form, Tag, Select, Spin } from 'antd';
import ReactQuill from 'react-quill';
import Header from '@antdComponents/Header';
import BackTop from '@antdComponents/BackTop';
import { GetTokenUserFirebase } from '@helpers/HelperAuth';
import { DispatchMessageService } from '@context/MessageService';
import ImageUploaderDragAndDrop from '../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import Loading from '../profile/loading';

const { Title, Text } = Typography;
const { Option } = Select;
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class Styles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: this.props.eventId,
      loading: true,
      styles: {},
      isLoading: false,
      stylesIsLoading: true,
      editIsVisible: false,
      //Se realizan estas constantes para optimizar mas el codigo,de esta manera se mapea en el markup para utilizarlo posteriormente
      colorDrawer: [
        {
          title: `Color de fondo para ${this.props.org?._id ? 'la organización' : 'el curso'}`,
          description: 'Si escoges después una imagen de fondo, esa imagen reemplazara este color.',
          fieldColorName: 'containerBgColor',
          editIsVisible: false,
        },
        {
          title: 'Color de fondo para el menú',
          fieldColorName: 'toolbarDefaultBg',
          editIsVisible: false,
        },
        {
          title: 'Color del texto para el menú',
          fieldColorName: 'textMenu',
          editIsVisible: false,
        },
      ],
    };
    //Se establecen las funciones para su posterior uso
    this.saveEventImage = this.saveEventImage.bind(this);
    /* this.getDataLoaderPage = this.getDataLoaderPage.bind(this); */
    this.submit = this.submit.bind(this);

    this.imageDrawer = [
      {
        title:
          'Elige una imagen para el banner superior desde el escritorio o una carpeta. Tamaño recomendado 1920x540 px',
        description: `Por defecto en el baner superior se muestra la imagen prinicpal ${
          this.props.org?._id ? 'de la organización' : 'del curso'
        } aqui la puedes cambiar`,
        imageFieldName: 'banner_image',
        button: 'Eliminar banner superior',
        width: 1920,
        height: 540,
      },
      {
        title:
          'Elige una imagen para el banner del correo electrónico desde el escritorio o una carpeta. Tamaño recomendado 600x280 px',
        description: 'Por defecto se reduce la imagen automaticamente del banner superior',
        imageFieldName: 'banner_image_email',
        button: 'Eliminar banner de email',
        width: 320,
        height: 180,
      },
      /* {
        title:
          'Elige una imagen para el banner en mobile (opcional en caso de no observar bien el banner superior en celular): (Tamaño recomendado 1080x556)',
        imageFieldName: 'mobile_banner',
        button: 'eliminar banner en mobile',
        width: 1080,
        height: 556,
      }, */
      {
        title: 'Si lo deseas, elige una imagen para el fondo del curso o la lección. Tamaño recomendado 1920x2160 px',
        imageFieldName: 'BackgroundImage',
        button: 'Eliminar textura de fondo',
        width: 1920,
        height: 2160,
      },
      {
        title: 'Elige una imagen para tu logo desde el escritorio o una carpeta. Tamaño recomendado 320x180 px',
        imageFieldName: 'event_image',
        button: 'Eliminar logo',
        width: 320,
        height: 180,
      },
      {
        title: `Elige una imagen para el footer ${
          this.props.org?._id ? 'de la organización' : 'del curso o de la lección'
        }. Tamaño recomendado 1920x280 px`,
        imageFieldName: 'banner_footer',
        button: 'Eliminar pie de pagina',
        width: 1920,
        height: 280,
      },
      {
        title:
          'Elige una imagen para el footer del correo electrónico desde el escritorio o una carpteta. Tamaño recomendado 600x220 px',
        description: `Por defecto se reduce la imagen automaticamente del footer ${
          this.props.org?._id ? 'de la organización' : 'del curso'
        }`,
        imageFieldName: 'banner_footer_email',
        button: 'Eliminar pie de pagina de email',
        width: 600,
        height: 220,
      },
    ];
    this.selectsDrawer = [
      {
        label: 'Franja de titulo  y fecha',
        defaultValue: true,
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
            value: 'true',
          },
          {
            label: 'No',
            value: false,
          },
        ],
      },
      {
        label: 'Habilitar informacíon sobre el banner superior',
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
      /* {
        label: 'Agrupar la lecciones de la agenda en TABS ',
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
      }, */
      {
        label: 'Ocultar fechas de las lecciones de la agenda',
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
      {
        label: 'Mostrar el botón del detalle de los cursos o lecciones',
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
    const thereIsAnOrganization = this.props.org?._id;
    let dataStyles;
    let info;

    if (thereIsAnOrganization) {
      dataStyles = this.props.org?.styles ? this.props.org.styles : {};
    } else {
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
          show_title: dataStyles?.show_title || false,
          show_video_widget: dataStyles?.show_video_widget || false,
          show_card_banner: dataStyles.show_card_banner || false,
          show_inscription: info?.show_inscription || false,
          hideDatesAgenda: dataStyles.hideDatesAgenda || false,
          hideBtnDetailAgenda: dataStyles?.hideBtnDetailAgenda || false,
          loader_page: dataStyles.loader_page || 'no',
          data_loader_page: dataStyles.data_loader_page || '',
          // Estilos de las lecciones de la agenda
          hideDatesAgendaItem: dataStyles.hideDatesAgendaItem || false,
          hideHoursAgenda: dataStyles.hideHoursAgenda || false,
        },
        stylesIsLoading: false,
      });
    }
  }

  //funciones para cargar imagenes y enviar un popup para avisar al usuario que la imagen ya cargo o cambiar la imagen
  async saveEventImage(imageUrl, imageFieldName) {
    const styles = { ...this.state.styles };
    styles[imageFieldName] = imageUrl;

    this.setState({ styles: styles });
  }

  // banner_image  BackgroundImage  FooterImage event_image

  //Se realiza una funcion asincrona submit para enviar los datos a la api
  async submit() {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere...',
      action: 'show',
    });
    let info;
    const { eventId } = this.state;
    const thereIsAnOrganization = this.props.org?._id;

    this.state.data = { styles: this.state.styles };
    /* console.log('save data', this.state.data) */
    try {
      if (thereIsAnOrganization) {
        info = await OrganizationApi.editOne(this.state.data, thereIsAnOrganization);
      } else {
        const token = await GetTokenUserFirebase();
        info = await Actions.put(`/api/events/${eventId}?token=${token}`, this.state.data);
      }

      this.setState({ loading: false });
      if (info._id) {
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: this.props.intl.formatMessage({
            id: 'toast.success',
            defaultMessage: 'Información guardada correctamente!',
          }),
          action: 'show',
        });
      } else {
        this.setState({ msg: "Can't create", create: false });
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: this.props.intl.formatMessage({ id: 'toast.warning', defaultMessage: 'Error al guardar' }),
          action: 'show',
        });
      }
    } catch (error) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: this.props.intl.formatMessage({ id: 'toast.error', defaultMessage: 'Sry :(' }),
        action: 'show',
      });
      if (error.response) {
        /* console.error(error.response); */
        const { status, data } = error.response;
        /* console.error('STATUS', status, status === 401); */
        if (status === 401) {
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'error',
            msj: `Error: ${data?.message || status}`,
            action: 'show',
          });
        } else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;
        /* console.error('Error', error.message); */
        if (error.request) {
          /* console.error(error.request); */
          errorData = error.request;
        }
        this.setState({ serverError: true, loader: false, errorData });
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: 'Error al guardar.',
          action: 'show',
        });
      }
    }
  }

  onColorChange = function(color, fieldName) {
    const temp = { ...this.state.styles };
    temp[fieldName] = color.hex;
    this.setState({ styles: temp });
  };

  handleClickSelectColor = (key) => {
    //react recomiendo copiar las cosas antes de modificarlas
    //Copiamos el array ColorDrawer a uno nuevo usando el spread operator (...)
    const newColorDrawer = [...this.state.colorDrawer];
    //invertimos el valor de editIsVisible del elemento clikeado indicado por key
    newColorDrawer[key].editIsVisible = !newColorDrawer[key].editIsVisible;
    //Actualizamos el estado
    this.setState({ colorDrawer: newColorDrawer });
  };

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  handleChange(value, name) {
    /* console.log(value, name); */
    /* let name = e.target.name; */
    /* let value = e.target.value; */
    /* let value = e; */

    const styles = { ...this.state.styles };
    styles[name] = value;
    /* console.log(styles[name], styles) */

    this.setState({ styles: styles });
  }

  /* getDataLoaderPage(data) {
    let styles = { ...this.state.styles };
    styles['data_loader_page'] = data;
    this.setState({ styles: styles });
  } */

  render() {
    const { stylesIsLoading } = this.state;
    return (
      <>
        <Form onFinish={this.submit} {...formLayout}>
          <Header title="Configuración de Estilos" save form />

          <Row justify="center" wrap gutter={[8, 8]}>
            {stylesIsLoading ? (
              <Loading />
            ) : (
              <Col sm={20} md={12}>
                {this.state.colorDrawer.map((item, key) => (
                  <div key={key}>
                    {item.editIsVisible && (
                      <Modal
                        closable={false}
                        footer={[
                          <Button key="ok" type="primary" onClick={() => this.handleClickSelectColor(key)}>
                            Aceptar
                          </Button>,
                        ]}
                        title={<Title level={5}>{item.title}</Title>}
                        visible={item.editIsVisible}
                      >
                        <Space wrap size="large" align="start">
                          <SketchPicker
                            color={this.state.styles[item.fieldColorName]}
                            onChangeComplete={(color) => {
                              this.onColorChange(color, item.fieldColorName);
                            }}
                          />
                          <Space direction="vertical">
                            <Text
                              style={{ fontSize: '20px' }}
                              code
                              copyable={{
                                text: `${this.state.styles[item.fieldColorName].toUpperCase()}`,
                                onCopy: () =>
                                  DispatchMessageService({
                                    type: 'success',
                                    msj: 'Color hexadecimal copiado',
                                    action: 'show',
                                  }),
                              }}>{`HEX ${this.state.styles[item.fieldColorName].toUpperCase()}`}</Text>
                            <Text
                              style={{ fontSize: '20px' }}
                              code
                              copyable={{
                                text: `${this.hexToRgb(this.state.styles[item.fieldColorName])?.r},${
                                  this.hexToRgb(this.state.styles[item.fieldColorName])?.g
                                },${this.hexToRgb(this.state.styles[item.fieldColorName])?.b}`,
                                onCopy: () =>
                                  DispatchMessageService({
                                    type: 'success',
                                    msj: 'Color rgb copiado',
                                    action: 'show',
                                  }),
                              }}>{`RGB (${this.hexToRgb(this.state.styles[item.fieldColorName])?.r},${
                              this.hexToRgb(this.state.styles[item.fieldColorName])?.g
                            },${this.hexToRgb(this.state.styles[item.fieldColorName])?.b})`}</Text>
                          </Space>
                        </Space>
                      </Modal>
                    )}

                    <Form.Item
                      label={item.title}
                      help={item.description}
                      onClick={() => this.handleClickSelectColor(key)}
                    >
                      <Tag style={{ width: '20%', borderColor: 'gray' }} color={this.state.styles[item.fieldColorName]}>
                        {this.state.styles[item.fieldColorName]}
                      </Tag>
                    </Form.Item>
                  </div>
                ))}

                {this.selectsDrawer.map((item, key) => (
                  <div key={key}>
                    <Form.Item label={item.label}>
                      <Select
                        defaultValue={this.state.styles[item.name] /* item.defaultValue */}
                        value={this.state.styles[item.name]}
                        name={item.name}
                        onChange={(e) => this.handleChange(e, item.name)}
                        style={{ width: 120 }}
                      >
                        {item.options.map((item2, key2) => (
                          <Option key={key2} value={item2.value}>
                            {item2.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                ))}

                <Space direction="vertical" size={25} wrap>
                  {this.imageDrawer.map((item, key) => (
                    <div key={key}>
                      <Form.Item
                        label={
                        <label style={{ paddingBottom: '30px' }}>
                          {item.title}
                        </label>
                        }
                        help={item.description}
                      >
                        <ImageUploaderDragAndDrop
                          imageDataCallBack={(imageUrl) => this.saveEventImage(imageUrl, item.imageFieldName)}
                          imageUrl={this.state.styles[item.imageFieldName]}
                          width={item.width}
                          height={item.height}
                        />
                      </Form.Item>
                    </div>
                  ))}
                </Space>
              </Col>
            )}
          </Row>
          <BackTop />
        </Form>
      </>
    );
  }
}

export default injectIntl(Styles);
