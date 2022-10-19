import { UseEventContext } from '@/context/eventContext';
import { UseUserEvent } from '@/context/eventUserContext';
import { UseCurrentUser } from '@/context/userContext';
import { isStagingOrProduccion } from '@/Utilities/isStagingOrProduccion';
import { CommentOutlined } from '@ant-design/icons';
import { Drawer, PageHeader, Typography, Grid } from 'antd';
import { DrawerChatInterface } from '../../interfaces/bingo';

const { useBreakpoint } = Grid;
const { Title } = Typography;

const DrawerChat = ({ showDrawerChat, setshowDrawerChat }: DrawerChatInterface) => {
  let cUser = UseCurrentUser();
  let cEvent = UseEventContext();
  let cEventUser = UseUserEvent();
  const screens = useBreakpoint();

  let userNameActive = cUser.value?.name ? cUser.value?.name : cUser.value?.names;
  let anonymous = cUser.value?.isAnonymous ? cUser.value?.isAnonymous : 'false';

  return (
    <Drawer
      bodyStyle={{ padding: '0px' }}
      width={screens.xs ? '100vw' : '30vw'}
      headerStyle={{ border: 'none' }}
      title={
        <PageHeader
          avatar={{
            style: { backgroundColor: cEvent.value?.styles?.toolbarDefaultBg },
            icon: (
              <CommentOutlined
                style={{
                  color: cEvent.value?.styles?.textMenu,
                }}
              />
            ),
            shape: 'square',
          }}
          title={<Title level={5}>Chat</Title>}
          style={{ padding: '0px' }}
        />
      }
      visible={showDrawerChat}
      closable={true}
      onClose={() => setshowDrawerChat(false)}>
      <iframe
        style={{ width: '100%', height: '99%', border: 'none' }}
        title='chatevius'
        src={
          'https://chatevius.netlify.app?nombre=' +
          userNameActive +
          '&chatid=event_' +
          cEvent.value?._id +
          '&usereventid=' +
          cEventUser.value?._id +
          '&eventid=' +
          cEvent.value?._id +
          '&userid=' +
          cUser.value?.uid +
          '&version=0.0.2' +
          '&anonimo=' +
          anonymous +
          '&mode=' +
          isStagingOrProduccion()
        }></iframe>
    </Drawer>
  );
};
export default DrawerChat;
