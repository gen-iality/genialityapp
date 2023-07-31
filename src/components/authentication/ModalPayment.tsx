import { CloseCircleFilled } from '@ant-design/icons';
import { Modal, PageHeader, Space, Grid, Typography, Button } from 'antd';
import FormComponent from '../events/registrationForm/form';
import withContext from '../../context/withContext';
import { useHelper } from '../../context/helperContext/hooks/useHelper';


import Payment from './Payment';
import { attendee_status } from './utils';


interface PropsModal {
  user?: {
    _id: string;
    picture?: string;
    email: string;
    names: string;
    password: string;
    confirmation_code: string;
    
  };
  eventUser: any
  updateUser : any
  event: any
}

const ModalPayment= ({ event, user , updateUser, eventUser}: PropsModal  ) => {
  let { handleChangeTypeModal, typeModal } = useHelper();
  const isAssistant = () => {
   return attendee_status(user,eventUser) === 'WITH_ASSISTANT'
  }
  return (
    <Modal
      bodyStyle={{ paddingRight: '10px', paddingLeft: '10px', width: 520 }}
      centered
      footer={null}
      zIndex={1000}
      closable={false}
      onCancel={() => handleChangeTypeModal(null)}
      visible={typeModal === 'registerForTheEventPayment' &&  !isAssistant()}>
      <div
        // className='asistente-list'
        style={{
          // height: '70vh',
          overflowY: 'hidden',
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingTop: '8px',
          paddingBottom: '8px',
        }}>
        <Payment userInfo={user} event={event} updateUser={updateUser} money={event?.payment?.price} />
      </div>
    </Modal>
  );
};

export default withContext(ModalPayment);