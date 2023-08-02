import { Component, FunctionComponent } from 'react'
import { Route, Redirect, Switch, Link, RouteProps } from 'react-router-dom'
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
import { withRouter } from 'react-router-dom'
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
const InvitedUsers = loadable(() => import('../invitations'))

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

dayjs.locale('es')
momentLocalizer()

interface IProtected extends RouteProps {
  event?: any
  url?: string
}

const Protected: FunctionComponent<IProtected> = (props) => {
  const { render, event, url, ...rest } = props

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        event?.user_properties && event?.user_properties?.length > 0 ? (
          <ValidateAccessRouteCms isForEvent isForOrganization={false}>
            {render && render(routeProps)}
          </ValidateAccessRouteCms>
        ) : (
          <Redirect push to={`${url}/agenda`} />
        )
      }
    />
  )
}

class EventAdminRoutes extends Component {
  constructor(props) {
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
      const eventId = this.props.match.params.event
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
            <Link key={0} to={`/`}>
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
            <Switch>
              <Route
                exact
                path={`${match.url}/`}
                render={() => (
                  <Redirect
                    to={`${match.url}${match.url.substr(-1) === '/' ? 'main' : '/main'}`}
                  />
                )}
              />
              <Protected
                path={`${match.url}/main`}
                event={event}
                render={() => (
                  <General
                    eventId={event._id}
                    event={event}
                    updateEvent={this.updateEvent}
                  />
                )}
              />
              {/* En esta ruta se pueden crear y ver los post de la seccion muro que hay en la landing */}
              <Protected
                path={`${match.url}/wall`}
                event={event}
                render={() => <Wall eventId={event._id} event={event} />}
              />
              <Protected
                path={`${match.url}/datos`}
                event={event}
                render={() => <Datos eventId={event._id} event={event} />}
              />
              <Protected
                path={`${match.url}/agenda`}
                event={event}
                render={(routeProps) => (
                  <AgendaRoutes
                    event={event}
                    eventId={event._id}
                    matchUrl={routeProps.match.url}
                  />
                )}
              />
              <Protected
                path={`${match.url}/module`}
                event={event}
                render={() => <ModulePage eventId={event._id} event={event} />}
              />
              <Protected
                path={`${match.url}/adminUsers`}
                event={event}
                render={(routeProps) => (
                  <AdminUsers
                    eventId={event._id}
                    event={event}
                    matchUrl={routeProps.match.url}
                  />
                )}
              />
              <Protected
                path={`${match.url}/empresas`}
                event={event}
                render={(routeProps) => (
                  <EmpresasRoutes event={event} matchUrl={routeProps.match.url} />
                )}
              />
              <Protected
                path={`${match.url}/trivia`}
                event={event}
                render={(routeProps) => (
                  <TriviaRoutes event={event} matchUrl={routeProps.match.url} />
                )}
              />
              <Protected
                path={`${match.url}/documents`}
                event={event}
                render={(routeProps) => (
                  <DocumentsRoutes event={event} matchUrl={routeProps.match.url} />
                )}
              />
              {/* esta ruta carga en blanco */}
              <Protected
                path={`${match.url}/conference`}
                event={event}
                render={() => <ConferenceRoute event={event} />}
              />
              <Protected
                path={`${match.url}/menuLanding`}
                event={event}
                render={() => <MenuLanding event={event} />}
              />
              <Protected
                path={`${match.url}/reportNetworking`}
                event={event}
                render={() => <ReportNetworking event={event} />}
              />
              <Protected
                path={`${match.url}/assistants.old`}
                event={event}
                url={match.url}
                render={() => (
                  <ListEventUser_Old shownAll eventId={event._id} event={event} />
                )}
              />
              <Protected
                path={`${match.url}/assistants`}
                event={event}
                url={match.url}
                render={() => <ListEventUserPage event={event} parentUrl={match.url} />}
              />

              <Protected
                path={`${match.url}/chatexport`}
                url={match.url}
                event={event}
                render={() => <ChatExport eventId={event._id} event={event} />}
              />
              <Protected
                path={`${match.url}/checkin.old/:id`}
                url={match.url}
                event={event}
                render={() => (
                  <ListEventUser_Old
                    eventId={event._id}
                    event={event}
                    type="activity"
                    shownAll={false}
                  />
                )}
              />
              <Protected
                path={`${match.url}/checkin/:id`}
                url={match.url}
                event={event}
                render={(routeProps) => (
                  <ListEventUserPage
                    event={event}
                    activityId={routeProps.match.params.id}
                    parentUrl={match.url}
                  />
                )}
              />
              <Protected
                path={`${match.url}/checkin-actividad`}
                url={match.url}
                event={event}
                render={() => (
                  <ReportList eventId={event._id} event={event} matchUrl={match.url} />
                )}
              />
              <Protected
                path={`${match.url}/informativesection`}
                event={event}
                url={match.url}
                render={() => <Informativesection eventId={event._id} event={event} />}
              />
              {/** AÚN NO TIENEN PERMISOS */}
              <Protected
                path={`${match.url}/invitados`}
                event={event}
                render={() => (
                  <InvitedUsers eventId={event._id} event={event} parentUrl={match.url} />
                )}
              />
              <Protected
                path={`${match.url}/certificate-email`}
                event={event}
                render={() => <CertificateEmailEditPage event={event} />}
              />
              <Protected
                path={`${match.url}/messages`}
                event={event}
                render={() => <Messages event={event} matchUrl={match.url} />}
              />
              <Protected
                path={`${match.url}/confirmacion-registro`}
                event={event}
                render={() => <ConfirmacionRegistro event={event} />}
              />
              <Protected
                path={`${match.url}/tipo-asistentes`}
                event={event}
                render={(routeProps) => (
                  <TipoAsistentes event={event} matchUrl={routeProps.match.url} />
                )}
              />
              <Protected
                path={`${match.url}/dashboard`}
                event={event}
                render={() => <DashboardEvent eventId={event._id} event={event} />}
              />
              <Protected
                path={`${match.url}/badge`}
                event={event}
                render={() => <BadgeEvent eventId={event._id} event={event} />}
              />
              <Protected
                path={`${match.url}/orders`}
                event={event}
                render={() => <OrdersEvent event={event} />}
              />
              <Protected
                path={`${match.url}/certificates`}
                event={event}
                render={(routeProps) => (
                  <CertificateRoutes event={event} matchUrl={routeProps.match.url} />
                )}
              />
              <Protected
                path={`${match.url}/espacios`}
                event={event}
                render={(routeProps) => (
                  <Espacios event={event} matchUrl={routeProps.match.url} />
                )}
              />
              <Protected
                path={`${match.url}/herramientas`}
                event={event}
                render={(routeProps) => (
                  <Herramientas event={event} matchUrl={routeProps.match.url} />
                )}
              />
              <Protected
                path={`${match.url}/speakers`}
                event={event}
                render={(routeProps) => (
                  <SpeakersRoutes
                    event={event}
                    eventID={event._id}
                    matchUrl={routeProps.match.url}
                  />
                )}
              />
              <Protected
                path={`${match.url}/styles`}
                event={event}
                render={() => <Styles eventId={event._id} event={event} />}
              />
              {/* Ruta no usada posiblemente es la version 1 de la ruta /menuLanding */}
              <Protected
                path={`${match.url}/notificationsApp`}
                event={event}
                render={() => <NotificationsApp event={event} />}
              />
              <Protected
                path={`${match.url}/news`}
                event={event}
                render={(routeProps) => (
                  <NewsSectionRoutes
                    eventId={event._id}
                    event={event}
                    matchUrl={routeProps.match.url}
                  />
                )}
              />
              <Protected
                path={`${match.url}/product`}
                event={event}
                render={(routeProps) => (
                  <ProductSectionRoutes
                    eventId={event._id}
                    event={event}
                    matchUrl={routeProps.match.url}
                  />
                )}
              />
              <Protected
                path={`${match.url}/faqs`}
                event={event}
                render={(routeProps) => (
                  <FAQS event={event} matchUrl={routeProps.match.url} />
                )}
              />
              <Protected
                path={`${match.url}/ticketsEvent`}
                event={event}
                render={(routeProps) => (
                  <EventsTicket
                    eventId={event._id}
                    event={event}
                    matchUrl={routeProps.match.url}
                  />
                )}
              />
              <Protected
                path={`${match.url}/isolated`}
                event={this.state.event}
                render={(routeProps) => (
                  <IsolatedRoutes
                    event={this.state.event}
                    matchUrl={routeProps.match.url}
                  />
                )}
              />
              <Protected
                path={`${match.url}/timetracking`}
                event={this.state.event}
                render={(routeProps) => (
                  <TimeTrackingRoutes
                    event={this.state.event}
                    matchUrl={routeProps.match.url}
                  />
                )}
              />
              {/* Este componente se muestra si una ruta no coincide */}
              <Protected
                path={`${match.url}`}
                event={event}
                render={() => (
                  <NoMatchPage eventId={event._id} event={event} parentUrl={match.url} />
                )}
              />
            </Switch>
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
