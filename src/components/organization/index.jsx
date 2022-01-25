import React, { useState, useEffect } from 'react';
import { Route, NavLink, Redirect, Switch, withRouter } from 'react-router-dom';
import Loading from '../loaders/loading';
import { OrganizationApi } from '../../helpers/request';
import OrganizationProfile from './profile';
import Styles from '../App/styles';
import OrgEvents from './events';
import OrgMembers from './members';
import MemberSettings from './memberSettings';
import TemplateMemberSettings from './templateMemberSettings';
import { Tag, Menu, Row, Col, Button } from 'antd';
import { DoubleRightOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
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
        <div>
          <Button type='primary' onClick={() => setCollapseMenu(!collapseMenu)}>
            {React.createElement(collapseMenu ? MenuUnfoldOutlined : MenuFoldOutlined)}
          </Button>
          <Row gutter={[8, 8]} wrap>
            {!collapseMenu && (
              <Col
                xs={collapseMenu ? 24 : 0}
                sm={collapseMenu ? 24 : 0}
                md={collapseMenu ? 24 : 6}
                lg={collapseMenu ? 24 : 6}
                xl={collapseMenu ? 24 : 6}
                xxl={collapseMenu ? 24 : 6}>
                <Menu
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['1']}
                  mode='inline'
                  /* inlineCollapsed={collapseMenu} */
                >
                  <Menu.Item key={'1'}>
                    {'Eventos'}
                    <NavLink to={`${props.match.url}/events`} />
                  </Menu.Item>
                  <Menu.Item key={'2'}>
                    {'Información'}
                    <NavLink to={`${props.match.url}/information`} />
                  </Menu.Item>
                  <Menu.Item key={'3'}>
                    {'Apariencia'}
                    <NavLink to={`${props.match.url}/appearance`} />
                  </Menu.Item>
                  <Menu.Item key={'4'}>
                    {'Miembros'}
                    <NavLink to={`${props.match.url}/members`} />
                  </Menu.Item>
                  <Menu.Item key={'5'}>
                    {'Configuración de Miembros'}
                    <NavLink to={`${props.match.url}/membersettings`} />
                  </Menu.Item>
                  <Menu.Item key={'6'}>
                    {'Configuración de Plantillas'}
                    <NavLink to={`${props.match.url}/templatesettings`} />
                  </Menu.Item>
                  <Menu.Item key={'7'}>
                    {'Menú Items'}
                    <NavLink to={`${props.match.url}/menuItems`} />
                  </Menu.Item>
                </Menu>
              </Col>
            )}
            <Col
              xs={24}
              sm={24}
              md={collapseMenu ? 24 : 18}
              lg={collapseMenu ? 24 : 18}
              xl={collapseMenu ? 24 : 18}
              xxl={collapseMenu ? 24 : 18}>
              {isLoading ? (
                <Loading />
              ) : (
                <section className='section'>
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
                </section>
              )}
            </Col>
          </Row>
        </div>
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
