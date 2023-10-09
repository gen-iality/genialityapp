import { Component, FunctionComponent, PropsWithChildren } from 'react'
import { Route, redirect, Routes, Link, Navigate, Outlet } from 'react-router-dom'
import dayjs from 'dayjs'
import momentLocalizer from 'react-widgets-moment'
import Loading from '../loaders/loading'
import { EventsApi } from '@helpers/request'
import ListEventUser_Old from '../event-users/index'
import ListEventUserPage from '../event-users/ListEventUserPage'
import { fetchRol } from '../../redux/rols/actions'
import { fetchPermissions } from '../../redux/permissions/actions'
import connect from 'react-redux/es/connect/connect'
import ChatExport from './ChatExport'
import Espacios from '../espacios'
import Herramientas from '../herramientas'
import Menu from './shared/menu'
import Datos from './datos'
import TipoAsistentes from './tipoUsers'
import ConfirmacionRegistro from './registro/confirmacionRegistro'
import ErrorServe from '../modal/serverError'
import AgendaRoutes from '../agenda'
import ModulePage from '../agenda/ModulePage'
import EmpresasRoutes from '../empresas'
import TriviaRoutes from '../trivia/TriviaRoutes'
import DocumentsRoutes from '../documents/DocumentsRoutes'
import SpeakersRoutes from '../speakers/SpeakersRoutes'
import MenuLanding from '../menuLanding'
import ReportList from '../agenda/report'
import ConferenceRoute from '../zoom/index'
import ReportNetworking from '../networking/report'
import NewsSectionRoutes from '../news/newsRoute'
import ProductSectionRoutes from '../products/productsRoute'
import { WithRouterProps, withRouter } from '@/withRouter'
import withContext from '@context/withContext'
import { Layout, Row, Col, Button, Result, Tag } from 'antd'
import { AdminUsers } from '@components/AdminUsers/AdminUsers'
import loadable from '@loadable/component'
import NoMatchPage from '../notFoundPage/NoMatchPage'
import ValidateAccessRouteCms from '../roles/hooks/ValidateAccessRouteCms'
import { StateMessage } from '@context/MessageService'
import { handleRequestError } from '@helpers/utils'
import {
  featureBlockingListener,
  featureBlockingStatusSave,
} from '@/services/featureBlocking/featureBlocking'
import IsolatedRoutes from '../isolated/IsolatedRoutes'
import TimeTrackingRoutes from '../time-tracking/TimeTrackingRoutes'
import { FileProtectOutlined } from '@ant-design/icons'
import CertificateEmailEditPage from '@components/invitations/CertificateEmailEditPage'

const { Sider, Content } = Layout

// Code splitting
const General = loadable(() => import('./general'))
const Informativesection = loadable(
  () => import('./informativeSections/adminInformativeSection'),
)

//invitations
const InvitedUsers = loadable(() => import('../invitations/InvitedUsers'))

//Messages
const Messages = loadable(() => import('../messages'))

const Styles = loadable(() => import('../App/styles'))
const DashboardEvent = loadable(() => import('../dashboard'))
const BadgeEvent = loadable(() => import('../badge'))
const OrdersEvent = loadable(() => import('../orders'))
const CertificateRoutes = loadable(() => import('../certificates/CertificateRoutes'))
const NotificationsApp = loadable(() => import('../pushNotifications/index'))
const Wall = loadable(() => import('../wall/index'))

const FAQS = loadable(() => import('../faqs'))
const EventsTicket = loadable(() => import('../ticketsEvent'))

// import StillInDeveloping from '@components/StillInDeveloping'

dayjs.locale('es')
momentLocalizer()

interface IProtected {
  event?: any
}

const Protected: FunctionComponent<PropsWithChildren<IProtected>> = ({
  children,
  event,
}) =>
  event?.user_properties && event?.user_properties?.length > 0 ? (
    <ValidateAccessRouteCms isForEvent>{children}</ValidateAccessRouteCms>
  ) : (
    <Navigate to="agenda" />
  )

type EventAdminRoutesProps = {}

type EventAdminRoutesState = {}

class EventAdminRoutes extends Component<
  WithRouterProps<EventAdminRoutesProps>,
  WithRouterProps<EventAdminRoutesState>
> {
  constructor(props: WithRouterProps<EventAdminRoutesProps>) {
    super(props)
    this.state = {
      loading: true,
      event: null,
      collapsed: false,
    }
    this.addNewFieldsToEvent = this.addNewFieldsToEvent.bind(this)
  }

  async componentDidMount() {
    const helperDispatch = this.props.cHelper.helperDispatch

    try {
      await this.props.dispatch(fetchRol())
      const eventId = this.props.params.event
      await this.props.dispatch(fetchPermissions(eventId))
      const event = await EventsApi.getOne(eventId)
      const eventWithExtraFields = this.addNewFieldsToEvent(event)
      featureBlockingListener(eventId, helperDispatch)
      this.setState({ event: eventWithExtraFields, loading: false })
    } catch (e) {
      StateMessage.show(null, 'error', handleRequestError(e).message)
      this.setState({ loading: false, error: e })
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.event !== this.state.event) {
      const { event } = this.state
      const eventWithExtraFields = this.addNewFieldsToEvent(event)
      this.setState({ event: eventWithExtraFields })
    }
  }

  addNewFieldsToEvent(event: any) {
    // const dateFrom = event.datetime_from.split(' ')
    // const dateTo = event.datetime_to.split(' ')
    event.hour_start = dayjs(event.datetime_from).toDate()
    event.hour_end = dayjs(event.datetime_to).toDate()
    event.date_start = dayjs(event.datetime_from).toDate()
    event.date_end = dayjs(event.datetime_to).toDate()
    event.address = event.address ? event.address : ''

    return event
  }

  componentWillUnmount() {
    this.setState({ newEvent: false })
  }

  updateEvent = (event: any) => {
    this.setState({ event })
  }

  isUpper(str: string) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str)
  }

  isLowerCase(str: string) {
    return /[a-z]/.test(str) && !/[A-Z]/.test(str)
  }

  FriendLyUrl(url: string) {
    // TODO: improve this method, pull apart and add tests... please
    let formatUpperOrLowercase = url.toString()

    if (this.isUpper(url.toString())) {
      formatUpperOrLowercase = url.toString().toUpperCase()
    } else if (this.isLowerCase(url.toString())) {
      formatUpperOrLowercase = url.toString().toLowerCase()
    }

    let encodedUrl = formatUpperOrLowercase.split(/\&+/).join('-and-')
    if (this.isUpper(url)) {
      encodedUrl = encodedUrl.split(/[^A-Z0-9]/).join('-')
    } else if (this.isLowerCase(url.toString())) {
      encodedUrl = encodedUrl.split(/[^a-z0-9]/).join('-')
    } else {
      encodedUrl = encodedUrl.split(/-+/).join('-')
    }

    encodedUrl = encodedUrl.replaceAll(' ', '-')
    encodedUrl = encodedUrl.trim('-')
    return encodedUrl
  }

  collapseMenu = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const { match, permissions } = this.props
    const { id } = this.props.params
    const { error, collapsed, event } = this.state
    console.log('permissions', permissions)

    if (this.state.loading || this.props.loading || permissions.loading)
      return <Loading />
    if (this.props.error || permissions.error)
      return <ErrorServe errorData={permissions.error} />
    if (error)
      return (
        <Result
          status="error"
          title="Error inesperado"
          subTitle={`Lo sentimos, hubo un error de tipo: ${
            handleRequestError(error).message
          }`}
          extra={[
            <Link key={0} to="/">
              <Button type="primary" key="eventData">
                Ver más cursos
              </Button>
            </Link>,
          ]}
        />
      )

    return (
      <Layout className="columns">
        <Sider
          style={{
            overflow: 'auto',
            background: '#1B1E28',
          }}
          width={250}
          collapsed={collapsed}
        >
          <Menu match={match} collapseMenu={this.collapseMenu} collapsed={collapsed} />
        </Sider>
        <Content className="column event-main" style={{ width: 500 }}>
          <Row gutter={[16, 16]} wrap>
            <Col>
              <Button
                type="primary"
                size="small"
                target="_blank"
                href={`${window.location.origin}/landing/${this.state.event._id}`}
              >
                Ir al curso: {event.name}
              </Button>
              {event.type_event === 'certification' && (
                <>
                  {' '}
                  <Tag color="#61E62C" icon={<FileProtectOutlined />}>
                    Certificación
                  </Tag>
                </>
              )}
            </Col>
          </Row>
          <section className="section event-wrapper">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Navigate to="main" />
                  </>
                }
              />

              <Route
                element={
                  <Protected event={event}>
                    <Outlet />
                  </Protected>
                }
              >
                <Route
                  path="main"
                  element={
                    <General
                      eventId={event._id}
                      event={event}
                      updateEvent={this.updateEvent}
                    />
                  }
                />
                <Route path="wall" element={<Wall eventId={event._id} event={event} />} />
                {/* En esta ruta se pueden crear y ver los post de la seccion muro que hay en la landing */}
                <Route
                  path="datos"
                  element={<Datos eventId={event._id} event={event} />}
                />
                <Route
                  path="agenda/*"
                  element={<AgendaRoutes event={event} eventId={event._id} />}
                />
                <Route
                  path="module"
                  element={<ModulePage eventId={event._id} event={event} />}
                />
                {/* Next routu is ununsed and undefined */}
                <Route
                  path="adminUsers"
                  element={<AdminUsers eventId={event._id} event={event} />}
                />
                <Route path="empresas/*" element={<EmpresasRoutes event={event} />} />
              </Route>
              <Route path="trivia/*" element={<TriviaRoutes event={event} />} />
              <Route path="documents/*" element={<DocumentsRoutes event={event} />} />
              {/* esta ruta carga en blanco */}
              <Route path="conference" element={<ConferenceRoute event={event} />} />
              <Route path="menuLanding" element={<MenuLanding event={event} />} />
              <Route
                path="reportNetworking"
                element={<ReportNetworking event={event} />}
              />
              <Route
                path="assistants.old"
                element={<ListEventUser_Old shownAll eventId={event._id} event={event} />}
              />
              <Route path="assistants" element={<ListEventUserPage event={event} />} />

              <Route
                path="chatexport"
                element={<ChatExport eventId={event._id} event={event} />}
              />
              <Route
                path="checkin.old/:id"
                element={
                  <ListEventUser_Old
                    eventId={event._id}
                    event={event}
                    type="activity"
                    shownAll={false}
                  />
                }
              />
              <Route
                path="checkin/:activityId"
                element={<ListEventUserPage event={event} />}
              />
              <Route
                path="checkin-actividad"
                element={<ReportList eventId={event._id} event={event} />}
              />
              <Route
                path="informativesection"
                element={<Informativesection eventId={event._id} event={event} />}
              />
              {/** AÚN NO TIENEN PERMISOS */}
              <Route path="invitados/*" element={<InvitedUsers event={event} />} />
              <Route
                path="certificate-email"
                element={<CertificateEmailEditPage event={event} />}
              />
              <Route path="messages/*" element={<Messages event={event} />} />
              <Route
                path="confirmacion-registro"
                element={<ConfirmacionRegistro event={event} />}
              />
              <Route
                path="tipo-asistentes/*"
                element={<TipoAsistentes event={event} />}
              />
              <Route
                path="dashboard"
                element={
                  // <StillInDeveloping disableTesting>
                  <DashboardEvent eventId={event._id} event={event} />
                  // </StillInDeveloping>
                }
              />
              <Route
                path="badge"
                element={<BadgeEvent eventId={event._id} event={event} />}
              />
              <Route path="orders" element={<OrdersEvent event={event} />} />
              <Route
                path="certificates/*"
                element={<CertificateRoutes event={event} />}
              />
              <Route path="espacios/*" element={<Espacios event={event} />} />
              <Route path="herramientas/*" element={<Herramientas event={event} />} />
              <Route path="speakers/*" element={<SpeakersRoutes eventID={event._id} />} />
              <Route
                path="styles"
                element={<Styles eventId={event._id} event={event} />}
              />
              {/* Ruta no usada posiblemente es la version 1 de la ruta /menuLanding */}
              <Route
                path="notificationsApp"
                element={<NotificationsApp event={event} />}
              />
              <Route
                path="news/*"
                element={<NewsSectionRoutes eventId={event._id} event={event} />}
              />
              <Route
                path="product/*"
                element={<ProductSectionRoutes eventId={event._id} event={event} />}
              />
              <Route path="faqs/*" element={<FAQS event={event} />} />
              <Route
                path="ticketsEvent/*"
                element={<EventsTicket eventId={event._id} event={event} />}
              />

              <Route
                path="timetracking/*"
                element={<TimeTrackingRoutes event={this.state.event} />}
              />
              {/* Este componente se muestra si una ruta no coincide */}
              <Route
                path="/"
                element={<NoMatchPage eventId={event._id} urlFrom=".." />}
              />
            </Routes>
          </section>
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.rols.loading,
  permissions: state.permissions,
  showMenu: state.user.menu,
  error: state.rols.error,
})

export default connect(mapStateToProps)(withContext(withRouter(EventAdminRoutes)))
