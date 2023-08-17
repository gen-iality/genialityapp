/** React's libraries */
import { useState, useEffect, FunctionComponent, PropsWithChildren } from 'react'
import { Route, NavLink, Routes, useParams, useLocation, Outlet } from 'react-router-dom'

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
import ValidateAccessRouteCms from '@components/roles/hooks/ValidateAccessRouteCms'
import OrganizationTimeTrackingPage from './timetracking/OrganizationTimeTrackingPage'

interface IProtectedProps {
  orgId: string
}

const Protected: FunctionComponent<PropsWithChildren<IProtectedProps>> = ({
  children,
  orgId,
}) => (
  <ValidateAccessRouteCms isForOrganization orgId={orgId}>
    {children}
  </ValidateAccessRouteCms>
)

const OrganizationAdminRoutes: FunctionComponent = () => {
  const params = useParams<{ id?: string }>()
  const location = useLocation()
  const { pathname } = useLocation()
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
            <NavLink to="information" />
          </Menu.Item>
          <Menu.Item key="2" icon={<ScheduleOutlined />}>
            Cursos
            <NavLink to="events" />
          </Menu.Item>
          <Menu.Item key="3" icon={<SketchOutlined />}>
            Apariencia
            <NavLink to="appearance" />
          </Menu.Item>
          <Menu.Item key="4" icon={<TeamOutlined />}>
            Miembros
            <NavLink to="members" />
          </Menu.Item>
          {/* <Menu.Item key="4.1" icon={<DeleteOutlined />}>
                Organization Properties
                <NavLink to="organization-properties" />
              </Menu.Item> */}
          <Menu.Item key="5" icon={<TeamOutlined />}>
            Cargos
            <NavLink to="positions" />
          </Menu.Item>
          <Menu.Item key="6" icon={<TeamOutlined />}>
            Inscritos
            <NavLink to="registered" />
          </Menu.Item>
          <Menu.Item key="7" icon={<UserSwitchOutlined />}>
            <small>Configuración de Miembros</small>
            <NavLink to="membersettings" />
          </Menu.Item>
          <Menu.Item key="8" icon={<ProjectOutlined />}>
            <small>Configuración de Plantillas</small>
            <NavLink to="templatesettings" />
          </Menu.Item>
          <Menu.Item key="9" icon={<MenuOutlined />}>
            Menú Items
            <NavLink to="menuItems" />
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

            <Routes>
              <Route path="/" element={<OrgEvents org={organization} />} />

              <Route
                element={
                  <Protected orgId={organizationId!}>
                    <Outlet />
                  </Protected>
                }
              >
                <Route path="events" element={<OrgEvents org={organization} />} />
                <Route
                  path="information"
                  element={<OrganizationProfile org={organization} />}
                />
                <Route path="appearance" element={<Styles org={organization} />} />
                <Route
                  path="members"
                  element={<OrganizationMembersPage org={organization} />}
                />
                <Route
                  path="organization-properties"
                  element={<OrganizationPropertiesIsolatedPage org={organization} />}
                />
                <Route
                  path="positions"
                  element={
                    <OrganizationPositionsPage
                      path={`${pathname}/positions`}
                      org={organization}
                    />
                  }
                />
                <Route
                  path="positions/:positionId"
                  element={<PositionedUsersPage org={organization} />}
                />
                <Route
                  path="positions/:positionId/user/:userId"
                  element={<MembersCertificationPage org={organization} />}
                />
                <Route
                  path="positions/:positionId/user/:userId/logs/:certificationId"
                  element={<MemberCertificationLogsPage org={organization} />}
                />
                <Route
                  path="registered"
                  element={<OrgRegisteredUsers org={organization} />}
                />
                <Route
                  path="members/timetracking/:memberIdParam"
                  element={<OrganizationTimeTrackingPage org={organization} />}
                />
                <Route
                  path="membersettings"
                  element={<MemberSettings org={organization} />}
                />
                <Route
                  path="templatesettings"
                  element={<TemplateMemberSettings org={organization} />}
                />
                <Route path="menuItems" element={<MenuLanding org={organization} />} />

                <Route
                  path=""
                  element={<NoMatchPage urlFrom={pathname} org={organization} />}
                />
              </Route>
            </Routes>
          </div>
        )}
      </Layout.Content>
    </Layout>
  )
}

export default OrganizationAdminRoutes
