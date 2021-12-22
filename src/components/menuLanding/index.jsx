import React, { Component, Fragment } from 'react';
import { Typography, Select, Card, Input, Button, Col, Row, message, Spin, Form, InputNumber } from 'antd';
import { Actions, OrganizationApi } from '../../helpers/request';
import { toast } from 'react-toastify';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import { GetTokenUserFirebase } from '../../helpers/HelperAuth';

const { Title } = Typography;
const { Option } = Select;
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  size: 'small',
};

class menuLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: {
        evento: {
          name: 'Evento',
          position: '',
          section: 'evento',
          icon: 'CalendarOutlined',
          checked: false,
          permissions: 'public',
        },
        agenda: {
          name: 'Agenda',
          position: '',
          section: 'agenda',
          icon: 'ReadOutlined',
          checked: false,
          permissions: 'public',
        },
        speakers: {
          name: 'Conferencistas',
          position: '',
          section: 'speakers',
          icon: 'AudioOutlined',
          checked: false,
          permissions: 'public',
        },
        /* tickets: {
          name: 'Registro',
          position: '',
          section: 'tickets',
          icon: 'CreditCardOutlined',
          checked: false,
          permissions: 'public',
        }, */
        certs: {
          name: 'Certificados',
          position: '',
          section: 'certs',
          icon: 'FileDoneOutlined',
          checked: false,
          permissions: 'public',
        },
        documents: {
          name: 'Documentos',
          position: '',
          section: 'documents',
          icon: 'FolderOutlined',
          checked: false,
          permissions: 'public',
        },
        wall: {
          name: 'Muro',
          position: '',
          section: 'wall',
          icon: 'TeamOutlined',
          checked: false,
          permissions: 'public',
        },
        survey: {
          name: 'Encuestas',
          position: '',
          section: 'survey',
          icon: 'FileUnknownOutlined',
          checked: false,
          permissions: 'public',
        },
        faqs: {
          name: 'Preguntas Frecuentes',
          position: '',
          section: 'faqs',
          icon: 'QuestionOutlined',
          checked: false,
          permissions: 'public',
        },
        networking: {
          name: 'Networking',
          position: '',
          section: 'networking',
          icon: 'LaptopOutlined',
          checked: false,
          permissions: 'public',
        },
        companies: {
          name: 'Empresas',
          position: '',
          section: 'companies',
          icon: 'ApartmentOutlined',
          checked: false,
          permissions: 'public',
        },
        interviews: {
          name: 'Citas',
          position: '',
          section: 'interviews',
          icon: 'UserOutlined',
          checked: false,
          permissions: 'public',
        },
        trophies: {
          name: 'Trofeos',
          position: '',
          section: 'trophies',
          icon: 'TrophyOutlined',
          checked: false,
          permissions: 'public',
        },
        my_sesions: {
          name: 'Mis Actividades',
          position: '',
          section: 'my_sesions',
          icon: 'TeamOutlined',
          checked: false,
          permissions: 'public',
        },

        informativeSection: {
          name: 'Seccion Informativa',
          position: '',
          section: 'informativeSection',
          icon: 'FileDoneOutlined',
          markup: '',
          checked: false,
          permissions: 'public',
        },
        informativeSection1: {
          name: 'Seccion Informativa',
          position: '',
          section: 'informativeSection1',
          icon: 'FileDoneOutlined',
          markup: '',
          checked: false,
          permissions: 'public',
        },
        /* login: {
          name: 'Inicio de sesion',
          position: '',
          section: 'login',
          icon: 'LoginOutlined',
          checked: false,
          permissions: 'public',
        }, */
        partners: {
          name: 'Patrocinadores',
          section: 'partners',
          icon: 'DeploymentUnitOutlined',
          checked: false,
          permissions: 'public',
        },
        ferias: {
          name: 'Ferias',
          section: 'ferias',
          icon: 'FundProjectionScreenOutlined',
          checked: false,
          permissions: 'public',
        },
        noticias: {
          name: 'Noticias',
          section: 'noticias',
          icon: 'NotificationOutlined',
          checked: false,
          permissions: 'public',
        },
        producto: {
          name: 'Producto',
          section: 'producto',
          icon: 'ShopOutlined ',
          checked: false,
          permissions: 'public',
        },
        videos: {
          name: 'Videos',
          section: 'videos',
          icon: 'PlaySquareOutlined',
          checked: false,
          permissions: 'public',
        },
      },
      values: {},
      itemsMenu: {},
      keySelect: Date.now(),
    };
    this.submit = this.submit.bind(this);
  }

  async componentDidMount() {
    const menuBase = this.state.menu;
    let menuLanding = {};
    if (this.props.organization != 1) {
      let token = await GetTokenUserFirebase();
      menuLanding = await Actions.getAll(`/api/events/${this.props.event._id}?token=${token}`);
    } else {
      //OBTENER DE ORGANIZACIÓN
      // alert("ORGANIZATION")

      menuLanding.itemsMenu = this.props.organizationObj.itemsMenu || [];
      console.log('ITEMS==>', menuLanding.itemsMenu);
      this.state.itemsMenu = menuLanding.itemsMenu;
      let items = menuLanding.itemsMenu;
    }
    for (const prop in menuBase) {
      for (const prop1 in menuLanding.itemsMenu) {
        if (prop1 === prop) {
          console.log('INGRESO ACA');
          this.mapActiveItemsToAvailable(prop);
          this.changeNameMenu(prop, menuLanding.itemsMenu[prop1]?.name);
          this.changePositionMenu(prop, menuLanding.itemsMenu[prop1].position);
          if (menuLanding.itemsMenu[prop1].markup) {
            this.changeMarkup(prop, menuLanding.itemsMenu[prop1].markup);
          }
          this.changePermissions(prop, menuLanding.itemsMenu[prop1].permissions);
        }
      }
    }
  }

  orderItemsMenu(itemsMenu) {
    let itemsMenuData = {};
    let itemsMenuToSave = {};
    let items = Object.values(itemsMenu);

    items = items.map((item) => {
      return { ...item, position: (item.position = !item.position ? 30 : parseInt(item.position)) };
    });

    items.sort(function(a, b) {
      if (a.position) return a.position - b.position;
    });

    itemsMenuData = Object.assign({}, items);

    for (let item in itemsMenuData) {
      itemsMenuToSave[itemsMenuData[item].section] = itemsMenuData[item];
    }
    return itemsMenuToSave;
  }

  async submit() {
    const loadingSave = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere..</>,
    });
    const { itemsMenu } = this.state;
    let menu = this.orderItemsMenu(itemsMenu);
    const newMenu = { itemsMenu: { ...menu } };

    if (newMenu.itemsMenu.tickets) {
      newMenu.allow_register = true;
    } else {
      newMenu.allow_register = false;
    }
    if (this.props.organization !== 1) {
      let token = await GetTokenUserFirebase();
      await Actions.put(`api/events/${this.props.event._id}?token=${token}`, newMenu);
    } else {
      //ACTUALIZAR ORGANIZACION
      // console.log("ORGANIZATIONOBJ==>",this.props.organizationObj.itemsMenu)
      //console.log(this.props.organizationObj)
      let updateOrganization = {
        ...this.props.organizationObj,
        itemsMenu: { ...menu },
      };
      let resp = await OrganizationApi.editMenu({ itemsMenu: menu }, updateOrganization._id);
      if (resp) {
        console.log('MENU GUARDADDO==>', newMenu);
      }
    }
    toast.success('Información guardada');
    message.destroy(loadingSave.key);
    message.open({
      type: 'success',
      content: <> Información guardada correctamente</>,
    });
  }

  async mapActiveItemsToAvailable(key) {
    let menuBase = { ...this.state.menu };
    let itemsMenuDB = { ...this.state.itemsMenu };
    console.log('ITEMSMENUTOAVAILABLE==>', this.state.itemsMenu);
    console.log('items menù', itemsMenuDB);
    console.log('primero=>', menuBase[key]);
    menuBase[key].checked = !menuBase[key].checked;
    console.log('segundo=>', menuBase[key]);

    if (menuBase[key].checked) {
      itemsMenuDB[key] = menuBase[key];
      itemsMenuDB[key].name = menuBase[key].name;
    } else {
      delete itemsMenuDB[key];
    }
    this.setState({ itemsMenu: itemsMenuDB, values: menuBase });
  }

  changeNameMenu(key, name) {
    let menuBase = { ...this.state.menu };
    let itemsMenuDB = { ...this.state.itemsMenu };
    console.log('CHANGEMENU==>', key, name);
    if (name !== '') {
      if (itemsMenuDB[key]) {
        itemsMenuDB[key].name = name;
        menuBase[key].name = itemsMenuDB[key].name || name;
      }
    }
    this.setState({ itemsMenu: itemsMenuDB });
  }

  changePositionMenu(key, position) {
    let menuBase = { ...this.state.menu };
    let itemsMenuDB = { ...this.state.itemsMenu };
    if (position !== '') {
      if (itemsMenuDB[key]) {
        itemsMenuDB[key].position = position;
        menuBase[key].position = position || itemsMenuDB[key].position;
      }
    }
    this.setState({ itemsMenu: itemsMenuDB });
  }

  changeMarkup(key, markup) {
    let menuBase = { ...this.state.menu };
    let itemsMenuDB = { ...this.state.itemsMenu };
    if (markup !== '') {
      itemsMenuDB[key].markup = markup;
      menuBase[key].markup = itemsMenuDB[key].markup || markup;
    }
    this.setState({ itemsMenu: itemsMenuDB });
  }

  changePermissions(key, access) {
    let menuBase = { ...this.state.menu };
    let itemsMenuDB = { ...this.state.itemsMenu };
    console.log('itemsMenuDB', itemsMenuDB);
    if (itemsMenuDB[key]) {
      itemsMenuDB[key].permissions = access;
      menuBase[key].permissions = itemsMenuDB[key].permissions || access;
    }

    this.setState({ itemsMenu: itemsMenuDB, keySelect: Date.now() });
  }

  orderPosition(key, order) {
    let itemsMenu = { ...this.state.menu };
    let itemsMenuToOrder = { ...this.state.itemsMenu };
    itemsMenuToOrder[key].position = order !== '' ? parseInt(order) : 0;
    itemsMenu[key].position = itemsMenuToOrder[key].position || order !== '' ? parseInt(order) : 0;
    this.setState({ itemsMenu: itemsMenuToOrder });
  }
  render() {
    return (
      <Fragment>
        <Form {...formLayout} onFinish={this.submit}>
          <Header
            title={
              this.props.organization != 1 ? 'Habilitar secciones del evento' : 'Secciones a habilitar para cada evento'
            }
            description={'(Podrás guardar la configuración de tu menú en la parte inferior)'}
            save
            form
          />

          <Row gutter={[8, 8]} wrap>
            {Object.keys(this.state.menu).map((key, index) => (
              <Col key={key} xs={24} sm={8} md={6} lg={6} xl={6} xxl={6}>
                <Card title={this.state.menu[key].name} bordered={true}>
                  <Form.Item name={this.state.menu[key].name}>
                    <Button
                      onClick={() => {
                        this.mapActiveItemsToAvailable(key);
                      }}>
                      {this.state.menu[key].checked === true ? 'Deshabilitar' : 'Habilitar'}
                    </Button>
                  </Form.Item>
                  <Form.Item label={'Cambiar nombre de la sección'}>
                    <Input
                      name={`name${index}`}
                      disabled={this.state.menu[key].checked === true ? false : true}
                      //value={this.state.menu[key].name}
                      onChange={(e) => {
                        this.changeNameMenu(key, e.target.value);
                      }}
                      placeholder={this.state.menu[key].name}
                    />
                  </Form.Item>
                  <Form.Item label={'Permisos para la sección'}>
                    <Select
                      name={`permissions${index}`}
                      key={this.state.keySelect}
                      disabled={this.state.menu[key].checked === true ? false : true}
                      value={this.state.menu[key].permissions}
                      onChange={(e) => {
                        this.changePermissions(key, e);
                      }}>
                      <Option value='public'>Abierto para todos</Option>
                      <Option value='assistants'>Usuarios inscritos al evento</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label={'Posición en el menú'}>
                    <InputNumber
                      name={`position${index}`}
                      disabled={this.state.menu[key].checked === true ? false : true}
                      value={this.state.menu[key].position}
                      onChange={(e) => this.orderPosition(key, e)}
                    />
                  </Form.Item>
                </Card>
              </Col>
            ))}
          </Row>
          <BackTop />
        </Form>

        {/* <Title level={3}>
          {this.props.organization != 1 ? 'Habilitar secciones del evento' : 'Secciones a habilitar para cada evento'}
        </Title>
        <h3>(Podrás guardar la configuración de tu menú en la parte inferior)</h3> */}
        {/* <Row gutter={16}>
          {console.log('MENU SECTIONS ', this.state.menu)}
          {Object.keys(this.state.menu).map((key) => {
            return (
              <div key={key}>
                <Col style={{ marginTop: '3%', marginRight: this.props.organization == 1 ? 20 : '' }} span={8}>
                  <Card
                    title={<Title level={4}>{this.state.menu[key].name}</Title>}
                    bordered={true}
                    style={{ width: this.props.organization == 1 ? 350 : 300, marginTop: '2%' }}>
                    <div style={{ marginBottom: '3%' }}>
                      <Button
                        onClick={() => {
                          this.mapActiveItemsToAvailable(key);
                        }}>
                        {this.state.menu[key].checked === true ? 'Deshabilitar' : 'Habilitar'}
                      </Button>
                    </div>

                    <div style={{ marginTop: '4%' }}>
                      <label>Cambiar nombre de la sección</label>
                      <Input
                        disabled={this.state.menu[key].checked === true ? false : true}
                       //value={this.state.menu[key].name}
                        onChange={(e) => {
                          this.changeNameMenu(key, e.target.value);
                        }}
                        placeholder={this.state.menu[key].name}
                      />
                    </div>
                    <div style={{ marginTop: '4%' }}>
                      <label>Permisos para la sección</label>
                      <Select
                        key={this.state.keySelect}
                        disabled={this.state.menu[key].checked === true ? false : true}
                        value={this.state.menu[key].permissions}
                        style={{ width: 200 }}
                        onChange={(e) => {
                          this.changePermissions(key, e);
                        }}>
                        <Option value='public'>Abierto para todos</Option>
                        <Option value='assistants'>Usuarios inscritos al evento</Option>
                      </Select>
                    </div>
                    <div>
                      <label>Posición en el menú</label>
                      <Input
                        type='number'
                        disabled={this.state.menu[key].checked === true ? false : true}
                        value={this.state.menu[key].position}
                        onChange={(e) => this.orderPosition(key, e.target.value)}
                      />
                    </div>
                  </Card>
                </Col>
              </div>
            );
          })}
        </Row> */}
        {/* <Row>
                    <div style={{ marginTop: "4%" }}>
                        {this.state.menu["informativeSection"].checked && (
                            <>
                                <label>Información para insercion en {this.state.menu["informativeSection"].name}</label>
                               
                                <textarea type="textbox" defaultValue={this.state.menu["informativeSection"].markup} modules={toolbarEditor} onChange={(e) => { this.changeMarkup("informativeSection", e.target.value) }} />
                            </>
                        )}
                    </div>
                    <div style={{ marginTop: "4%" }}>
                        {this.state.menu["informativeSection1"].checked && (
                            <>
                                <label>Información para insercion en {this.state.menu["informativeSection1"].name}</label>
                                <br/>
                                <textarea defaultValue={this.state.menu["informativeSection1"].markup} modules={toolbarEditor} onChange={(e) => { this.changeMarkup("informativeSection1", e.target.value) }} />
                            </>
                        )}
                    </div>
                </Row> */}
        {/* <Row>
          <Button style={{ marginTop: '1%' }} type='primary' size='large' onClick={this.submit}>
            Guardar
          </Button>
        </Row> */}
      </Fragment>
    );
  }
}

export default menuLanding;
