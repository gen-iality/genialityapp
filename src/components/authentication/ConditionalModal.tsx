import { Button, Grid, Modal, Space, Steps } from 'antd';
import React, { useState } from 'react';

import { ConditionalModalInterface, DataUserInterface } from './types';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import FormConditional from './components/FormConditional';
import ResultLogin from './components/ResultLogin';
import createNewUser from './services/createNewUser';
import createEventUser from './services/RegisterUserToEvent';
import { DispatchMessageService } from '@/context/MessageService';

const { Step } = Steps;
const { useBreakpoint } = Grid;

export default function ConditionalModal(Props: ConditionalModalInterface) {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const screen = useBreakpoint();
  const [userData, setuserData] = useState<DataUserInterface>({
    names: '',
    email: '',
    password: '',
    picture: '',
  });
  const handleSubmit = async () => {
    setStatus('loading');
    setCurrent(current + 1);
    let response = null
   try {
    response= await createNewUser(userData);
   } catch (error) {
    setStatus('error');
    DispatchMessageService({
      type: 'error',
      action: 'show',
      msj: 'Error al crear el usuario',
    })
   }
    if (response) {
      const resUser = await createEventUser(userData, {} , { value : {'_id' : Props.realEvent}})
      setStatus(resUser ? 'success' : 'error')
    } else {
      setStatus('error');
    }
   
  };
  const handleChange = (key: keyof DataUserInterface, value: string) => {
    setuserData({ ...userData, [key]: value });
  };
  const closeModal = () => {
  
      Props.setVisible(false);
      setCurrent(0);
    
  }
  const steps = [
    {
      title: 'First',
      content: (
        <FormConditional
          handleChange={handleChange}
          onCancel={closeModal}
          onFinish={handleSubmit}
          bgColor={Props.bgColor}
          textColor={Props.textColor}
        />
      ),
      icon: <AccountOutlineIcon style={{ fontSize: '32px'/* , color: Props.textColor */ }} />,
    },
    {
      title: 'Second',
      content: <ResultLogin status={status} user={userData} close={closeModal} eventId={Props.realEvent} bgColor={Props.bgColor} />,
      icon: <TicketConfirmationOutlineIcon style={{ fontSize: '32px'/* , color: Props.textColor */ }} />,
    },
  ];
  const stylePaddingDesktop: React.CSSProperties = {
    paddingLeft: '30px',
    paddingRight: '30px',
    textAlign: 'center',
  };
  const stylePaddingMobile: React.CSSProperties = {
    paddingLeft: '10px',
    paddingRight: '10px',
    textAlign: 'center',
  };
  return (
    <Modal
      destroyOnClose
      visible={Props.visible}
      closable
      footer={null}
      onCancel={closeModal}
      bodyStyle={{backgroundColor: Props.bgColor + '35', borderRadius: 10/* , color: Props.textColor */}}
      style={{
        height: 'auto',
        overflowY: 'hidden',
        paddingLeft: '5px',
        paddingRight: '5px',
        paddingTop: '0px',
        paddingBottom: '0px',
      }}>
      <div style={screen.xs ? stylePaddingMobile : stylePaddingDesktop}>
        <Steps current={current} responsive={false}>
          {steps.map((item) => (
            <Step key={item.title} icon={item.icon} />
          ))}
        </Steps>
          <div>{steps[current].content}</div>
          {/* <div></div> */}
      </div>
    </Modal>
  );
}
