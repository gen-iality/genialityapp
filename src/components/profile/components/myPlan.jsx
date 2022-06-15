import { useEffect, useState } from 'react';
import { PlansApi, AlertsPlanApi, BillssPlanApi } from '../../../helpers/request';
import PlanCard from './planCard';
import Plan from './plan';
import { Row, Col, Tabs, Space, Table, Tooltip, Button, Tag, Card, Divider, Collapse } from 'antd';
import { DownloadOutlined, FileDoneOutlined } from '@ant-design/icons';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import TimerOutlineIcon from '@2fd/ant-design-icons/lib/TimerOutline';
import ViewAgendaIcon from '@2fd/ant-design-icons/lib/ViewAgenda';

/* const dataSource = [
  {
    key: '1',
    reason: 'Se realizó un pago de plan',
    status: 'Éxitoso',
    created_at: '20-08-2021',
  },
  {
    key: '2',
    reason: 'Se realizó un pago de plan',
    status: 'Éxitoso',
    created_at: '20-03-2022',
  },
  {
    key: '3',
    reason: 'El pago se está realizando',
    status: 'En progreso',
    created_at: '20-05-2022',
  },
]; */

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

/* const bills = [
  {
    key: '1',
    billNumber: '120082021',
    reason: 'Compra plan básico',
    status: 'Pagado',
    value: '199',
    created_at: '20-08-2021',
  },
  {
    key: '2',
    billNumber: '220032022',
    reason: 'Compra plan básico',
    status: 'Pagado',
    value: '199',
    created_at: '20-03-2022',
  },
  {
    key: '3',
    billNumber: '320052022',
    reason: 'Compra plan básico',
    status: 'Pendiente',
    value: '199',
    created_at: '20-05-2022',
  },
]; */

const columnsBills = [
  {
    title: '# Factura',
    dataIndex: 'billNumber',
    key: 'billNumber',
  },
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
      return <Tag color={val === 'Pagado' ? 'green' : 'orange'}>{val}</Tag>;
    },
  },
  {
    title: 'Valor',
    dataIndex: 'value',
    key: 'value',
    render(val, item) {
      return <div>US ${val}</div>;
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

const events = [
  {
    key: '1',
    name: 'Evento 1',
    users: '2',
    time: '1h/1h',
    status: 'Activo',
    created_at: '20-08-2021',
    expirate_date: '20-09-2021',
  },
  {
    key: '2',
    name: 'Evento 2',
    users: '1',
    time: '30m/1h',
    status: 'Activo',
    created_at: '20-03-2022',
    expirate_date: '20-04-2022',
  },
];

const columnsEvents = [
  {
    title: 'Nombre del evento',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Usuarios',
    dataIndex: 'users',
    key: 'users',
    align: 'center',
  },
  {
    title: 'Horas',
    dataIndex: 'time',
    key: 'time',
    align: 'center',
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Fecha de creación',
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: 'Fecha final',
    dataIndex: 'expirate_date',
    key: 'expirate_date',
  },
];

const myPlan = ({ cUser }) => {
  console.log(cUser);
  const plan = cUser.value.plan;
  let [plans, setPlans] = useState([]);
  let [notifications, setNotifications] = useState([]);
  let [bills, setBills] = useState([]);

  useEffect(() => {
    getPlans();
  }, []);

  const getPlans = async () => {
    let plans = await PlansApi.getAll();
    setPlans(plans);
    let notifications = await AlertsPlanApi.getByUser(cUser.value._id);
    setNotifications(notifications);
    let bills = await BillssPlanApi.getByUser(cUser.value._id);
    setBills(bills);
    console.log('bills', bills);
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
            <Table dataSource={events} columns={columnsEvents} />
          </Col>
          <Col span={24}>
            <Plan plan={plan} mine />
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Facturaciones'} key={'bills'}>
        <Table dataSource={bills} columns={columnsBills} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Notificaciones'} key={'notifications'}>
        <Table dataSource={notifications} columns={columns} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={'Mejorar plan'} key={'plan2'}>
        {plans
          .filter((plan1) => plan1._id !== plan._id)
          .map((plan2) => (
            <div style={{ paddingBottom: '15px' }}>
              <Card style={{ borderRadius: '15px' }}>
                <Divider>
                  <strong>Disponible {plan2.name}</strong>
                </Divider>
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
                    <Collapse bordered={false} /* defaultActiveKey={['1']} */>
                      <Collapse.Panel header='Adicional' key='1'>
                        <Plan plan={plan2} />
                      </Collapse.Panel>
                    </Collapse>
                  </Col>
                </Row>
                {/* <Plan plan={plan2}>
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
              </Plan> */}
              </Card>
            </div>
          ))}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default myPlan;
