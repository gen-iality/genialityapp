import { Badge, Col, Menu, Row, Space } from 'antd';
import { useRouteMatch, Link, useHistory } from 'react-router-dom';
import * as iconComponents from '@ant-design/icons';
import { stylesMenuItems } from '../helpers/csshelpers';
import { UseEventContext } from '../../../../context/eventContext';
import { useHelper } from '../../../../context/helperContext/hooks/useHelper';
import { setSectionPermissions } from '../../../../redux/sectionPermissions/actions';
import { connect } from 'react-redux';

const MenuEvent = ({ isMobile }) => {
  let { url } = useRouteMatch();
  let cEvent = UseEventContext();
  let { totalsolicitudes, eventPrivate } = useHelper();
  let event = cEvent.value;
  const history = useHistory();

  const redirectToPreLanding = () => {
    sessionStorage.removeItem('session');
    history.push(`/${cEvent.value._id}`)
  }

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
        <Menu style={stylesMenuItems} mode='inline' defaultSelectedKeys={['1']}>
          <Menu.Item className='MenuItem_event' key={'pre-landing'}>
            <Link className='menuEvent_section-text' style={{ color: 'black' }} onClick={redirectToPreLanding}>
              <iconComponents.ArrowLeftOutlined
                style={{
                  fontSize: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              Inicio
            </Link>
          </Menu.Item>
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
                key !== 'networking' && (
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
                )
              );
            })}
        </Menu>
      ) : (
        // </div>
        isMobile &&
        !eventPrivate.private && (
          <Menu style={stylesMenuItems} mode='vertical' defaultSelectedKeys={['1']}>
            <Menu.Item
              style={{
                position: 'relative',
                color: event.styles.textMenu,
              }}
              key={'pre-landing-drawer'}
              className='MenuItem_event'>
              <iconComponents.ArrowLeftOutlined
                  style={{
                    margin: '0 auto',
                    fontSize: '22px',
                  }}
                />

              <Link
                className='menuEvent_section-text'
                onClick={redirectToPreLanding}>
                {` Inicio`}
              </Link>
            </Menu.Item>
            {event.itemsMenu &&
              Object.keys(event.itemsMenu).map((key) => {
                //icono personalizado
                //CAMBIO DE ICONO TRIPULACIÓN KELLOGS
                let icon =
                  event._id === '62c5e89176dfb307163c05a9' && event.itemsMenu[key].icon == 'AudioOutlined'
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
