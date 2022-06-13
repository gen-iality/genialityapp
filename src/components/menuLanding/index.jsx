import { useEffect, useState } from 'react';
import { Typography, Select, Card, Input, Button, Col, Row, Spin, Form, InputNumber, Result } from 'antd';
import { Actions, OrganizationApi } from '../../helpers/request';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import { GetTokenUserFirebase } from '../../helpers/HelperAuth';
import { DispatchMessageService } from '@/context/MessageService';
import { UseCurrentUser } from '@/context/userContext';

const { Option } = Select;
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  size: 'small',
};

const menuLanding = (props) => {
  const originalMenu = {
    evento: {
      name: 'Evento',
      position: 30,
      section: 'evento',
      icon: 'CalendarOutlined',
      checked: false,
      permissions: 'public',
    },
    agenda: {
      name: 'Agenda',
      position: 30,
      section: 'agenda',
      icon: 'ReadOutlined',
      checked: false,
      permissions: 'public',
    },
    speakers: {
      name: 'Conferencistas',
      position: 30,
      section: 'speakers',
      icon: 'AudioOutlined',
      checked: false,
      permissions: 'public',
    },
    /* tickets: {
      name: 'Registro',
      position: 30,
      section: 'tickets',
      icon: 'CreditCardOutlined',
      checked: false,
      permissions: 'public',
    }, */
    certs: {
      name: 'Certificados',
      position: 30,
      section: 'certs',
      icon: 'FileDoneOutlined',
      checked: false,
      permissions: 'public',
    },
    documents: {
      name: 'Documentos',
      position: 30,
      section: 'documents',
      icon: 'FolderOutlined',
      checked: false,
      permissions: 'public',
    },
    wall: {
      name: 'Muro',
      position: 30,
      section: 'wall',
      icon: 'TeamOutlined',
      checked: false,
      permissions: 'public',
    },
    /* survey: {
      name: 'Encuestas',
      position: 30,
      section: 'survey',
      icon: 'FileUnknownOutlined',
      checked: false,
      permissions: 'public',
    }, */
    faqs: {
      name: 'Preguntas Frecuentes',
      position: 30,
      section: 'faqs',
      icon: 'QuestionOutlined',
      checked: false,
      permissions: 'public',
    },
    networking: {
      name: 'Networking',
      position: 30,
      section: 'networking',
      icon: 'LaptopOutlined',
      checked: false,
      permissions: 'public',
    },
    interviews: {
      name: 'Citas',
      position: 30,
      section: 'interviews',
      icon: 'UserOutlined',
      checked: false,
      permissions: 'public',
    },
    trophies: {
      name: 'Trofeos',
      position: 30,
      section: 'trophies',
      icon: 'TrophyOutlined',
      checked: false,
      permissions: 'public',
    },
    my_sesions: {
      name: 'Mis Actividades',
      position: 30,
      section: 'my_sesions',
      icon: 'TeamOutlined',
      checked: false,
      permissions: 'public',
    },

    informativeSection: {
      name: 'Sección Informativa',
      position: 30,
      section: 'informativeSection',
      icon: 'FileDoneOutlined',
      markup: '',
      checked: false,
      permissions: 'public',
    },
    informativeSection1: {
      name: 'Sección Informativa',
      position: 30,
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
      position: 30,
      icon: 'DeploymentUnitOutlined',
      checked: false,
      permissions: 'public',
    },
    ferias: {
      name: 'Ferias',
      section: 'ferias',
      position: 30,
      icon: 'FundProjectionScreenOutlined',
      checked: false,
      permissions: 'public',
    },
    noticias: {
      name: 'Noticias',
      section: 'noticias',
      position: 30,
      icon: 'NotificationOutlined',
      checked: false,
      permissions: 'public',
    },
    producto: {
      name: 'Producto',
      section: 'producto',
      position: 30,
      icon: 'ShopOutlined ',
      checked: false,
      permissions: 'public',
    },
    videos: {
      name: 'Videos',
      section: 'videos',
      position: 30,
      icon: 'PlaySquareOutlined',
      checked: false,
      permissions: 'public',
    },
  };
  const [menu, setMenu] = useState(originalMenu);
  const [values, setvalues] = useState({});
  const [itemsMenu, setitemsMenu] = useState(originalMenu);
  const [keySelect, setkeySelect] = useState(Date.now());
  const [isLoading, setisLoading] = useState(true);
  let cUser = UseCurrentUser();
  const toDisable = cUser.value.plan.availables.networking;

  useEffect(() => {
    getMenu();
  }, [menu]);

  const getMenu = async () => {
    const menuBase = menu;
    let menuLanding = {};
    if (props.organization != 1) {
      let token = await GetTokenUserFirebase();
      menuLanding = await Actions.getAll(`/api/events/${props.event._id}?token=${token}`);
    } else {
      //OBTENER DE ORGANIZACIÓN
      // alert("ORGANIZATION")

      menuLanding.itemsMenu = props.organizationObj.itemsMenu || [];
      /* console.log('ITEMS==>', menuLanding.itemsMenu); */
    }
    setitemsMenu(menuLanding?.itemsMenu);
    setMenu(menuLanding?.itemsMenu);

    //let items = itemsMenu;
    for (const prop in menuBase) {
      for (const prop1 in menuLanding.itemsMenu) {
        if (prop1 === prop) {
          /* console.log('INGRESO ACA'); */
          mapActiveItemsToAvailable(prop);
          changeNameMenu(prop, menuLanding.itemsMenu[prop1]?.name);
          changePositionMenu(prop, menuLanding.itemsMenu[prop1].position);
          if (menuLanding.itemsMenu[prop1]?.markup) {
            changeMarkup(prop, menuLanding.itemsMenu[prop1]?.markup);
          }
          changePermissions(prop, menuLanding.itemsMenu[prop1].permissions);
        }
      }
    }
    setisLoading(false);
  };

  const orderItemsMenu = (itemsMenu) => {
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
  };

  const submit = async () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere...',
      action: 'show',
    });
    //const { itemsMenu } = this.state;
    let menu = orderItemsMenu(itemsMenu);
    const newMenu = { itemsMenu: { ...menu } };

    /*if (newMenu.itemsMenu.tickets) {
      newMenu.allow_register = true;
    } else {
      newMenu.allow_register = false;
    }*/

    if (props.organization !== 1) {
      let token = await GetTokenUserFirebase();
      const resp = await Actions.put(`api/events/${props.event._id}?token=${token}`, newMenu);
    } else {
      //ACTUALIZAR ORGANIZACION
      // console.log("ORGANIZATIONOBJ==>",this.props.organizationObj.itemsMenu)
      //console.log(this.props.organizationObj)
      let updateOrganization = {
        ...props.organizationObj,
        itemsMenu: { ...menu },
      };
      let resp = await OrganizationApi.editMenu({ itemsMenu: menu }, updateOrganization._id);
      if (resp) {
        /* console.log('MENU GUARDADDO==>', newMenu); */
      }
    }
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    DispatchMessageService({
      type: 'success',
      msj: 'Información guardada correctamente',
      action: 'show',
    });
  };

  const mapActiveItemsToAvailable = async (key) => {
    let menuBase = { ...menu };
    let itemsMenuDB = { ...itemsMenu };
    /* console.log('ITEMSMENUTOAVAILABLE==>', this.state.itemsMenu);
    console.log('items menù', itemsMenuDB);
    console.log('primero=>', menuBase[key]); */
    menuBase[key].checked = !menuBase[key].checked;
    /* console.log('segundo=>', menuBase[key]); */

    if (menuBase[key].checked) {
      itemsMenuDB[key] = menuBase[key];
      itemsMenuDB[key].name = menuBase[key].name;
    } else {
      delete itemsMenuDB[key];
    }
    setitemsMenu(itemsMenu);
    setMenu(itemsMenu);
    setvalues(menuBase);
  };

  const changeNameMenu = (key, name) => {
    let menuBase = { ...menu };
    let itemsMenuDB = { ...itemsMenu };
    /* console.log('CHANGEMENU==>', key, name); */
    if (name !== '') {
      if (itemsMenuDB[key]) {
        itemsMenuDB[key].name = name;
        menuBase[key].name = itemsMenuDB[key].name || name;
      }
    }
    setitemsMenu(itemsMenuDB);
    setMenu(itemsMenuDB);
  };

  const changePositionMenu = (key, position) => {
    let menuBase = { ...menu };
    let itemsMenuDB = { ...itemsMenu };
    if (position !== '') {
      if (itemsMenuDB[key]) {
        itemsMenuDB[key].position = position;
        menuBase[key].position = position || itemsMenuDB[key].position;
      }
    }
    setitemsMenu(itemsMenuDB);
    setMenu(itemsMenuDB);
  };

  const changeMarkup = (key, markup) => {
    let menuBase = { ...menu };
    let itemsMenuDB = { ...itemsMenu };
    if (markup !== '') {
      itemsMenuDB[key].markup = markup;
      menuBase[key].markup = itemsMenuDB[key].markup || markup;
    }
    setitemsMenu(itemsMenuDB);
    setMenu(itemsMenuDB);
  };

  const changePermissions = (key, access) => {
    let menuBase = { ...menu };
    let itemsMenuDB = { ...itemsMenu };
    /* console.log('itemsMenuDB', itemsMenuDB); */
    if (itemsMenuDB[key]) {
      itemsMenuDB[key].permissions = access;
      menuBase[key].permissions = itemsMenuDB[key].permissions || access;
    }

    setitemsMenu(itemsMenuDB);
    setMenu(itemsMenuDB);
    setkeySelect(Date.now());
  };

  const orderPosition = (key, order) => {
    let itemsMenu = { ...menu };
    let itemsMenuToOrder = { ...itemsMenu };
    itemsMenuToOrder[key].position = order !== '' ? parseInt(order) : 0;
    itemsMenu[key].position = itemsMenuToOrder[key].position || order !== '' ? parseInt(order) : 0;
    setitemsMenu(itemsMenuToOrder);
    setMenu(itemsMenuToOrder);
  };

  return (
    <>
      <Form {...formLayout} onFinish={submit}>
        <Header
          title={props.organization != 1 ? 'Habilitar secciones del evento' : 'Secciones a habilitar para cada evento'}
          description={'(Podrás guardar la configuración de tu menú en la parte inferior)'}
          save
          form
        />

        <Spin tip='Cargando...' size='large' spinning={isLoading}>
          <Row gutter={[8, 8]} wrap>
            {Object.keys(menu).map((key, index) => (
              <Col key={key} xs={24} sm={8} md={6} lg={6} xl={6} xxl={6}>
                <Card title={menu[key].name} bordered={true} style={{ maxHeight: '350px' }}>
                  {menu[key].section === 'networking' && !toDisable ? (
                    <Result title={'No se encuentra disponible en tu plan actual'} icon={<></>} />
                  ) : (
                    <>
                      <Form.Item name={menu[key].name}>
                        <Button
                          onClick={() => {
                            mapActiveItemsToAvailable(key);
                          }}>
                          {menu[key].checked === true ? 'Deshabilitar' : 'Habilitar'}
                        </Button>
                      </Form.Item>
                      <Form.Item label={'Cambiar nombre de la sección'}>
                        <Input
                          name={`name${index}`}
                          disabled={menu[key].checked === true ? false : true}
                          //value={menu[key].name}
                          onChange={(e) => {
                            changeNameMenu(key, e.target.value);
                          }}
                          placeholder={menu[key].name}
                        />
                      </Form.Item>
                      <Form.Item label={'Permisos para la sección'}>
                        <Select
                          name={`permissions${index}`}
                          key={keySelect}
                          disabled={menu[key].checked === true ? false : true}
                          value={menu[key].permissions}
                          onChange={(e) => {
                            changePermissions(key, e);
                          }}>
                          <Option value='public'>Abierto para todos</Option>
                          <Option value='assistants'>Usuarios inscritos al evento</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label={'Posición en el menú'}>
                        <InputNumber
                          name={`position${index}`}
                          disabled={menu[key].checked === true ? false : true}
                          value={menu[key].position}
                          onChange={(e) => orderPosition(key, e)}
                        />
                      </Form.Item>
                    </>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
        <BackTop />
      </Form>
    </>
  );
};

export default menuLanding;
