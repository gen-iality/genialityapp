import { Badge, Button, Menu, Space } from 'antd';
import { useRouteMatch, Link, useHistory, useLocation } from 'react-router-dom';
import * as iconComponents from '@ant-design/icons';
import { stylesMenuItems } from '../helpers/csshelpers';
import { UseEventContext } from '../../../../context/eventContext';
import { useHelper } from '../../../../context/helperContext/hooks/useHelper';
import { setSectionPermissions } from '../../../../redux/sectionPermissions/actions';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';

const MenuEvent = ({ isMobile }) => {
  let { url } = useRouteMatch();
  let cEvent = UseEventContext();
  let { totalsolicitudes, eventPrivate } = useHelper();
  let event = cEvent.value;
  const history = useHistory();
  const intl = useIntl();
  const location = useLocation();
  const menuActive = location.pathname.replace(`${url}/`, '');
  const redirectToPreLanding = () => {
    sessionStorage.removeItem('session');
    history.push(`/${cEvent.value._id}`);
  };

  return (
    <>
      {!isMobile ? (
        // <div
        //   style={{
        //     backgroundColor: 'red',
        //     overflowY: 'auto',
        //     overflowX: 'hidden',
        //     minHeight: '100vh',
        //     maxHeight: '100vh',
        //   }}
        // >
        <Menu style={stylesMenuItems} mode='inline' selectedKeys={[menuActive]} defaultSelectedKeys={['1']}>
          {event.redirect_landing === true ? null : (
            <Menu.Item className='MenuItem_event' key={'pre-landing'}>
              <Button
                type='primary'
                className='menuEvent_section-text'
                style={{
                  fontSize: '22px',
                  color: event.styles.textMenu,
                  backgroundColor: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'none'
                }}
                onClick={redirectToPreLanding}>
                <Space direction='vertical'>
                  <iconComponents.HomeOutlined
                    style={{
                      fontSize: '22px',
                      color: event.styles.textMenu,
                    }}
                  />
                  {intl.formatMessage({id: 'header.home', defaultMessage: 'Inicio'})}
                </Space>
              </Button>
            </Menu.Item>
          )}
          {event.itemsMenu &&
            !eventPrivate.private &&
            Object.keys(event.itemsMenu).map((key) => {
              //icono personalizado
              if (!event.itemsMenu[key].name || !event.itemsMenu[key].section) {
                return <></>;
              }

              let icon =
                event._id === '62c5e89176dfb307163c05a9' && event.itemsMenu[key].icon === 'AudioOutlined'
                  ? 'RocketOutlined'
                  : event.itemsMenu[key].icon;

              let IconoComponente = iconComponents[icon];

              return key === 'networking' ? (
                <Menu.Item key={event.itemsMenu[key].section} className='MenuItem_event'>
                  <Badge key={event.itemsMenu[key].section} count={totalsolicitudes} offset={[-30, -2]}>
                    <Link
                      className='menuEvent_section-text'
                      style={{ color: event.styles.textMenu }}
                      to={`${url}/${event.itemsMenu[key].section}`}>
                      <IconoComponente
                        style={{
                          fontSize: '22px',
                          color: event.styles.textMenu,
                        }}
                      />
                      {` ${event.itemsMenu[key].name}`}
                    </Link>
                  </Badge>
                </Menu.Item>
              ) : (
                <>
                  <Menu.Item key={event.itemsMenu[key].section} className='MenuItem_event'>
                    <IconoComponente
                      style={{
                        fontSize: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        color: event.styles.textMenu,
                        justifyContent: 'center',
                      }}
                    />
                    <Link
                      className='menuEvent_section-text'
                      style={{ color: event.styles.textMenu }}
                      to={`${url}/${event.itemsMenu[key].section}`}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: event.styles.textMenu,
                          justifyContent: 'center',
                        }}>
                        {` ${event.itemsMenu[key].label ? event.itemsMenu[key].label : event.itemsMenu[key].name}`}
                      </span>
                    </Link>
                  </Menu.Item>
                </>
              );
            })}
        </Menu>
      ) : (
        // </div>
        isMobile &&
        !eventPrivate.private && (
          <Menu style={stylesMenuItems} mode='vertical' defaultSelectedKeys={['1']} selectedKeys={[menuActive]}>
            <Menu.Item
              style={{
                position: 'relative',
                color: event.styles.textMenu,
              }}
              key={'pre-landing-drawer'}
              className='MenuItem_event'>
              <Space size={4}>
                <iconComponents.HomeOutlined
                  style={{
                    margin: '0 auto',
                    fontSize: '22px',
                    color: event.styles.textMenu,
                  }}
                />

                <Link className='menuEvent_section-text' onClick={redirectToPreLanding} style={{ color: event.styles.textMenu }}>
                  {intl.formatMessage({id: 'header.home', defaultMessage: 'Inicio'})}
                </Link>
              </Space>
            </Menu.Item>
            {event.itemsMenu &&
              Object.keys(event.itemsMenu).map((key) => {
                //icono personalizado
                //CAMBIO DE ICONO TRIPULACIÓN KELLOGS
                let icon =
                  event._id === '62c5e89176dfb307163c05a9' && event.itemsMenu[key].icon === 'AudioOutlined'
                    ? 'RocketOutlined'
                    : event.itemsMenu[key].icon;

                let IconoComponente = iconComponents[icon];

                if (!event.itemsMenu[key].name || !event.itemsMenu[key].section) {
                  return <></>;
                }

                return (
                  <Menu.Item
                    style={{
                      position: 'relative',
                      color: event.styles.textMenu,
                    }}
                    key={event.itemsMenu[key].section}
                    className='MenuItem_event'>
                    <IconoComponente
                      style={{
                        margin: '0 auto',
                        fontSize: '22px',
                        color: event.styles.textMenu,
                      }}
                    />

                    <Link
                      className='menuEvent_section-text'
                      style={{ color: event.styles.textMenu }}
                      to={`${url}/${event.itemsMenu[key].section}`}>
                      {` ${event.itemsMenu[key].name}`}
                    </Link>
                  </Menu.Item>
                );
              })}
          </Menu>
        )
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  sectionPermissions: state.viewSectionPermissions,
});

const mapDispatchToProps = {
  setSectionPermissions,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuEvent);
