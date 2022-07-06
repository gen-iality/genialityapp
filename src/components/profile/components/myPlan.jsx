import { useEffect, useState } from 'react';
import { PlansApi, AlertsPlanApi, BillssPlanApi } from '../../../helpers/request';
import PlanCard from './planCard';
import Plan from './plan';
import { Row, Col, Tabs, Space, Table, Tooltip, Button, Tag, Card, Divider, Typography, Modal } from 'antd';
import { DownOutlined, FileDoneOutlined, RightOutlined } from '@ant-design/icons';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import TimerOutlineIcon from '@2fd/ant-design-icons/lib/TimerOutline';
import ViewAgendaIcon from '@2fd/ant-design-icons/lib/ViewAgenda';
import { Link } from 'react-router-dom';
//import moment from 'moment';

const myPlan = ({ cUser }) => {
  const plan = cUser.value?.plan;
  let [plans, setPlans] = useState([]);
  let [notifications, setNotifications] = useState([]);
  let [bills, setBills] = useState([]);
  let [consumption, setConsumption] = useState([]);
  const [loadingNotification, setLoadingNotification] = useState(true);
  const [loadingBill, setLoadingBill] = useState(true);
  const [loadingConsumption, setLoadingConsumption] = useState(true);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toShow, setToShow] = useState(0);

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
        return <>{payment['address']?.full_name}</>;
      },
    },
    {
      title: 'Acción',
      dataIndex: 'action',
      key: 'action',
      render(val, item) {
        return <>{item.billing.action}</>;
      },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render(val, item) {
        return <Tag color={item.billing.status === 'ACEPTED' ? 'green' : 'orange'}>{item.billing.status}</Tag>;
      },
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render(val, item) {
        return (
          <div>
            {item.billing.currency} ${item.billing.total}
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
              <Button icon={<FileDoneOutlined />} onClick={() => setShowModal(!showModal)} />
            </Tooltip>
            <Modal visible={showModal} footer={null} onCancel={() => setShowModal(!showModal)} width={'100%'}>
              <Divider orientation='left'>
                <strong>Comprobante</strong>
              </Divider>
              <Row gutter={[12, 12]} wrap>
                <Col span={12}>
                  <Space direction='vertical'>
                    <Typography.Text>
                      <Typography.Text strong>Razón social / Nombre completo:</Typography.Text>{' '}
                      {payment['address']?.full_name}
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
                    <Typography.Text>
                      <Typography.Text strong>Concepto y/o descripción de la venta:</Typography.Text>
                      <Table dataSource={item?.billing?.details} columns={cols} pagination={false} />
                    </Typography.Text>
                    <Typography.Text>
                      <Typography.Text strong>Estatus de la compra:</Typography.Text> {item?.billing?.status}
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
    console.log(totalUsersByPlan, 'aqui');

    /* console.log(plans, 'plans');
    console.log(plans[0]._id, plans[1]._id, plan._id); */
    //const p = await PlansApi.getOne('62864ad118aa6b4b0f5820a2');
  };

  return (
    <Tabs defaultActiveKey={'plan'}>
      <Tabs.TabPane tab={'Mi plan'} key={'plan'}>
        <Row gutter={[12, 12]} wrap>
          <Col span={6}>
            <PlanCard
              title={`Plan ${plan?.name || 'Personalizado'}`}
              value={plan ? `US $ ${plan?.price}` : 'Personalizado'}
            />
          </Col>
          <Col span={6}>
            <PlanCard
              title={'Horas de transmisión'}
              value={plan ? `${plan?.availables?.streaming_hours / 60}h` : 'Ilimitadas'}
              icon={<TimerOutlineIcon style={{ fontSize: '24px' }} />}
            />
          </Col>
          <Col span={6}>
            <PlanCard
              title={'Usuarios'}
              value={plan?.availables?.users || 'Ilimitados'}
              icon={<AccountGroupIcon style={{ fontSize: '24px' }} />}
              message={
                plan?.name !== 'Free' && (
                  <a href='https://pay.evius.co/' style={{ color: '#1890ff' }} target='_blank'>
                    Comprar más
                  </a>
                )
              }
            />
          </Col>
          <Col span={6}>
            <PlanCard
              title={'Eventos'}
              value={plan?.availables?.events || 'Ilimitados'}
              icon={<ViewAgendaIcon style={{ fontSize: '24px' }} />}
            />
          </Col>
          <Col span={24}>
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
                  <a href='https://pay.evius.co/' style={{ color: '#1890ff' }} target='_blank'>
                    Comprar plan
                  </a>
                </Space>
                <Row gutter={[12, 12]} wrap>
                  <Col span={6}>
                    <PlanCard
                      title={`Plan ${plan2?.name}`}
                      value={plan2?.price !== 'Personalizado' ? `US $ ${plan2?.price}` : plan2?.price}
                    />
                  </Col>
                  <Col span={6}>
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
                  <Col span={6}>
                    <PlanCard
                      title={'Usuarios'}
                      value={plan2?.availables?.users}
                      icon={<AccountGroupIcon style={{ fontSize: '24px' }} />}
                    />
                  </Col>
                  <Col span={6}>
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
