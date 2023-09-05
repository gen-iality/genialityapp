import { Layout, Spin, Row, Image } from 'antd'
import { Link } from 'react-router-dom'
import MenuEvent from './Menus/MenuEvent'
// import { EyeOutlined } from '@ant-design/icons'
import { useEventContext } from '@context/eventContext'
// import { useHelper } from '@context/helperContext/hooks/useHelper'
import { FunctionComponent } from 'react'
const { Sider } = Layout

const EventSectionsInnerMenu: FunctionComponent = () => {
  const cEvent = useEventContext()
  const event = cEvent.value
  console.log('event', event)
  // const { eventPrivate } = useHelper() // as MenuEvent doesn't use this...

  if (!event) return <Spin size="small" />

  return (
    <>
      <div className="hiddenMenu_Landing">
        <Sider
          className="containerMenu_Landing"
          style={{
            backgroundColor:
              event.styles && event.styles.toolbarDefaultBg
                ? event.styles.toolbarDefaultBg
                : 'white',
          }}
          trigger={null}
          width={110}
        >
          <Row justify="center" style={{ margin: 5 }}>
            {event.styles && event.styles.event_image && (
              <Link
                title="Ir a la organización"
                to={`/organization/${cEvent.value?.organizer._id}/events`}
              >
                <Image
                  preview={false}
                  alt="Logo"
                  src={event.styles.event_image}
                  style={{
                    backgroundColor: event.styles.toolbarDefaultBg,
                    objectFit: 'cover',
                  }}
                />
              </Link>
            )}
          </Row>
          <div className="items-menu_Landing">
            {/** eventPrivate={eventPrivate} */}
            <MenuEvent isMobile={false} />
          </div>
        </Sider>
      </div>
    </>
  )
}
export default EventSectionsInnerMenu
