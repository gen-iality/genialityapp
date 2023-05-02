/** React's libraries */
import { useState, useEffect } from 'react';
import { Route, NavLink, Redirect, Switch, withRouter } from 'react-router-dom';

/** Antd imports */
import { Tag, Menu, Button, Layout } from 'antd';
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
  DeleteOutlined,
} from '@ant-design/icons';

/** Helpers and utils */
import { OrganizationApi } from '@helpers/request';

/** Components */
import Loading from '@components/profile/loading';
import OrganizationProfile from './profile';
import OrgEvents from './events';
import Styles from '@components/App/styles';
import OrgMembers from './members';
import OrganizationPositionsPage from './OrganizationPositionsPage';
import CurrentOrganizationPositionPage from './CurrentOrganizationPositionPage';
import MembersCertificationPage from './CurrentOrganizationPositionCertificationUserPage';
import MemberCertificationLogsPage from './MemberCertificationLogsPage';
import OrgRegisteredUsers from './OrgRegisteredUsers';
import OrganizationPropertiesIsolatedPage from './OrganizationPropertiesIsolatedPage';
import MemberSettings from './memberSettings';
import TemplateMemberSettings from './templateMemberSettings';
import MenuLanding from '@components/menuLanding/index';
import NoMatchPage from '@components/notFoundPage/noMatchPage';
import ValidateAccessRouteCms from '@components/roles/hooks/validateAccessRouteCms';
import OrganizationTimeTrackingPage from './timetracking/OrganizationTimeTrackingPage';

function Organization(props) {
  const organizationId = props.match.params.id;

  const [organization, setOrganization] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [collapseMenu, setCollapseMenu] = useState(false);

  async function getOrganizationData() {
    const org = await OrganizationApi.getOne(organizationId);
    setOrganization(org);
    setIsLoading(false);
  }

  useEffect(() => {
    getOrganizationData();
  }, [props.location.pathname]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Layout style={{ minHeight: '100vh' }} className="columns">
          <Layout.Sider
            trigger={null}
            collapsible
            collapsed={collapseMenu}
            theme="dark"
            /* style={{ backgroundColor: '#fff' }} */
            width={220}>
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
              //inlineCollapsed={collapseMenu}
            >
              <Menu.Item key="1" icon={<BarsOutlined />}>
                Información
                <NavLink to={`${props.match.url}/information`} />
              </Menu.Item>
              <Menu.Item key="2" icon={<ScheduleOutlined />}>
                Cursos
                <NavLink to={`${props.match.url}/events`} />
              </Menu.Item>
              <Menu.Item key="3" icon={<SketchOutlined />}>
                Apariencia
                <NavLink to={`${props.match.url}/appearance`} />
              </Menu.Item>
              <Menu.Item key="4" icon={<TeamOutlined />}>
                Miembros
                <NavLink to={`${props.match.url}/members`} />
              </Menu.Item>
              {/* <Menu.Item key="4.1" icon={<DeleteOutlined />}>
                Organization Properties
                <NavLink to={`${props.match.url}/organization-properties`} />
              </Menu.Item> */}
              <Menu.Item key="5" icon={<TeamOutlined />}>
                Cargos
                <NavLink to={`${props.match.url}/positions`} />
              </Menu.Item>
              <Menu.Item key="6" icon={<TeamOutlined />}>
                Inscritos
                <NavLink to={`${props.match.url}/registered`} />
              </Menu.Item>
              <Menu.Item key="7" icon={<UserSwitchOutlined />}>
                <small>Configuración de Miembros</small>
                <NavLink to={`${props.match.url}/membersettings`} />
              </Menu.Item>
              <Menu.Item key="8" icon={<ProjectOutlined />}>
                <small>Configuración de Plantillas</small>
                <NavLink to={`${props.match.url}/templatesettings`} />
              </Menu.Item>
              <Menu.Item key="9" icon={<MenuOutlined />}>
                {'Menú Items'}
                <NavLink to={`${props.match.url}/menuItems`} />
              </Menu.Item>
            </Menu>
          </Layout.Sider>
          <Layout.Content className="column event-main" style={{ width: 500 }}>
            {isLoading ? (
              <Loading />
            ) : (
              <div style={{ padding: '5px' }}>
                <Tag color="#003853" icon={<DoubleRightOutlined />} style={{ marginBottom: 10, marginLeft: 20 }}>
                  <a target="_blank" href={`${window.location.origin}/organization/${organization._id}/events`}>
                    {`Ir al landing de la organización: ${organization.name}`}
                  </a>
                </Tag>

                <Switch>
                  <Route
                    exact
                    path={`${props.match.url}/`}
                    render={() => <Redirect to={`${props.match.url}/events`} />}
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/events`}
                    component={OrgEvents}
                    org={organization}
                    componentKey="events"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/information`}
                    component={OrganizationProfile}
                    org={organization}
                    componentKey="information"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/appearance`}
                    component={Styles}
                    org={organization}
                    componentKey="appearance"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/members`}
                    component={OrgMembers}
                    org={organization}
                    componentKey="members"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/organization-properties`}
                    component={OrganizationPropertiesIsolatedPage}
                    org={organization}
                    componentKey="organization-properties"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/positions`}
                    component={OrganizationPositionsPage}
                    org={organization}
                    componentKey="positions"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/positions/:positionId`}
                    component={CurrentOrganizationPositionPage}
                    org={organization}
                    componentKey="current-positions"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/positions/:positionId/user/:userId`}
                    component={MembersCertificationPage}
                    org={organization}
                    componentKey="current-positions-certification-user"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/positions/:positionId/user/:userId/logs/:certificationId`}
                    component={MemberCertificationLogsPage}
                    org={organization}
                    componentKey="current-positions-certification-logs-user"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/registered/`}
                    component={OrgRegisteredUsers}
                    org={organization}
                    componentKey="members"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/members/timetracking/:memberIdParam`}
                    component={OrganizationTimeTrackingPage}
                    org={organization}
                    componentKey="members"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/membersettings`}
                    component={MemberSettings}
                    org={organization}
                    componentKey="membersettings"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/templatesettings`}
                    component={TemplateMemberSettings}
                    org={organization}
                    componentKey="templatesettings"
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/menuItems`}
                    component={MenuLanding}
                    org={organization}
                    organizationObj={organization}
                    organization={1}
                    componentKey="menuItems"
                  />

                  <Protected
                    path={`${props.match.url}`}
                    component={NoMatchPage}
                    org={organization}
                    componentKey="NoMatch"
                  />
                </Switch>
              </div>
            )}
          </Layout.Content>
        </Layout>
      )}
    </>
  );
}

const Protected = ({ component: Component, org, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      org?._id ? (
        <ValidateAccessRouteCms>
          <Component key="cmsOrg" {...props} {...rest} org={org} />
        </ValidateAccessRouteCms>
      ) : (
        // <Redirect push to={`${url}/agenda`} />
        console.log('debug no hay orgId')
      )
    }
  />
);

export default withRouter(Organization);
