import { Modal, Form, Grid } from 'antd';
import withContext from '../../context/withContext';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { useEffect } from 'react';
import { UseEventContext } from '../../context/eventContext';
import RegisterUserAndEventUserAnonymous from './RegisterUserAndEventUserAnonymous';
import { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';

const { useBreakpoint } = Grid;

const stylePaddingDesktop = {
  paddingLeft: '30px',
  paddingRight: '30px',
  textAlign: 'center',
};
const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',
};

const ModalAuthAnonymous = (props: any) => {
  const screens = useBreakpoint();

  const [form1] = Form.useForm();
  let { typeModal, controllerLoginVisible, helperDispatch, currentAuthScreen } = useHelper();

  const cEvent = UseEventContext();
  // const cUser = UseCurrentUser();
  // const [modalVisible, setmodalVisible] = useState(false);

  const isVisibleRegister = () => {
    let typeEvent = recordTypeForThisEvent(cEvent);
    switch (typeEvent) {
      case 'PRIVATE_EVENT':
        return false;
      case 'PUBLIC_EVENT_WITH_REGISTRATION':
        return false;
      case 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS':
        return true;
      default:
        return false;
    }
  };

  // useEffect(() => {
  //   async function isModalVisible() {
  //     let typeEvent = recordTypeForThisEvent(cEvent);
  //     switch (typeEvent) {
  //       case 'PRIVATE_EVENT':
  //         setmodalVisible(false);
  //         helperDispatch({ type: 'showLogin', visible: true });
  //         break;

  //       case 'PUBLIC_EVENT_WITH_REGISTRATION':
  //         setmodalVisible(false);
  //         helperDispatch({ type: 'showRegister', visible: true });
  //         break;
  //       case 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS':
  //         setmodalVisible(true);
  //         helperDispatch({ type: 'showRegister', visible: true });
  //         break;

  //       case 'UN_REGISTERED_PUBLIC_EVENT':
  //         setmodalVisible(false);
  //         helperDispatch({ type: 'showLogin', visible: false });
  //         break;

  //       default:
  //         setmodalVisible(false);
  //         break;
  //     }
  //   }

  //   async function isUserAuth() {
  //     app.auth().onAuthStateChanged((user) => {
  //       if (user) {
  //         setmodalVisible(false);

  //         helperDispatch({ type: 'showLogin', visible: false });
  //       } else {
  //         isModalVisible();
  //       }
  //     });
  //   }

  //   isUserAuth();
  // }, [cEvent, cUser]);

  useEffect(() => {
    form1.resetFields();
  }, [typeModal, currentAuthScreen]);

  return (
    // modalVisible && (
    <Modal
      maskStyle={props.organization === 'organization' ? { backgroundColor: '#333333' } : {}}
      centered
      footer={null}
      zIndex={1000}
      visible={controllerLoginVisible?.visible && props.cEvent?.value?.visibility === 'ANONYMOUS'}
      onCancel={() => helperDispatch({ type: 'showLogin', visible: false })}
      // closable={false}
    >
      {isVisibleRegister() && (
        <div
          style={{
            height: 'auto',
            overflowY: 'hidden',
          }}>
          <RegisterUserAndEventUserAnonymous
            screens={screens}
            stylePaddingMobile={stylePaddingMobile}
            stylePaddingDesktop={stylePaddingDesktop}
          />
        </div>
      )}
    </Modal>
  );
  // );
};

export default withContext(ModalAuthAnonymous);
