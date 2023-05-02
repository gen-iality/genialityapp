import { Badge, Col, Menu, Row, Space } from 'antd'
import { useRouteMatch, Link, useLocation, useParams } from 'react-router-dom'
import * as iconComponents from '@ant-design/icons'
import { stylesMenuItems } from '../helpers/csshelpers'
import { useEventContext } from '@context/eventContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { setSectionPermissions } from '../../../../redux/sectionPermissions/actions'
import { connect } from 'react-redux'
import { useEffect, useState } from 'react'

const MenuEvent = ({ isMobile }) => {
  const { url } = useRouteMatch()
  const location = useLocation()
  const params = useParams()
  const cEvent = useEventContext()
  const { totalsolicitudes, eventPrivate } = useHelper()
  const [currentSection, setCurrentSection] = useState('')
  const event = cEvent.value

  /* useEffect(() => {
    const urlCompleta = location.pathname;
    const urlSplited = urlCompleta.split('/');
    console.log('1. urlSplited', urlSplited);
    const currentSection = urlSplited[3];
    setCurrentSection(currentSection);
  }, [location.pathname]); */

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
        <Menu style={stylesMenuItems} mode="inline" defaultSelectedKeys={['1']}>
          {event.itemsMenu &&
            !eventPrivate.private &&
            Object.keys(event.itemsMenu).map((key) => {
              //icono personalizado
              if (!event.itemsMenu[key].name || !event.itemsMenu[key].section) {
                return <></>
              }

              const icon = event.itemsMenu[key].icon

              const IconoComponente = iconComponents[icon]

              return key == 'networking' ? (
                <Menu.Item key={event.itemsMenu[key].section} className="MenuItem_event">
                  <Badge
                    key={event.itemsMenu[key].section}
                    count={totalsolicitudes}
                    offset={[-30, -2]}>
                    <Link
                      className="menuEvent_section-text"
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
                    <Menu.Item
                      key={event.itemsMenu[key].section}
                      className="MenuItem_event"
                      style={{
                        backgroundColor: location.pathname.includes(
                          event.itemsMenu[key].section,
                        )
                          ? '#859194'
                          : 'transparent',
                      }}
                      //selectedKeys={[currentSection]}
                    >
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
                        className="menuEvent_section-text"
                        style={{ color: event.styles.textMenu }}
                        to={`${url}/${event.itemsMenu[key].section}`}>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: event.styles.textMenu,
                            justifyContent: 'center',
                          }}>
                          {` ${event.itemsMenu[key].name}`}
                        </span>
                      </Link>
                    </Menu.Item>
                  </>
                )
              )
            })}
        </Menu>
      ) : (
        // </div>
        isMobile &&
        !eventPrivate.private && (
          <Menu style={stylesMenuItems} mode="vertical" defaultSelectedKeys={['1']}>
            {event.itemsMenu &&
              Object.keys(event.itemsMenu).map((key) => {
                //icono personalizado
                // Cambio de icono tripulación kellogs
                const icon = event.itemsMenu[key].icon

                const IconoComponente = iconComponents[icon]

                if (!event.itemsMenu[key].name || !event.itemsMenu[key].section) {
                  return <></>
                }

                return (
                  <Menu.Item
                    style={{
                      position: 'relative',
                      color: event.styles.textMenu,
                    }}
                    key={event.itemsMenu[key].section}
                    className="MenuItem_event">
                    <IconoComponente
                      style={{
                        margin: '0 auto',
                        fontSize: '22px',
                        color: event.styles.textMenu,
                      }}
                    />

                    <Link
                      className="menuEvent_section-text"
                      style={{ color: event.styles.textMenu }}
                      to={`${url}/${event.itemsMenu[key].section}`}>
                      {` ${event.itemsMenu[key].name}`}
                    </Link>
                  </Menu.Item>
                )
              })}
          </Menu>
        )
      )}
    </>
  )
}

const mapStateToProps = (state) => ({
  sectionPermissions: state.viewSectionPermissions,
})

const mapDispatchToProps = {
  setSectionPermissions,
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuEvent)
