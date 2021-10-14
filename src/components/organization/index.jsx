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
import { Tag } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import MenuLanding from '../menuLanding';

function Organization(props) {
  const [organization, setOrganization] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const organizationId = props.match.params.id;

  async function getOrganizationData() {
    const org = await OrganizationApi.getOne(organizationId);
    setOrganization(org);
    setIsLoading(false);
  }
  useEffect(() => {
    getOrganizationData();
  }, [props.location.pathname]);

  console.log('props.match.params.id', props.match.params.id);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <section className='columns'>
          <aside className='column menu event-aside is-2 has-text-weight-bold'>
            <div className={`is-hidden-mobile`}>
              <p className='menu-label has-text-centered-mobile'>
                <NavLink
                  className='item'
                  // onClick={this.handleClick}
                  activeClassName={'active'}
                  to={`${props.match.url}/events`}>
                  Eventos
                </NavLink>
              </p>
              <p className='menu-label has-text-centered-mobile'>
                <NavLink
                  className='item'
                  // onClick={this.handleClick}
                  activeClassName={'active'}
                  to={`${props.match.url}/information`}>
                  Información
                </NavLink>
              </p>
              <p className='menu-label has-text-centered-mobile'>
                <NavLink
                  className='item'
                  // onClick={this.handleClick}
                  activeClassName={'active'}
                  to={`${props.match.url}/appearance`}>
                  Apariencia
                </NavLink>
              </p>
              <p className='menu-label has-text-centered-mobile'>
                <NavLink
                  className='item'
                  // onClick={this.handleClick}
                  activeClassName={'active'}
                  to={`${props.match.url}/members`}>
                  Miembros
                </NavLink>
              </p>
              <p className='menu-label has-text-centered-mobile'>
                <NavLink
                  className='item'
                  // onClick={this.handleClick}
                  activeClassName={'active'}
                  to={`${props.match.url}/membersettings`}>
                  Configuración miembros
                </NavLink>
              </p>

              <p className='menu-label has-text-centered-mobile'>
                <NavLink
                  className='item'
                  // onClick={this.handleClick}
                  activeClassName={'active'}
                  to={`${props.match.url}/templatesettings`}>
                  Configuración de plantillas
                </NavLink>
              </p>
              <p className='menu-label has-text-centered-mobile'>
                <NavLink
                  className='item'
                  // onClick={this.handleClick}
                  activeClassName={'active'}
                  to={`${props.match.url}/menuItems`}>
                  Menú items
                </NavLink>
              </p>
            </div>
          </aside>
          <div className='column is-10'>
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
                        createNewField={async (fields, template) => {
                          let fieldsNew = Array.from(template.datafields || []);
                          fieldsNew.push(fields);
                          let newTemplate = {
                            name: template.template.name,
                            user_properties: fieldsNew,
                          };
                          //alert('NEW FIELD==>');

                          let resp = await OrganizationApi.updateTemplateOrganization(
                            props.match.params.id,
                            template.template._id,
                            newTemplate
                          );
                          //console.log('ADDFILED==>', resp, newTemplate);
                        }}
                      />
                    )}
                  />

                  <Route exact path={`${props.match.url}/menuItems`} render={() => <MenuLanding organization={1} />} />

                  <Route component={NoMatch} />
                </Switch>
              </section>
            )}
          </div>
        </section>
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
