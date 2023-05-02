import { Component } from 'react'
import {
  Typography,
  Select,
  Card,
  Input,
  Button,
  Col,
  Row,
  Spin,
  Form,
  InputNumber,
  Result,
} from 'antd'
import { Actions, OrganizationApi } from '@helpers/request'
import Header from '@antdComponents/Header'
import BackTop from '@antdComponents/BackTop'
import { GetTokenUserFirebase } from '@helpers/HelperAuth'
import { DispatchMessageService } from '@context/MessageService'
import { CurrentUserContext } from '@context/userContext'

const { Option } = Select
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  size: 'small',
}

class MenuLanding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: {
        evento: {
          name: 'Curso', // TODO: check where this prop is used
          position: 0,
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
          name: 'Evaluaciones',
          position: 30,
          section: 'survey',
          icon: 'FileUnknownOutlined',
          checked: false,
          permissions: 'public',
        }, */
        faqs: {
          name: 'Preguntas frecuentes',
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
        my_sesions: {
          name: 'Mis lecciones',
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
      },
      values: {},
      itemsMenu: {},
      keySelect: Date.now(),
      isLoading: true,
    }
    this.submit = this.submit.bind(this)
  }
  static contextType = CurrentUserContext

  async componentDidMount() {
    const menuBase = this.state.menu
    let menuLanding = {}
    if (this.props.organization != 1) {
      const token = await GetTokenUserFirebase()
      menuLanding = await Actions.getAll(
        `/api/events/${this.props.event._id}?token=${token}`,
      )
    } else {
      // Obtener de organización
      // alert("ORGANIZATION")

      menuLanding.itemsMenu = this.props.organizationObj.itemsMenu || []
      /* console.log('ITEMS==>', menuLanding.itemsMenu); */
      this.state.itemsMenu = menuLanding.itemsMenu
      const items = menuLanding.itemsMenu
    }
    for (const prop in menuBase) {
      for (const prop1 in menuLanding.itemsMenu) {
        if (prop1 === prop) {
          /* console.log('INGRESO ACA'); */
          this.mapActiveItemsToAvailable(prop)
          this.changeNameMenu(prop, menuLanding.itemsMenu[prop1]?.name)
          this.changePositionMenu(prop, menuLanding.itemsMenu[prop1].position)
          if (menuLanding.itemsMenu[prop1].markup) {
            this.changeMarkup(prop, menuLanding.itemsMenu[prop1].markup)
          }
          this.changePermissions(prop, menuLanding.itemsMenu[prop1].permissions)
        }
      }
    }

    this.setState({ isLoading: false })
  }

  orderItemsMenu(itemsMenu) {
    let itemsMenuData = {}
    const itemsMenuToSave = {}
    let items = Object.values(itemsMenu)

    items = items.map((item) => {
      return {
        ...item,
        position: (item.position = !item.position ? 30 : parseInt(item.position)),
      }
    })

    items.sort(function (a, b) {
      if (a.position) return a.position - b.position
    })

    itemsMenuData = Object.assign({}, items)

    for (const item in itemsMenuData) {
      itemsMenuToSave[itemsMenuData[item].section] = itemsMenuData[item]
    }
    return itemsMenuToSave
  }

  async submit() {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere...',
      action: 'show',
    })
    const { itemsMenu } = this.state
    const menu = this.orderItemsMenu(itemsMenu)
    const newMenu = { itemsMenu: { ...menu } }

    /*if (newMenu.itemsMenu.tickets) {
      newMenu.allow_register = true;
    } else {
      newMenu.allow_register = false;
    }*/

    if (this.props.organization !== 1) {
      const token = await GetTokenUserFirebase()
      const resp = await Actions.put(
        `api/events/${this.props.event._id}?token=${token}`,
        newMenu,
      )
    } else {
      // Actualizar organizacion
      const updateOrganization = {
        ...this.props.organizationObj,
        itemsMenu: { ...menu },
      }
      const resp = await OrganizationApi.editMenu(
        { itemsMenu: menu },
        updateOrganization._id,
      )
      if (resp) {
        /* console.log('MENU GUARDADDO==>', newMenu); */
      }
    }
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    })
    DispatchMessageService({
      type: 'success',
      msj: 'Información guardada correctamente',
      action: 'show',
    })
  }

  async mapActiveItemsToAvailable(key) {
    const menuBase = { ...this.state.menu }
    const itemsMenuDB = { ...this.state.itemsMenu }
    /* console.log('ITEMSMENUTOAVAILABLE==>', this.state.itemsMenu);
    console.log('items menù', itemsMenuDB);
    menuBase[key].checked = !menuBase[key].checked;
    /* console.log('segundo=>', menuBase[key]); */

    if (menuBase[key].checked) {
      itemsMenuDB[key] = menuBase[key]
      itemsMenuDB[key].name = menuBase[key].name
    } else {
      delete itemsMenuDB[key]
    }
    this.setState({ itemsMenu: itemsMenuDB, values: menuBase })
  }

  changeNameMenu(key, name) {
    const menuBase = { ...this.state.menu }
    const itemsMenuDB = { ...this.state.itemsMenu }
    /* console.log('CHANGEMENU==>', key, name); */
    if (name !== '') {
      if (itemsMenuDB[key]) {
        itemsMenuDB[key].name = name
        menuBase[key].name = itemsMenuDB[key].name || name
      }
    }
    this.setState({ itemsMenu: itemsMenuDB })
  }

  changePositionMenu(key, position) {
    const menuBase = { ...this.state.menu }
    const itemsMenuDB = { ...this.state.itemsMenu }
    if (position !== '') {
      if (itemsMenuDB[key]) {
        itemsMenuDB[key].position = position
        menuBase[key].position = position || itemsMenuDB[key].position
      }
    }
    this.setState({ itemsMenu: itemsMenuDB })
  }

  changeMarkup(key, markup) {
    const menuBase = { ...this.state.menu }
    const itemsMenuDB = { ...this.state.itemsMenu }
    if (markup !== '') {
      itemsMenuDB[key].markup = markup
      menuBase[key].markup = itemsMenuDB[key].markup || markup
    }
    this.setState({ itemsMenu: itemsMenuDB })
  }

  changePermissions(key, access) {
    const menuBase = { ...this.state.menu }
    const itemsMenuDB = { ...this.state.itemsMenu }
    /* console.log('itemsMenuDB', itemsMenuDB); */
    if (itemsMenuDB[key]) {
      itemsMenuDB[key].permissions = access
      menuBase[key].permissions = itemsMenuDB[key].permissions || access
    }

    this.setState({ itemsMenu: itemsMenuDB, keySelect: Date.now() })
  }

  orderPosition(key, order) {
    const itemsMenu = { ...this.state.menu }
    const itemsMenuToOrder = { ...this.state.itemsMenu }
    itemsMenuToOrder[key].position = order !== '' ? parseInt(order) : 0
    itemsMenu[key].position =
      itemsMenuToOrder[key].position || order !== '' ? parseInt(order) : 0
    this.setState({ itemsMenu: itemsMenuToOrder })
  }
  render() {
    const userContext = this.context
    console.log('props', this.props.event.visibility)
    const userPlan = userContext.value?.plan
    return (
      <>
        <Form {...formLayout} onFinish={this.submit}>
          <Header
            title={
              this.props.organization != 1
                ? 'Habilitar secciones del curso'
                : 'Secciones a habilitar para cada curso'
            }
            description="(Podrás guardar la configuración de tu menú en la parte inferior)"
            save
            form
          />

          <Spin tip="Cargando..." size="large" spinning={this.state.isLoading}>
            <Row gutter={[8, 8]} wrap>
              {Object.keys(this.state.menu).map((key, index) => (
                <Col key={key} xs={24} sm={8} md={6} lg={6} xl={6} xxl={6}>
                  <Card
                    title={this.state.menu[key].name}
                    bordered
                    style={{ maxHeight: '350px' }}>
                    {(this.state.menu[key].section === 'networking' ||
                      this.state.menu[key].section === 'interviews' ||
                      this.state.menu[key].section === 'my_sesions') &&
                    this.props.event?.visibility === 'ANONYMOUS' ? (
                      <Result
                        title="No está disponible para este tipo de acceso del curso"
                        icon={<></>}
                      />
                    ) : (
                      <>
                        <Form.Item name={this.state.menu[key].name}>
                          <Button
                            onClick={() => {
                              this.mapActiveItemsToAvailable(key)
                            }}>
                            {this.state.menu[key].checked ? 'Deshabilitar' : 'Habilitar'}
                          </Button>
                        </Form.Item>
                        <Form.Item label="Cambiar nombre de la sección">
                          <Input
                            name={`name${index}`}
                            disabled={this.state.menu[key].checked ? false : true}
                            //value={this.state.menu[key].name}
                            onChange={(e) => {
                              this.changeNameMenu(key, e.target.value)
                            }}
                            placeholder={this.state.menu[key].name}
                          />
                        </Form.Item>
                        <Form.Item label="Permisos para la sección">
                          <Select
                            name={`permissions${index}`}
                            key={this.state.keySelect}
                            disabled={this.state.menu[key].checked ? false : true}
                            value={this.state.menu[key].permissions}
                            onChange={(e) => {
                              this.changePermissions(key, e)
                            }}>
                            <Option value="public">Abierto para todos</Option>
                            <Option value="assistants">
                              Usuarios inscritos al curso
                            </Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Posición en el menú">
                          <InputNumber
                            name={`position${index}`}
                            disabled={this.state.menu[key].checked ? false : true}
                            value={this.state.menu[key].position}
                            onChange={(e) => this.orderPosition(key, e)}
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
    )
  }
}

export default MenuLanding
