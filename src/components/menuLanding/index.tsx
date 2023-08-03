import { useEffect, FunctionComponent, useState, useMemo } from 'react'
import {
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
import { StateMessage } from '@context/MessageService'
// import { CurrentUserContext } from '@context/userContext'

interface IMenuItem {
  [key: string]: {
    name: string
    section: string
    position: number
    icon: string
    checked: boolean
    permissions: string
    markup?: string
  }
}

interface IMenuLandingProps {
  org?: any
  event?: any
}

const { Option } = Select
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const initialMenu: IMenuItem = {
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
    // section: 'certs',
    section: 'certificate',
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
}

const MenuLanding: FunctionComponent<IMenuLandingProps> = (props) => {
  const [menu, setMenu] = useState<any>(initialMenu)
  const [menuItems, setMenuItems] = useState<any>({})
  const [keySelect, setKeySelect] = useState(Date.now())
  const [isLoading, setIsLoading] = useState(true)

  const loadMenuItemsData = async () => {
    console.debug('requesting menu items from back-end')
    const menuBase = { ...menu }
    let menuLanding: any = {}
    if (!props.org) {
      const token = await GetTokenUserFirebase()
      menuLanding = await Actions.getAll(`/api/events/${props.event._id}?token=${token}`)
      console.debug('menuLanding', menuLanding)
    } else {
      // Obtener de organización

      menuLanding.itemsMenu = props.org.itemsMenu || []
      const newMenuItems = menuLanding.itemsMenu
      setMenuItems(newMenuItems) // I think this is going thus
    }

    for (const menuBaseProp in menuBase) {
      for (const menuRemoteProp in menuLanding.itemsMenu) {
        if (menuRemoteProp === menuBaseProp) {
          saveOrRemoveThisMenuItems(menuBaseProp)
          changeMenuName(menuBaseProp, menuLanding.itemsMenu[menuRemoteProp]?.name)
          changeMenuPosition(menuBaseProp, menuLanding.itemsMenu[menuRemoteProp].position)
          if (menuLanding.itemsMenu[menuRemoteProp].markup) {
            changeMarkup(menuBaseProp, menuLanding.itemsMenu[menuRemoteProp].markup)
          }
          changePermissions(
            menuBaseProp,
            menuLanding.itemsMenu[menuRemoteProp].permissions,
          )
        }
      }
    }
  }

  /**
   * Given a menu items, sort according of their position attribute.
   * @param menuItems menuItems to sort
   * @returns A sortted menu items
   */
  const orderMenuItems = (menuItems: any) => {
    let menuItemsData: any = {}
    const menuItemsToSave: any = {}
    let items: any[] = Object.values(menuItems)

    items = items.map((item) => {
      return {
        ...item,
        position: (item.position = !item.position ? 30 : parseInt(item.position)),
      }
    })

    items.sort((a, b) => (a.position || 0) - (b.position || 0))

    menuItemsData = Object.assign({}, items)

    for (const item in menuItemsData) {
      menuItemsToSave[menuItemsData[item].section] = menuItemsData[item]
    }
    return menuItemsToSave
  }

  const submit = async () => {
    StateMessage.show('loading', 'loading', 'Por favor espere...')

    const menu = orderMenuItems(menuItems)
    const newMenu = { itemsMenu: { ...menu } }

    /*if (newMenu.itemsMenu.tickets) {
      newMenu.allow_register = true;
    } else {
      newMenu.allow_register = false;
    }*/

    if (!props.org) {
      const token = await GetTokenUserFirebase()
      await Actions.put(`api/events/${props.event._id}?token=${token}`, newMenu)
    } else {
      // Actualizar organizacion
      const updateOrganization = {
        ...props.org,
        itemsMenu: { ...menu },
      }
      const resp = await OrganizationApi.editMenu(
        { itemsMenu: menu },
        updateOrganization._id,
      )
      if (resp) {
        console.debug(resp)
      }
    }
    StateMessage.destroy('loading')
    StateMessage.show(null, 'success', 'Información guardada correctamente')
  }

  /**
   * Check if the value `checked` for this menu is true, then save its value in
   * the state that contains data to save in DB. Otherwise, the value will be
   * deleted.
   *
   * @param key the current menu item key.
   */
  const saveOrRemoveThisMenuItems = (key: string) => {
    console.log('clicked key', key)
    const menuBase = { ...menu }

    // Update/add this menu item or delete
    if (menuBase[key].checked) {
      console.debug(key, 'is active, then deactive')
      menuBase[key].checked = false
    } else {
      console.debug(key, 'is deactive, then active')
      menuBase[key].checked = true
    }

    console.log('will save', menuBase)
    setMenu(menuBase)
  }

  /**
   * Seach a menu item by a given key and update the name of this. This is
   * updated in local menu state and menu items from DB.
   *
   * @param key the current menu item key
   * @param name the new name to save
   * @returns nothing
   */
  const changeMenuName = (key: string, name: string) => {
    const menuBase = { ...menu }

    if (!name || !name.trim()) return

    if (!menuItems[key]) return

    menuBase[key].name = name

    setMenu(menuBase)
  }

  /**
   * Given a key, set the new position to this menu item and save in both state.
   *
   * @param key the current menu item key
   * @param position the new position to save
   * @returns nothing
   */
  const changeMenuPosition = (key: string, position: any) => {
    const menuBase = { ...menu }

    if (!position && position !== 0) return

    if (!menuItems[key]) return

    menuBase[key].position = position

    setMenu(menuBase)
  }

  /**
   * Save a new markup in the menu item according the given key.
   *
   * @param key The current menu item key
   * @param markup The new markup to save
   * @returns nothing
   */
  const changeMarkup = (key: string, markup: string) => {
    const menuBase = { ...menu }

    if (!markup || !markup.trim()) return

    if (!menuItems[key]) return

    menuBase[key].markup = markup

    setMenu(menuBase)
  }

  /**
   * Save a permissions to a menu item by the given key.
   *
   * @param key the current menu item key
   * @param access the new access to save
   * @returns nothing
   */
  const changePermissions = (key: string, access: string) => {
    const menuBase = { ...menu }

    if (!access || !access.trim()) return

    if (!menuItems[key]) return

    menuBase[key].permissions = access

    setKeySelect(Date.now())
    setMenu(menuBase)
  }

  const setOrderPosition = (key: string, order: any) => {
    const menuBase = { ...menu }

    const integerPosition = parseInt(order || 0)
    menuBase[key].position = integerPosition

    setMenu(menuBase)
  }

  useEffect(() => {
    loadMenuItemsData().finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const menuEntries = Object.entries({ ...menu }) as [string, any][]
    const onlyCheckedMenuEntries = menuEntries.filter((entry) => entry[1].checked)
    setMenuItems(Object.fromEntries(onlyCheckedMenuEntries))
  }, [menu])

  return (
    <>
      <Form {...formLayout} size="small" onFinish={submit}>
        <Header
          title={
            !props.org
              ? 'Habilitar secciones del curso'
              : 'Secciones a habilitar para cada curso'
          }
          back
          description="(Podrás guardar la configuración de tu menú en la parte inferior)"
          save
          form
        />

        <Spin tip="Cargando..." size="large" spinning={isLoading} />
        <Row gutter={[8, 8]} wrap>
          {Object.keys(menu).map((key, index) => (
            <Col key={key} xs={24} sm={8} md={6} lg={6} xl={6} xxl={6}>
              <Card
                title={menu[key].name}
                bordered
                style={{ maxHeight: '350px', border: '1px solid #999' }}
              >
                {(menu[key].section === 'networking' ||
                  menu[key].section === 'interviews' ||
                  menu[key].section === 'my_sesions') &&
                props.event?.visibility === 'ANONYMOUS' ? (
                  <Result
                    title="No está disponible para este tipo de acceso del curso"
                    icon={<></>}
                  />
                ) : (
                  <>
                    <Form.Item name={menu[key].name}>
                      <Button
                        onClick={() => saveOrRemoveThisMenuItems(key)}
                        type={menu[key].checked ? 'primary' : 'dashed'}
                      >
                        {menu[key].checked ? 'Deshabilitar' : 'Habilitar'}
                      </Button>
                    </Form.Item>
                    <Form.Item label="Cambiar nombre de la sección">
                      <Input
                        name={`name${index}`}
                        disabled={menu[key].checked ? false : true}
                        //value={this.state.menu[key].name}
                        onChange={(e) => {
                          changeMenuName(key, e.target.value)
                        }}
                        placeholder={menu[key].name}
                      />
                    </Form.Item>
                    <Form.Item label="Permisos para la sección">
                      <Select
                        key={keySelect}
                        disabled={menu[key].checked ? false : true}
                        value={menu[key].permissions}
                        onChange={(e) => {
                          changePermissions(key, e)
                        }}
                      >
                        <Option value="public">Abierto para todos</Option>
                        <Option value="assistants">Usuarios inscritos al curso</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Posición en el menú">
                      <InputNumber
                        name={`position${index}`}
                        disabled={menu[key].checked ? false : true}
                        value={menu[key].position}
                        onChange={(e) => setOrderPosition(key, e)}
                      />
                    </Form.Item>
                  </>
                )}
              </Card>
            </Col>
          ))}
        </Row>
        <BackTop />
      </Form>
    </>
  )
}

export default MenuLanding
