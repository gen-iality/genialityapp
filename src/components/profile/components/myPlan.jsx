import { useEffect, useState } from 'react';
import { PlansApi, AlertsPlanApi, BillssPlanApi } from '../../../helpers/request';
import PlanCard from './planCard';
import Plan from './plan';
import { Row, Col, Tabs, Space, Table, Tooltip, Button, Tag, Card, Divider, Typography, Modal, Alert } from 'antd';
import { DownOutlined, FileDoneOutlined, RightOutlined } from '@ant-design/icons';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import TimerOutlineIcon from '@2fd/ant-design-icons/lib/TimerOutline';
import ViewAgendaIcon from '@2fd/ant-design-icons/lib/ViewAgenda';
import { Link } from 'react-router-dom';
import { GetTokenUserFirebase } from '@/helpers/HelperAuth';

const myPlan = ({ cUser }) => {
  const plan = cUser.value?.plan;
  let [plans, setPlans] = useState([]);
  let [notifications, setNotifications] = useState([]);
  let [bills, setBills] = useState([]);
  let [consumption, setConsumption] = useState([]);
  let [totalUsersByPlan, setTotalUsersByPlan] = useState({});
  const [loadingNotification, setLoadingNotification] = useState(true);
  const [loadingBill, setLoadingBill] = useState(true);
  const [loadingConsumption, setLoadingConsumption] = useState(true);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toShow, setToShow] = useState(0);
  const [toShowModal, setToShowModal] = useState('');
  const [UrlAdditional, setUrlAdditional] = useState('');
  let [token, setToken] = useState('');
  const goBackUrlPayment = window.location.toString().includes('https://staging.evius.co/')
    ? 'https://staging.evius.co/'
    : window.location.toString().includes('https://app.evius.co/myprofile/events')
    ? 'https://app.evius.co/myprofile/events'
    : 'http://localhost:3000/myprofile/events';

  const columns = [
    {
      title: 'Razón',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render(val, item) {
        return <Tag color={val === 'Éxitoso' ? 'green' : 'orange'}>{val}</Tag>;
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'created_at',
      key: 'created_at',
    },
  ];

  const cols = [
    {
      title: 'Plan',
      children: [
        {
          title: 'Monto',
          dataIndex: 'amount',
          key: 'amount',
          align: 'center',
          render(val, item) {
            return <>{item['plan'].amount}</>;
          },
        },
        {
          title: 'Precio',
          dataIndex: 'price',
          key: 'price',
          align: 'center',
          render(val, item) {
            return <>${item['plan'].price}</>;
          },
        },
      ],
    },
    {
      title: 'Usuarios',
      children: [
        {
          title: 'Monto',
          dataIndex: 'amount',
          key: 'amount',
          align: 'center',
          render(val, item) {
            return <>{item['users'].amount}</>;
          },
        },
        {
          title: 'Precio',
          dataIndex: 'price',
          key: 'price',
          align: 'center',
          render(val, item) {
            return <>${item['users'].price}</>;
          },
        },
      ],
    },
  ];

  const columnsBills = [
    {
      title: 'Ref. factura',
      dataIndex: 'reference_evius',
      key: 'reference_evius',
      render(val, item) {
        return <>{item.billing.reference_evius}</>;
      },
    },
    {
      title: 'Razón social / Nombre completo',
      dataIndex: 'reason',
      key: 'reason',
      render(val, item) {
        const payment = item.billing.payment_method || item.payment || {};
        return (
          <>
            {payment['address']?.name} {payment['address']?.last_name}
          </>
        );
      },
    },
    {
      title: 'Acción',
      dataIndex: 'action',
      key: 'action',
      /*  render(val, item) {
        return <>{item.billing.action}</>;
      }, */
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render(val, item) {
        return <Tag color={item.status === 'ACEPTED' ? 'green' : 'orange'}>{item.status}</Tag>;
      },
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render(val, item) {
        return (
          <div>
            {/* {item.billing.currency} */}COP ${item.billing.total}
          </div>
        );
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'created_at',
      key: 'created_at',
      /* render(val, item) {
        return <>{moment(val).format('YYYY-MM-DD')}</>;
      }, */
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render(val, item) {
        const payment = item.billing.payment_method || item.payment || {};
        return (
          <Space wrap>
            <Tooltip placement='topLeft' title={'Previsualización'}>
              <Button
                icon={<FileDoneOutlined />}
                onClick={() => {
                  setShowModal(!showModal);
                  setToShowModal(item._id);
                }}
              />
            </Tooltip>
            <Modal
              visible={showModal && toShowModal === item._id}
              footer={null}
              onCancel={() => {
                setShowModal(!showModal);
                setToShowModal('');
              }}
              width={'100%'}>
              <Divider orientation='left'>
                <strong>Comprobante</strong>
              </Divider>
              <Row gutter={[12, 12]} wrap>
                <Col span={12}>
                  <Space direction='vertical'>
                    <Typography.Text>
                      <Typography.Text strong>Razón social / Nombre completo:</Typography.Text>{' '}
                      {payment['address']?.name} {payment['address']?.last_name}
                    </Typography.Text>
                    <Typography.Text>
                      <Typography.Text strong>Identificación:</Typography.Text>
                      {payment['address']?.identification['type']} {payment['address']?.identification['value']}
                    </Typography.Text>
                    <Typography.Text>
                      <Typography.Text strong>Teléfono:</Typography.Text> +{payment['address']?.prefix}{' '}
                      {payment['address']?.phone_number}
                    </Typography.Text>
                    <Typography.Text>
                      <Typography.Text strong>E-mail:</Typography.Text> {payment['address']?.email}
                    </Typography.Text>
                    <Typography.Text>
                      <Typography.Text strong>Dirección:</Typography.Text> ({payment['address']?.country}){' '}
                      {payment['address']?.address_line_1} {payment['address']?.address_line_2},{' '}
                      {payment['address']?.city} {payment['address']?.postal_code}-{payment['address']?.region}
                    </Typography.Text>
                    <Typography.Text>
                      <Typography.Text strong>Fecha de la venta:</Typography.Text> {item?.created_at}
                      {/* {moment(item.billing.created_at).format('YYYY-MM-DD')} */}
                    </Typography.Text>

                    <Typography.Text>
                      <Typography.Text strong>Valor base de la venta:</Typography.Text> {item?.billing?.currency} $
                      {item?.billing?.total} con ({item?.billing?.tax * 100}% de impuesto){' '}
                      {item?.billing?.total_discount && <>y un descuento de ${item?.billing?.total_discount}</>}
                    </Typography.Text>
                    <Typography.Text>
                      <Typography.Text strong>Medio de pago:</Typography.Text> {payment?.type} - {payment?.method_name}{' '}
                      ({payment?.brand})
                    </Typography.Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction='vertical'>
                    <Typography.Text>
                      <Typography.Text strong>Referencia del comprobante:</Typography.Text>{' '}
                      {item?.billing?.reference_evius} (evius) / {item?.billing?.reference_wompi} (wompi)
                    </Typography.Text>
                    {/* <Typography.Text>
                      <Typography.Text strong>Concepto y/o descripción de la venta:</Typography.Text>
                      <Table dataSource={item?.billing?.details} columns={cols} pagination={false} />
                    </Typography.Text> */}
                    <Typography.Text>
                      <Typography.Text strong>Estatus de la compra:</Typography.Text> {item?.status}
                    </Typography.Text>
                    {payment?.status && (
                      <Typography.Text>
                        <Typography.Text strong>Estatus del pago:</Typography.Text> {payment?.status}
                      </Typography.Text>
                    )}
                    <Typography.Text>
                      <Typography.Text strong>Tipo de subscripción:</Typography.Text> {item?.billing?.subscription_type}
                    </Typography.Text>
                  </Space>
                </Col>
              </Row>
            </Modal>
          </Space>
        );
      },
    },
  ];

  const columnsEvents = [
    {
      title: 'Nombre del evento',
      dataIndex: 'name',
      key: 'name',
      render(val, item) {
        return (
          <Link to={`/eventadmin/${item.ID}`} style={{ color: '#1890ff' }}>
            {val}
          </Link>
        );
      },
    },
    {
      title: 'Usuarios',
      dataIndex: 'users',
      key: 'users',
      align: 'center',
    },
    {
      title: 'Horas',
      dataIndex: 'hours',
      key: 'hours',
      align: 'center',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render(val, item) {
        return <Tag color={val === 'ACTIVE' ? 'green' : 'orange'}>{val}</Tag>;
      },
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Fecha final',
      dataIndex: 'endDate',
      key: 'endDate',
    },
  ];

  useEffect(() => {
    getInfoPlans();
    console.log(plan, 'plan');

    GetTokenUserFirebase().then((token) => {
      if (token) {
        setToken(token);
        let urlRedirect = new URL(
          `?redirect=additional&additionalUsers=${1}&goBack=${goBackUrlPayment}&goForward=${goBackUrlPayment}&token=${token}`,
          `https://pay.evius.co/`
        );
        setUrlAdditional(urlRedirect.href);
      }
    });
  }, []);

  const getInfoPlans = async () => {
    /* Planes adicionales */
    let plans = await PlansApi.getAll();
    setPlans(plans);
    /* console.log('plans', plans); */
    /* Notificaciones/Alertas */
    let notifications = await AlertsPlanApi.getByUser(cUser.value._id);
    setNotifications(notifications.data);
    setLoadingNotification(false);
    /* console.log(notifications.data, 'notifications'); */
    /* Facturas/Comprobantes */
    let bills = await BillssPlanApi.getByUser(cUser.value._id);
    setBills(bills.data);
    setLoadingBill(false);
    console.log('bills', bills.data);
    /* Consumos del usuario */
    let consumption = await PlansApi.getCurrentConsumptionPlanByUsers(cUser.value._id);
    setConsumption(consumption.events);
    setLoadingConsumption(false);
    /* console.log('consumption', consumption.data); */
    /* Total de registros de usuario */
    let totalUsersByPlan = await PlansApi.getTotalRegisterdUsers();
    setTotalUsersByPlan(totalUsersByPlan);
    /* console.log(totalUsersByPlan, 'aqui'); */

    /* console.log(plans, 'plans');
    console.log(plans[0]._id, plans[1]._id, plan._id); */
    //const p = await PlansApi.getOne('62864ad118aa6b4b0f5820a2');
  };

  return (
    <Tabs defaultActiveKey={'plan'}>
      <Tabs.TabPane tab={'Mi plan'} key={'plan'}>
        <Row gutter={[12, 12]} wrap>
          <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
            <PlanCard
              title={`Plan ${plan?.name || 'Personalizado'}`}
              value={plan ? `US $ ${plan?.price}` : 'Personalizado'}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
            <PlanCard
              title={'Horas de transmisión'}
              value={plan ? `${plan?.availables?.streaming_hours / 60}h` : 'Ilimitadas'}
              icon={<TimerOutlineIcon style={{ fontSize: '24px' }} />}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
            <PlanCard
              title={'Usuarios'}
              value={plan?.availables?.users || 'Ilimitados'}
              icon={<AccountGroupIcon style={{ fontSize: '24px' }} />}
              message={
                plan?.name !== 'Free' && (
                  <a href={UrlAdditional} style={{ color: '#1890ff' }} target='_blank'>
                    Comprar más {plan?.costAdditionalUsers && <>a (${plan?.costAdditionalUsers})</>}
                  </a>
                )
              }
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
            <PlanCard
              title={'Eventos'}
              value={plan?.availables?.events || 'Ilimitados'}
              icon={<ViewAgendaIcon style={{ fontSize: '24px' }} />}
            />
          </Col>
          <Col span={24}>
            {totalUsersByPlan?.totalRegisteredUsers > 0 && (
              <Alert
                message={
                  totalUsersByPlan?.totalRegisteredUsers === totalUsersByPlan?.totalAllowedUsers
                    ? 'Has alcanzado el límite de usuarios permitidos en tu plan'
                    : `Has registrado ${totalUsersByPlan?.totalRegisteredUsers} de usuarios en total de tu plan`
                }
                type='warning'
                showIcon
              />
            )}
            {/* <Typography.Text strong style={{ color: 'orange' }}>
              <small>
                <Space>
                  <Typography.Text>

                  </Typography.Text>
                </Space>
              </small>
            </Typography.Text> */}
            <Table
              dataSource={consumption}
              columns={columnsEvents}
              scroll={{ x: 'auto' }}
              loading={loadingNotification}
              pagination={{ pageSize: 2 }}
            />
          </Col>
          <Col span={24}>
            <Plan plan={plan} mine />
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Facturaciones'} key={'bills'}>
        <Table dataSource={bills} columns={columnsBills} scroll={{ x: 'auto' }} loading={loadingBill} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Notificaciones'} key={'notifications'}>
        <Table dataSource={notifications} columns={columns} scroll={{ x: 'auto' }} loading={loadingConsumption} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Mejorar plan'} key={'plan2'}>
        {plans
          .filter((plan1) => plan1?._id !== plan?._id)
          .sort((a, b) => a.index - b.index)
          .map((plan2, index) => (
            <div style={{ paddingBottom: '15px' }}>
              <Card style={{ borderRadius: '15px' }}>
                <Space>
                  <Divider>
                    <strong>Disponible {plan2?.name}</strong>
                  </Divider>
                  {plan2?._id !== '6285536ce040156b63d517e5' && plan2?.index > plan?.index ? (
                    <a
                      href={
                        plan2?._id !== '629e1dd4f8fceb1d688c35d5'
                          ? new URL(
                              `?redirect=subscription&planType=${plan2?._id}&goBack=${goBackUrlPayment}&goForward=${goBackUrlPayment}&token=${token}`,
                              `https://pay.evius.co/`
                            )
                          : 'https://evius.co/pricing/'
                      }
                      style={{ color: '#1890ff' }}
                      target='_blank'>
                      Comprar plan
                    </a>
                  ) : (
                    <Typography.Text strong style={{ color: 'red' }}>
                      <small>Ya tuviste este plan, solo puedes seguir ascendiendo.</small>
                    </Typography.Text>
                  )}
                </Space>
                <Row gutter={[12, 12]} wrap>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <PlanCard
                      title={`Plan ${plan2?.name}`}
                      value={plan2?.price !== 'Personalizado' ? `US $ ${plan2?.price}` : plan2?.price}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <PlanCard
                      title={'Horas de transmisión'}
                      value={
                        plan2?.availables?.streaming_hours !== 'Personalizado'
                          ? `${plan2?.availables?.streaming_hours / 60}h`
                          : plan2?.availables?.streaming_hours
                      }
                      icon={<TimerOutlineIcon style={{ fontSize: '24px' }} />}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <PlanCard
                      title={'Usuarios'}
                      value={plan2?.availables?.users}
                      icon={<AccountGroupIcon style={{ fontSize: '24px' }} />}
                      message={plan2?.costAdditionalUsers && <>Adicional (${plan2?.costAdditionalUsers})</>}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <PlanCard
                      title={'Eventos'}
                      value={plan2?.availables?.events}
                      icon={<ViewAgendaIcon style={{ fontSize: '24px' }} />}
                    />
                  </Col>
                  <Col span={24}>
                    <Typography.Text
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setShow(!show);
                        setToShow(index);
                      }}>
                      {!show ? <RightOutlined /> : <DownOutlined />} Aquí puedes más información del plan{' '}
                      <strong>{plan2?.name}</strong>.
                    </Typography.Text>
                    {show && toShow === index && (
                      <>
                        <br />
                        <br />
                        <Plan plan={plan2} />
                      </>
                    )}
                  </Col>
                </Row>
              </Card>
            </div>
          ))}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default myPlan;
