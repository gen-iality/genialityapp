/** React's libraries */
import { useState, useEffect, FunctionComponent } from 'react'
import {
  Route,
  NavLink,
  Redirect,
  Switch,
  useParams,
  useLocation,
  useRouteMatch,
  RouteProps,
} from 'react-router-dom'

/** Antd imports */
import { Tag, Menu, Button, Layout } from 'antd'
import {
  DoubleRightOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ScheduleOutlined,
  BarsOutlined,
  SketchOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  ProjectOutlined,
  MenuOutlined,
} from '@ant-design/icons'

/** Helpers and utils */
import { OrganizationApi } from '@helpers/request'

/** Components */
import Loading from '@components/profile/loading'
import OrganizationProfile from './profile'
import OrgEvents from './events'
import Styles from '@components/App/styles'
import OrganizationMembersPage from './OrganizationMembersPage'
import OrganizationPositionsPage from './OrganizationPositionsPage'
import PositionedUsersPage from './PositionedUsersPage'
import MembersCertificationPage from './MembersCertificationPage'
import MemberCertificationLogsPage from './MemberCertificationLogsPage'
import OrgRegisteredUsers from './OrgRegisteredUsers'
import OrganizationPropertiesIsolatedPage from './OrganizationPropertiesIsolatedPage'
import MemberSettings from './memberSettings'
import TemplateMemberSettings from './templateMemberSettings'
import MenuLanding from '@components/menuLanding/index'
import NoMatchPage from '@components/notFoundPage/NoMatchPage'
import ValidateAccessRouteCms from '@components/roles/hooks/validateAccessRouteCms'
import OrganizationTimeTrackingPage from './timetracking/OrganizationTimeTrackingPage'

interface IProtected extends RouteProps {
  org: any
}

const Protected: FunctionComponent<IProtected> = ({ render, org, ...rest }) => (
  <Route
    {...rest}
    render={(routeProps) =>
      org?._id ? (
        <ValidateAccessRouteCms isForOrganization isForEvent={false}>
          {render && render(routeProps)}
        </ValidateAccessRouteCms>
      ) : (
        // <Redirect push to={`${url}/agenda`} />
        <>{console.log('debug no hay orgId')}</>
      )
    }
  />
)

const OrganizationAdminRoutes: FunctionComponent = () => {
  const params = useParams<{ id?: string }>()
  const location = useLocation()
  const match = useRouteMatch()
  const organizationId = params.id

  const [organization, setOrganization] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [collapseMenu, setCollapseMenu] = useState(false)

  async function getOrganizationData() {
    const org = await OrganizationApi.getOne(organizationId)
    setOrganization(org)
    setIsLoading(false)
    console.debug('loaded organization:', org)
  }

  useEffect(() => {
    getOrganizationData()
  }, [location.pathname])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Layout style={{ minHeight: '100vh' }} className="columns">
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={collapseMenu}
        theme="dark"
        /* style={{ backgroundColor: '#fff' }} */
        width={220}
      >
        <Button
          type="primary"
          onClick={() => setCollapseMenu(!collapseMenu)}
          style={{ marginBottom: 16 }}
          icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        />
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['1']}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="1" icon={<BarsOutlined />}>
            Información
            <NavLink to={`${match.url}/information`} />
          </Menu.Item>
          <Menu.Item key="2" icon={<ScheduleOutlined />}>
            Cursos
            <NavLink to={`${match.url}/events`} />
          </Menu.Item>
          <Menu.Item key="3" icon={<SketchOutlined />}>
            Apariencia
            <NavLink to={`${match.url}/appearance`} />
          </Menu.Item>
          <Menu.Item key="4" icon={<TeamOutlined />}>
            Miembros
            <NavLink to={`${match.url}/members`} />
          </Menu.Item>
          {/* <Menu.Item key="4.1" icon={<DeleteOutlined />}>
                Organization Properties
                <NavLink to={`${match.url}/organization-properties`} />
              </Menu.Item> */}
          <Menu.Item key="5" icon={<TeamOutlined />}>
            Cargos
            <NavLink to={`${match.url}/positions`} />
          </Menu.Item>
          <Menu.Item key="6" icon={<TeamOutlined />}>
            Inscritos
            <NavLink to={`${match.url}/registered`} />
          </Menu.Item>
          <Menu.Item key="7" icon={<UserSwitchOutlined />}>
            <small>Configuración de Miembros</small>
            <NavLink to={`${match.url}/membersettings`} />
          </Menu.Item>
          <Menu.Item key="8" icon={<ProjectOutlined />}>
            <small>Configuración de Plantillas</small>
            <NavLink to={`${match.url}/templatesettings`} />
          </Menu.Item>
          <Menu.Item key="9" icon={<MenuOutlined />}>
            {'Menú Items'}
            <NavLink to={`${match.url}/menuItems`} />
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content className="column event-main" style={{ width: 500 }}>
        {isLoading ? (
          <Loading />
        ) : (
          <div style={{ padding: '5px' }}>
            <Tag
              color="#003853"
              icon={<DoubleRightOutlined />}
              style={{ marginBottom: 10, marginLeft: 20 }}
            >
              <a
                target="_blank"
                href={`${window.location.origin}/organization/${organization._id}/events`}
              >
                {`Ir al landing de la organización: ${organization.name}`}
              </a>
            </Tag>

            <Switch>
              <Route
                exact
                path={`${match.url}/`}
                render={() => <Redirect to={`${match.url}/events`} />}
              />
              <Protected
                exact
                path={`${match.url}/events`}
                org={organization}
                render={() => <OrgEvents org={organization} />}
              />
              <Protected
                exact
                path={`${match.url}/information`}
                org={organization}
                render={() => <OrganizationProfile org={organization} />}
              />
              <Protected
                exact
                path={`${match.url}/appearance`}
                org={organization}
                render={() => <Styles org={organization} />}
              />
              <Protected
                exact
                path={`${match.url}/members`}
                org={organization}
                render={() => <OrganizationMembersPage org={organization} />}
              />
              <Protected
                exact
                path={`${match.url}/organization-properties`}
                org={organization}
                render={() => <OrganizationPropertiesIsolatedPage org={organization} />}
              />
              <Protected
                exact
                path={`${match.url}/positions`}
                org={organization}
                render={(routeProps) => (
                  <OrganizationPositionsPage
                    path={routeProps.match.path}
                    org={organization}
                  />
                )}
              />
              <Protected
                exact
                path={`${match.url}/positions/:positionId`}
                org={organization}
                render={(routeProps) => (
                  <PositionedUsersPage
                    match={routeProps.match as any}
                    org={organization}
                  />
                )}
              />
              <Protected
                exact
                path={`${match.url}/positions/:positionId/user/:userId`}
                component={MembersCertificationPage}
                org={organization}
                render={(routeProps) => (
                  <MembersCertificationPage
                    match={routeProps.match as any}
                    org={organization}
                  />
                )}
              />
              <Protected
                exact
                path={`${match.url}/positions/:positionId/user/:userId/logs/:certificationId`}
                org={organization}
                render={(routeProps) => (
                  <MemberCertificationLogsPage
                    match={routeProps.match as any}
                    org={organization}
                  />
                )}
              />
              <Protected
                exact
                path={`${match.url}/registered/`}
                org={organization}
                render={() => <OrgRegisteredUsers org={organization} />}
              />
              <Protected
                exact
                path={`${match.url}/members/timetracking/:memberIdParam`}
                org={organization}
                render={(routeProps) => (
                  <OrganizationTimeTrackingPage
                    match={routeProps.match}
                    org={organization}
                  />
                )}
              />
              <Protected
                exact
                path={`${match.url}/membersettings`}
                org={organization}
                render={() => <MemberSettings org={organization} />}
              />
              <Protected
                exact
                path={`${match.url}/templatesettings`}
                org={organization}
                render={(routeProps) => (
                  <TemplateMemberSettings match={routeProps.match} org={organization} />
                )}
              />
              <Protected
                exact
                path={`${match.url}/menuItems`}
                org={organization}
                render={() => <MenuLanding org={organization} />}
              />

              <Protected
                path={`${match.url}`}
                org={organization}
                render={(routeProps) => (
                  <NoMatchPage parentUrl={routeProps.match.path} org={organization} />
                )}
              />
            </Switch>
          </div>
        )}
      </Layout.Content>
    </Layout>
  )
}

export default OrganizationAdminRoutes
