import { Layout, Spin, Row, Image } from 'antd';
import MenuEvent from './Menus/MenuEvent';
import { EyeOutlined } from '@ant-design/icons';
import { UseEventContext } from '@context/eventContext';
import { useHelper } from '@context/helperContext/hooks/useHelper';
const { Sider } = Layout;

const EventSectionsInnerMenu = () => {
  let cEvent = UseEventContext();
  let event = cEvent.value;
  let { eventPrivate } = useHelper();

  if (!event) return <Spin size='small' />;
  return (
    <>
      <div className='hiddenMenu_Landing'>
        <Sider
          className='containerMenu_Landing'
          style={{
            backgroundColor: event.styles && event.styles.toolbarDefaultBg ? event.styles.toolbarDefaultBg : 'white',
          }}
          trigger={null}
          width={110}>
          <Row justify='center' style={{ margin: 5 }}>
            {event.styles && event.styles.event_image && (
              <Image
                preview={{ mask: <EyeOutlined /> }}
                alt='Logo'
                src={event.styles.event_image}
                style={{ backgroundColor: event.styles.toolbarDefaultBg, objectFit: 'cover' }}
              />
            )}
          </Row>
          <div className='items-menu_Landing'>
            <MenuEvent eventPrivate={eventPrivate} />
          </div>
        </Sider>
      </div>
    </>
  );
};
export default EventSectionsInnerMenu;
