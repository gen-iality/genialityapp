import React, { Component, Fragment } from 'react';
import { Typography, Select, Card, Input, Button, Col, Row, message, Spin } from 'antd';
import { Actions } from '../../helpers/request';
import { toast } from 'react-toastify';
const { Title } = Typography;
const { Option } = Select;

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
        tickets: {
          name: 'Registro',
          position: '',
          section: 'tickets',
          icon: 'CreditCardOutlined',
          checked: false,
          permissions: 'public',
        },
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
        my_section: {
          name: 'Seccion Personalizada',
          position: '',
          section: 'my_section',
          icon: 'EnterOutlined',
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
          name: 'Seccion Informativa Segunda',
          position: '',
          section: 'informativeSection1',
          icon: 'FileDoneOutlined',
          markup: '',
          checked: false,
          permissions: 'public',
        },
        login: {
          name: 'Inicio de sesion',
          position: '',
          section: 'login',
          icon: 'LoginOutlined',
          checked: false,
          permissions: 'public',
        },
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
    const menuLanding = await Actions.getAll(`/api/events/${this.props.event._id}`);

    for (const prop in menuBase) {
      for (const prop1 in menuLanding.itemsMenu) {
        if (prop1 === prop) {
          this.mapActiveItemsToAvailable(prop);
          this.changeNameMenu(prop, menuLanding.itemsMenu[prop1].name);
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

    await Actions.put(`api/events/${this.props.event._id}`, newMenu);
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
    console.log('items menù', itemsMenuDB);
    console.log('primero=>', menuBase[key]);
    menuBase[key].checked = !menuBase[key].checked;
    console.log('segundo=>', menuBase[key]);

    if (menuBase[key].checked) {
      itemsMenuDB[key] = menuBase[key];
    } else {
      delete itemsMenuDB[key];
    }
    this.setState({ itemsMenu: itemsMenuDB, values: menuBase });
  }

  changeNameMenu(key, name) {
    let itemsMenuDB = { ...this.state.itemsMenu };
    if (name !== '') {
      itemsMenuDB[key].name = name;
    }
    this.setState({ itemsMenu: itemsMenuDB });
  }

  changePositionMenu(key, position) {
    let itemsMenuDB = { ...this.state.itemsMenu };
    if (position !== '') {
      itemsMenuDB[key].position = position;
    }
    this.setState({ itemsMenu: itemsMenuDB });
  }

  changeMarkup(key, markup) {
    let itemsMenuDB = { ...this.state.itemsMenu };
    if (markup !== '') {
      itemsMenuDB[key].markup = markup;
    }
    this.setState({ itemsMenu: itemsMenuDB });
  }

  changePermissions(key, access) {
    let itemsMenuDB = { ...this.state.itemsMenu };
    itemsMenuDB[key].permissions = access;
    this.setState({ itemsMenu: itemsMenuDB, keySelect: Date.now() });
  }

  orderPosition(key, order) {
    let itemsMenuToOrder = { ...this.state.itemsMenu };
    itemsMenuToOrder[key].position = order;

    this.setState({ itemsMenu: itemsMenuToOrder });
  }
  render() {
    return (
      <Fragment>
        <Title level={3}>Habilitar secciones del evento</Title>
        <h3>(Podrás guardar la configuración de tu menú en la parte inferior)</h3>
        <Row gutter={16}>
          {console.log('MENU SECTIONS ', this.state.menu)}
          {Object.keys(this.state.menu).map((key) => {
            return (
              <div key={key}>
                <Col style={{ marginTop: '3%' }} span={8}>
                  <Card
                    title={<Title level={4}>{this.state.menu[key].name}</Title>}
                    bordered={true}
                    style={{ width: 300, marginTop: '2%' }}>
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
                        disabled={
                          this.state.menu[key].checked === true && this.state.menu[key].section !== 'tickets'
                            ? false
                            : true
                        }
                        defaultValue={this.state.menu[key].permissions}
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
        </Row>
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
        <Row>
          <Button style={{ marginTop: '1%' }} type='primary' size='large' onClick={this.submit}>
            Guardar
          </Button>
        </Row>
      </Fragment>
    );
  }
}

export default menuLanding;
