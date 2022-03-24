import { useState, useEffect } from 'react';
import { Route, NavLink, Redirect, Switch, withRouter } from 'react-router-dom';
import Loading from '../loaders/loading';
import { OrganizationApi } from '../../helpers/request';
import OrganizationProfile from './profile';
import Styles from '../App/styles';
import OrgEvents from './events';
import OrgMembers from './members';
import MemberSettings from './memberSettings';
import TemplateMemberSettings from './templateMemberSettings';
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
} from '@ant-design/icons';
import MenuLanding from '../menuLanding';
import NoMatchPage from '../notFoundPage/noMatchPage';
import ValidateAccessRouteCms from '../roles/hooks/validateAccessRouteCms';

function Organization(props) {
  const [organization, setOrganization] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const organizationId = props.match.params.id;
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
        <Layout style={{ width: '100%' }}>
          <Layout.Sider
            trigger={null}
            collapsible
            collapsed={collapseMenu}
            /* style={{ backgroundColor: '#fff' }} */
            width={220}>
            <Button
              type='primary'
              onClick={() => setCollapseMenu(!collapseMenu)}
              style={{ marginBottom: 16 }}
              icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['1']}
              mode='inline'
              theme='dark'
              //inlineCollapsed={collapseMenu}
            >
              <Menu.Item key={'1'} icon={<ScheduleOutlined />}>
                {'Eventos'}
                <NavLink to={`${props.match.url}/events`} />
              </Menu.Item>
              <Menu.Item key={'2'} icon={<BarsOutlined />}>
                {'Información'}
                <NavLink to={`${props.match.url}/information`} />
              </Menu.Item>
              <Menu.Item key={'3'} icon={<SketchOutlined />}>
                {'Apariencia'}
                <NavLink to={`${props.match.url}/appearance`} />
              </Menu.Item>
              <Menu.Item key={'4'} icon={<TeamOutlined />}>
                {'Miembros'}
                <NavLink to={`${props.match.url}/members`} />
              </Menu.Item>
              <Menu.Item key={'5'} icon={<UserSwitchOutlined />}>
                <small>{'Configuración de Miembros'}</small>
                <NavLink to={`${props.match.url}/membersettings`} />
              </Menu.Item>
              <Menu.Item key={'6'} icon={<ProjectOutlined />}>
                <small>{'Configuración de Plantillas'}</small>
                <NavLink to={`${props.match.url}/templatesettings`} />
              </Menu.Item>
              <Menu.Item key={'7'} icon={<MenuOutlined />}>
                {'Menú Items'}
                <NavLink to={`${props.match.url}/menuItems`} />
              </Menu.Item>
            </Menu>
          </Layout.Sider>
          <Layout.Content style={{ height: '100vh' }}>
            {isLoading ? (
              <Loading />
            ) : (
              <div style={{ padding: '5px' }}>
                <Tag color='#2bf4d5' icon={<DoubleRightOutlined />} style={{ marginBottom: 10, marginLeft: 20 }}>
                  <a
                    target='_blank'
                    href={`${window.location.origin}/organization/${organization._id}/events
                        `}>
                    {`Ir al landing de la organización: ${organization.name}`}
                  </a>
                </Tag>

                <Switch>
                  <Route
                    exact
                    path={`${props.match.url}/`}
                    render={() => <Redirect to={`${props.match.url}/events`} />}
                  />
                  {/* <Route exact path={`${props.match.url}/events`} render={() => <OrgEvents org={organization} />} /> */}
                  <Protected
                    exact
                    path={`${props.match.url}/events`}
                    component={OrgEvents}
                    org={organization}
                    componentKey='events'
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/information`}
                    component={OrganizationProfile}
                    org={organization}
                    componentKey='information'
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/appearance`}
                    component={Styles}
                    org={organization}
                    componentKey='appearance'
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/members`}
                    component={OrgMembers}
                    org={organization}
                    componentKey='members'
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/membersettings`}
                    component={MemberSettings}
                    org={organization}
                    componentKey='membersettings'
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/templatesettings`}
                    component={TemplateMemberSettings}
                    org={organization}
                    componentKey='templatesettings'
                  />
                  <Protected
                    exact
                    path={`${props.match.url}/menuItems`}
                    component={MenuLanding}
                    org={organization}
                    organizationObj={organization}
                    organization={1}
                    componentKey='menuItems'
                  />

                  <Protected
                    path={`${props.match.url}`}
                    component={NoMatchPage}
                    org={organization}
                    componentKey='NoMatch'
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
          <Component key='cmsOrg' {...props} {...rest} org={org} />
        </ValidateAccessRouteCms>
      ) : (
        // <Redirect push to={`${url}/agenda`} />
        console.log('debug no hay orgId')
      )
    }
  />
);

export default withRouter(Organization);
