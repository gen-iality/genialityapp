import React, { Component } from 'react';
import * as Cookie from 'js-cookie';
import { ApiUrl } from '../../helpers/constants';
import IFrame from '../shared/iFrame';
import { Card, Col, Divider, Empty, Row, Select, Space, Statistic, Table } from 'antd';
import { EyeOutlined, FieldTimeOutlined, IdcardOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import API from '../../helpers/request';

const { Option } = Select;
class DashboardEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      iframeUrl: '',
      chats: [],
    };
  }

  getChat() {
    const { eventId } = this.props;
    return new Promise((resolve, reject) => {
      API.get(`/api/events/${eventId}/messages`)
        .then(({ data }) => {
          resolve(data.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  componentDidMount() {
    const evius_token = Cookie.get('evius_token');
    const { eventId } = this.props;
    if (evius_token) {
      const iframeUrl = `${ApiUrl}/es/event/${eventId}/dashboard?evius_token=${evius_token}`;
      this.setState({ iframeUrl, loading: false });
      this.getChat().then((data) => {
        console.log('-------chats-------');
        console.log(data);
        this.setState({ chats: data });
      });
    }
  }

  render() {
    const columnsEmail = [
      {
        title: 'Campaña',
        dataIndex: 'campaña',
        key: 'campaña',
      },
      {
        title: 'Nombre completo',
        dataIndex: 'nombreCom',
        key: 'nombreCom',
      },
      {
        title: 'Correo Electronico',
        dataIndex: 'email',
        key: 'email',
      },
    ];

    const columns = [
      {
        title: 'Actividad',
        dataIndex: 'actividad',
        key: 'actividad',
      },
      {
        title: 'Vistas unicas',
        dataIndex: 'vistasUnicas',
        key: 'vistasUnicas',
      },
      {
        title: 'Impresiones',
        dataIndex: 'impresiones',
        key: 'impresiones',
      },
      {
        title: 'Tiempo del usuario',
        dataIndex: 'tiempoUsuario',
        key: 'tiempoUsuario',
      },
      {
        title: 'Acciones',
        dataIndex: 'acciones',
        key: 'acciones',
      },
    ];
    return (
      <div>
        <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
          <Col span={18}>
            <Card>
              <Empty>Espacio para la grafica</Empty>
            </Card>
          </Col>
          <Col span={6}>
            <Row gutter={(32, 32)}>
              <Col span={24}>
                <Card hoverable>
                  <Statistic
                    groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                    valueStyle={{ fontSize: '38px' }}
                    title='Usuarios registrados'
                    value={850}
                    prefix={<IdcardOutlined />}
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card hoverable>
                  <Statistic
                    groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                    valueStyle={{ fontSize: '36px' }}
                    title='Duracion promedio de un usuario'
                    value={186}
                    prefix={<FieldTimeOutlined />}
                    suffix='min'
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
          <Col span={12}>
            <Row justify='center'>
              <Col span={24}>
                <Card>
                  <Empty>Espacio para la grafica</Empty>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                    valueStyle={{ fontSize: '38px' }}
                    title='Visitas unicas totales del evento'
                    value={798}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row justify='center'>
              <Col span={24}>
                <Card>
                  <Empty>Espacio para la grafica</Empty>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    groupSeparator={'.'} // determina el string usado para separar la unidades de mil de los valores
                    valueStyle={{ fontSize: '38px' }}
                    title='Impresiones totales del evento'
                    value={6087}
                    prefix={<EyeOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
          <Col span={24}>
            <Card headStyle={{ border: 'none' }} title={'Metricas por actividades del evento'} extra={<MoreOutlined />}>
              <Table dataSource={null} columns={columns} size='small' />
            </Card>
          </Col>
        </Row>
        <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
          <Col span={24}>
            <Card
              headStyle={{ border: 'none' }}
              title={
                <Select defaultValue='allCamp' bordered={false}>
                  <Option value='allCamp'>Todas las campañas</Option> <Option value='capaña1'>Campaña 1</Option>{' '}
                  <Option value='capaña2'>Campaña 2</Option>{' '}
                </Select>
              }>
              <Row justify='space-around' align='middle' gutter={[8, 8]}>
                <Col span={4}>
                  <Card hoverable bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                      title={<h3 style={{ textAlign: 'center' }}>ENTREGADOS</h3>}
                      value={858}
                    />
                  </Card>
                </Col>

                <Col span={4}>
                  <Card hoverable bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                      title={<h3 style={{ textAlign: 'center' }}>REBOTADOS</h3>}
                      value={858}
                    />
                  </Card>
                </Col>

                <Col span={8}>
                  <Card hoverable bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '48px', textAlign: 'center' }}
                      title={<h2 style={{ textAlign: 'center' }}>ENVIADOS</h2>}
                      value={858}
                    />
                  </Card>
                </Col>

                <Col span={4}>
                  <Card hoverable bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                      title={<h3 style={{ textAlign: 'center' }}>ABIERTOS</h3>}
                      value={858}
                    />
                  </Card>
                </Col>

                <Col span={4}>
                  <Card hoverable bordered={false}>
                    <Statistic
                      valueStyle={{ fontSize: '36px', textAlign: 'center' }}
                      title={<h3 style={{ textAlign: 'center' }}>CLICS</h3>}
                      value={858}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={(32, 32)} align='middle' justify='space-between' style={{ paddingTop: '20px' }}>
                <Col span={24}>
                  <Card
                    headStyle={{ border: 'none' }}
                    title={'Titulo'} // el titulo debe cambiar dependiendo el cuadro de arriba
                    extra={<MoreOutlined />}>
                    <Table dataSource={null} columns={columnsEmail} size='small' />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* {this.state.loading ? <p>Loading...</p> : <IFrame iframeUrl={this.state.iframeUrl} />} */}
      </div>
    );
  }
}

export default DashboardEvent;
