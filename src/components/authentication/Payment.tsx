import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { UsersApi } from '@/helpers/request';
import { ContactsOutlined, DollarCircleOutlined, MailOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Grid, Input, Modal, Result, Row, Space, Steps, Typography } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import ResultPurchase from './ResultPurchase';
import { ICurrency, Status, Transaction } from './types';
import useLanguage from './hooks/useLanguage';
import Loading from '../profile/loading';
import { Currency } from '../agenda/types/index';
import useTrm from './hooks/useTrm';
const { Step } = Steps;
const { useBreakpoint } = Grid;

const stylePaddingDesktop: React.CSSProperties = {
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',

};
const stylePaddingMobile: React.CSSProperties = {
  paddingLeft: '10px',
  paddingRight: '10px',
  textAlign: 'center',
};

interface PropsPayment {
  event: any;
  userInfo?: {
    _id: string;
    picture?: string;
    email: string;
    names: string;
    password: string;
    confirmation_code: string;
  };
  money?: number;
  updateUser: any;
}

export default function Payment({ event, userInfo, updateUser, money }: PropsPayment) {
  const { handleChangeTypeModal } = useHelper();
  const screens = useBreakpoint();
  const intl = useIntl();
  const { lang } = useLanguage();
  const { trm } = useTrm();
  const [current, setcurrent] = useState(0);
  const [payment, setPayment] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const publicKey = process.env.VITE_WOMPI_DEV_PUB_API_KEY;
  const currency: ICurrency = event?.payment?.currency || 'COP' 
  ;
  
  const handlePay = async () => {
    
    // @ts-ignore
    if (window?.WidgetCheckout && money) {
      let moneyChange = money;
      if(currency === 'USD')  moneyChange = moneyChange * trm;
      const price =  Math.round(moneyChange) * 100;
      const payload: any = {
        eventId : event?._id,
        price,
      };
      // TODO: JUST FOR TEST PURPOSES
      const redirectUrl = encodeURI(
        `http://${window.location.host}/${event?._id}?finish=true&payment_event=true&event_id=${payload.eventId}&user_id=${userInfo?._id}&assigned_to.names=${userInfo?.names}&assigned_to.email=${userInfo?.email}&lang=${lang}`
      );

      // @ts-ignore
      const checkout = new WidgetCheckout({
        currency: 'COP',
        amountInCents: price,
        reference: new Date().getTime() + event?._id + userInfo?._id,
        publicKey: publicKey,
        redirectUrl,
        customerData: {
          // Opcional
          email: userInfo?.email,
          fullName: userInfo?.names,
        },
      });
      // @ts-ignore
      checkout.open((result) => {
        console.log({ result });
        const transaction = result.transaction as Transaction;
        setPayment(transaction);
        setcurrent(1);
      });
    }
  };

  const onClick = async () => {
    if (current === 0) {
      await handlePay();
    } else {
      setLoading(true);
      if (payment?.status === Status.APPROVED) {
        const pru = setTimeout(() => {
          updateUser(true);
          handleChangeTypeModal('loginSuccess');
          setcurrent(0);
          clearTimeout(pru);
        }, 4000);
      } else {
        setLoading(false);
        setcurrent(0);
      }
    }
  };

  const steps = [
    {
      title: 'register event',
      icon: <ContactsOutlined />,
       content: (
        <Row justify='start' gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={18}>
            <Card>
              <Row style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', textAlign: 'start' }}>
                <Typography.Title level={5}>Nombre Completo: </Typography.Title>
                <Typography.Text>{userInfo?.names}</Typography.Text>

                <Typography.Title level={5}>Correo: </Typography.Title>
                <Typography.Text>{userInfo?.email}</Typography.Text>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ height: '100%'}}>
              <Row style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center',  }}>
              <DollarCircleOutlined style={{ fontSize: 50, marginBottom: 10}}/>
                <Typography.Text >{`$ ${money}`}</Typography.Text>
                <Typography.Text >{currency}</Typography.Text>
              </Row>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      title: 'payment event',
      icon: <SafetyCertificateOutlined />,
      content: <ResultPurchase transaction={payment} lang={lang} />,
    },
  ];

  return (
    <div style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}>
        <Typography.Title level={4}>{event?.name}</Typography.Title>
      <Steps current={current} responsive={false}>
        {steps.map((item) => (
          <Step key={item.title} icon={item.icon} />
        ))}
      </Steps>
      {userInfo ? <div style={{ marginTop: '30px' }}>{steps[current].content}</div> : <Loading />}
      <Space>
        <Button id='btnnextRegister' loading={loading || !userInfo} size='large' type='primary' onClick={onClick}>
          {current > 0
            ? intl.formatMessage({
                id: 'register.button.finalize',
                defaultMessage: 'Finalizar',
              })
            : intl.formatMessage({
                id: 'register.button.payment',
                defaultMessage: 'Comprar',
              })}
        </Button>
       { current === 0 && <Button danger loading={loading || !userInfo} type='primary' size='large' onClick={()=> handleChangeTypeModal(null) }>
            Salir
        </Button>}
      </Space>
    </div>
  );
}
