import React, { useState, useEffect } from 'react';
import { Route, NavLink, Redirect, Switch, withRouter } from 'react-router-dom';
import Loading from '../loaders/loading';
import { OrganizationApi } from '../../helpers/request';
import OrganizationProfile from './profile';
import Styles from '../App/styles';
import OrgEvents from './events';
import OrgMembers from './members';
import Datos from '../events/datos';
import MemberSettings from './memberSettings';
import { Tag, Menu, Row, Col, Button } from 'antd';
import { DoubleRightOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import MenuLanding from '../menuLanding';

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

  console.log('props.match.params.id', props.match.params.id);
  async function updateTemplate(template, fields) {
    let newTemplate = {
      name: template.template.name,
      user_properties: fields,
    };
    let resp = await OrganizationApi.updateTemplateOrganization(
      props.match.params.id,
      template.template._id,
      newTemplate
    );
    if (resp) {
      return true;
    }
    return false;
  }
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
                    <Route exact path={`${props.match.url}/events`} render={() => <OrgEvents org={organization} />} />
                    <Route
                      exact
                      path={`${props.match.url}/information`}
                      render={() => <OrganizationProfile org={organization} />}
                    />
                    <Route exact path={`${props.match.url}/appearance`} render={() => <Styles org={organization} />} />
                    <Route
                      exact
                      path={`${props.match.url}/members`}
                      render={() => <OrgMembers org={organization} url={props.match.url} />}
                    />
                    <Route
                      exact
                      path={`${props.match.url}/membersettings`}
                      render={() => <MemberSettings org={organization} url={props.match.url} />}
                    />

                    <Route
                      exact
                      path={`${props.match.url}/templatesettings`}
                      render={() => (
                        <Datos
                          type='organization'
                          eventID={props.match.params.id}
                          org={organization}
                          url={props.match.url}
                          edittemplate={true}
                          createNewField={async (fields, template, updateTable) => {
                            let fieldsNew = Array.from(template.datafields || []);
                            fieldsNew.push(fields);
                            let resp = await updateTemplate(template, fieldsNew);
                            if (resp) {
                              updateTable(fieldsNew);
                            }
                            //console.log('ADDFILED==>', resp, newTemplate);
                          }}
                          orderFields={async (fields, template, updateTable) => {
                            let resp = await updateTemplate(template, fields);
                            if (resp) {
                              updateTable(fields);
                            }
                          }}
                          editField={async (fieldId, field, fieldupdate, template, updateTable) => {
                            template.datafields = template.datafields.map((field) => {
                              return field?.order_weight == fieldupdate?.order_weight ? fieldupdate : field;
                            });
                            let resp = await updateTemplate(template, template.datafields);
                            if (resp) {
                              updateTable(template.datafields);
                            }
                          }}
                          deleteField={async (nameField, template, updateTable) => {
                            console.log(nameField, template);
                            let newtemplate = template.datafields?.filter((field) => field.name != nameField);
                            console.log('TEMPLATES==>', newtemplate);
                            let resp = await updateTemplate(template, newtemplate);
                            if (resp) {
                              updateTable(newtemplate);
                            }
                          }}
                        />
                      )}
                    />

                    <Route
                      exact
                      path={`${props.match.url}/menuItems`}
                      render={() => <MenuLanding organizationObj={organization} organization={1} />}
                    />

                    <Route component={NoMatch} />
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

function NoMatch({ location }) {
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

export default withRouter(Organization);
