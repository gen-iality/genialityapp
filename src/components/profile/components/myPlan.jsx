import { useEffect, useState } from 'react';
import { PlansApi, AlertsPlanApi, BillssPlanApi } from '../../../helpers/request';
import PlanCard from './planCard';
import Plan from './plan';
import { Row, Col, Tabs, Space, Table, Tooltip, Button, Tag, Card, Divider, Collapse, Typography } from 'antd';
import { DownloadOutlined, DownOutlined, FileDoneOutlined, RightOutlined } from '@ant-design/icons';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import TimerOutlineIcon from '@2fd/ant-design-icons/lib/TimerOutline';
import ViewAgendaIcon from '@2fd/ant-design-icons/lib/ViewAgenda';
import { Link } from 'react-router-dom';

const myPlan = ({ cUser }) => {
  const columns = [
    {
      title: 'Razón',
      dataIndex: 'reason',
      key: 'reason',
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

  const columnsBills = [
    {
      title: '# Factura',
      dataIndex: 'reference_evius',
      key: 'reference_evius',
      render(val, item) {
        return <>{item.billing.reference_evius}</>;
      },
    },
    {
      title: 'Razón',
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
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render(val, item) {
        return (
          <Space wrap>
            <Tooltip placement='topLeft' title={'Previsualización'}>
              <Button icon={<FileDoneOutlined />} />
            </Tooltip>
            <Tooltip placement='topLeft' title={'Descargar'}>
              <Button icon={<DownloadOutlined />} />
            </Tooltip>
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

  const plan = cUser.value.plan;
  let [plans, setPlans] = useState([]);
  let [notifications, setNotifications] = useState([]);
  let [bills, setBills] = useState([]);
  let [consumption, setConsumption] = useState([]);
  const [loadingNotification, setLoadingNotification] = useState(true);
  const [loadingBill, setLoadingBill] = useState(true);
  const [loadingConsumption, setLoadingConsumption] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getInfoPlans();
  }, []);

  const getInfoPlans = async () => {
    let plans = await PlansApi.getAll();
    setPlans(plans);
    let notifications = await AlertsPlanApi.getByUser(cUser.value._id);
    setNotifications(notifications.data);
    setLoadingNotification(false);
    /* console.log(notifications, 'notifications'); */
    let bills = await BillssPlanApi.getByUser(cUser.value._id);
    setBills(bills.data);
    setLoadingBill(false);
    console.log('bills', bills);
    let consumption = await PlansApi.getCurrentConsumptionPlanByUsers(cUser.value._id);
    setConsumption(consumption.events);
    setLoadingConsumption(false);
    /* console.log('consumption', consumption); */

    /* console.log(plans, 'plans');
    console.log(plans[0]._id, plans[1]._id, plan._id); */
    //const p = await PlansApi.getOne('62864ad118aa6b4b0f5820a2');
  };

  return (
    <Tabs defaultActiveKey={'plan'}>
      <Tabs.TabPane tab={'Mi plan'} key={'plan'}>
        <Row gutter={[12, 12]} wrap>
          <Col span={6}>
            <PlanCard title={`Plan ${plan.name}`} value={`US $ ${plan.price}`} />
          </Col>
          <Col span={6}>
            <PlanCard
              title={'Horas de transmisión'}
              value={`${plan.availables.streaming_hours / 60}h`}
              icon={<TimerOutlineIcon style={{ fontSize: '24px' }} />}
            />
          </Col>
          <Col span={6}>
            <PlanCard
              title={'Usuarios'}
              value={plan.availables.users}
              icon={<AccountGroupIcon style={{ fontSize: '24px' }} />}
              message={
                <Link href='pay.evius.co' style={{ color: '#1890ff' }}>
                  Comprar más
                </Link>
              }
            />
          </Col>
          <Col span={6}>
            <PlanCard
              title={'Eventos'}
              value={plan.availables.events}
              icon={<ViewAgendaIcon style={{ fontSize: '24px' }} />}
            />
          </Col>
          <Col span={24}>
            <Table dataSource={consumption} columns={columnsEvents} scroll={'auto'} loading={loadingNotification} />
          </Col>
          <Col span={24}>
            <Plan plan={plan} mine />
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Facturaciones'} key={'bills'}>
        <Table dataSource={bills} columns={columnsBills} scroll={'auto'} loading={loadingBill} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Notificaciones'} key={'notifications'}>
        <Table dataSource={notifications} columns={columns} scroll={'auto'} loading={loadingConsumption} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Mejorar plan'} key={'plan2'}>
        {plans
          .filter((plan1) => plan1._id !== plan._id)
          .map((plan2) => (
            <div style={{ paddingBottom: '15px' }}>
              <Card style={{ borderRadius: '15px' }}>
                <Space>
                  <Divider>
                    <strong>Disponible {plan2.name}</strong>
                  </Divider>
                  <Link href='pay.evius.co' style={{ color: '#1890ff' }}>
                    Comprar plan
                  </Link>
                </Space>
                <Row gutter={[12, 12]} wrap>
                  <Col span={6}>
                    <PlanCard title={`Plan ${plan2.name}`} value={`US $ ${plan2.price}`} />
                  </Col>
                  <Col span={6}>
                    <PlanCard
                      title={'Horas de transmisión'}
                      value={`${plan2.availables.streaming_hours / 60}h`}
                      icon={<TimerOutlineIcon style={{ fontSize: '24px' }} />}
                    />
                  </Col>
                  <Col span={6}>
                    <PlanCard
                      title={'Usuarios'}
                      value={plan2.availables.users}
                      icon={<AccountGroupIcon style={{ fontSize: '24px' }} />}
                    />
                  </Col>
                  <Col span={6}>
                    <PlanCard
                      title={'Eventos'}
                      value={plan2.availables.events}
                      icon={<ViewAgendaIcon style={{ fontSize: '24px' }} />}
                    />
                  </Col>
                  <Col span={24}>
                    <Typography.Text style={{ cursor: 'pointer' }} onClick={() => setShow(!show)}>
                      {!show ? <RightOutlined /> : <DownOutlined />} Aquí puedes más información del plan{' '}
                      <strong>{plan2.name}</strong>.
                    </Typography.Text>
                    {show && (
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
