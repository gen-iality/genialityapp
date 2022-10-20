import { Component } from 'react';
import Async from 'async';
import { Actions } from '@helpers/request';
import { Row, Col, Tag, Tabs, Table, Spin } from 'antd';

const { TabPane } = Tabs;
const { Column } = Table;

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      ok: [],
      notok: [],
      total: 0,
      saved: 0,
      fails: 0,
      updated: 0,
      step: 1,
    };
  }

  componentDidMount() {
    const { list } = this.props;
    this.setState({ list });
    this.uploadByOne(list);
  }

  uploadByOne = (users) => {
    const self = this;
    const { extraFields } = this.props;
    const ok = [],
      notok = [];
    const toImport = users.filter((user) => !this.isEmptyObject(user));
    Async.eachOfSeries(
      toImport,
      (user, key, cb) => {
        if (!this.isEmptyObject(user)) {
          if (this.props.organization) {
            Actions.post(`/api/organizations/${this.props.eventId}/users`, user)
              .then((resp) => {
                if (resp.message === 'OK') {
                  ok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: resp.status,
                  };
                  if (resp.status === 'UPDATED') {
                    self.setState((prevState) => {
                      return { updated: prevState.updated + 1, total: prevState.total + 1 };
                    });
                  } else {
                    self.setState((prevState) => {
                      return { saved: prevState.saved + 1, total: prevState.total + 1 };
                    });
                  }
                }
                cb();
              })
              .catch((err) => {
                if (err.response) {
                  const { data } = err.response;
                  let error = 'ERROR ';
                  Object.keys(data).map((field) => {
                    return (error = error + data[field][0] + ' ');
                  });
                  notok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: error,
                  };
                } else {
                  notok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: 'ERROR DESCONOCIDO',
                  };
                }
                self.setState((prevState) => {
                  return { fails: prevState.fails + 1, total: prevState.total + 1 };
                });
                cb();
              });
          } else {
            const activityId = this.props.locationParams?.state?.activityId;
            const activity = activityId ? `activity_id=${activityId}` : '';
            Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${this.props.eventId}/?${activity}`, user)
              .then((resp) => {
                if (resp.message === 'OK') {
                  ok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: resp.status,
                  };
                  if (resp.status === 'UPDATED') {
                    self.setState((prevState) => {
                      return { updated: prevState.updated + 1, total: prevState.total + 1 };
                    });
                  } else {
                    self.setState((prevState) => {
                      return { saved: prevState.saved + 1, total: prevState.total + 1 };
                    });
                  }
                }
                cb();
              })
              .catch((err) => {
                if (err.response) {
                  const { data } = err.response;
                  let error = 'ERROR ';
                  Object.keys(data).map((field) => {
                    return (error = error + data[field][0] + ' ');
                  });
                  notok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: error,
                  };
                } else {
                  notok[key] = {
                    [extraFields[0].name]: user[extraFields[0].name],
                    [extraFields[1].name]: user[extraFields[1].name],
                    status: 'ERROR DESCONOCIDO',
                  };
                }
                self.setState((prevState) => {
                  return { fails: prevState.fails + 1, total: prevState.total + 1 };
                });
                cb();
              });
          }
        }
      },
      (err) => {
        self.setState({ ok, notok });
        if (err) {
          err;
        }
      }
    );
  };

  isEmptyObject = (o) => {
    return Object.keys(o).every(function(x) {
      return !o[x] || o[x] === null;
    });
  };

  render() {
    const { total, saved, fails, updated, step, ok, notok } = this.state;
    const { extraFields } = this.props;
    const data = [notok, ok];
    return (
      <>
        <Row justify='space-between' wrap>
          <Col>
            <Tag>{total}</Tag>
            <span>{'Total'}</span>
          </Col>
          <Col>
            <Tag color='#1cdcb7'>{saved}</Tag>
            <span>{'Importados'}</span>
          </Col>
          <Col>
            <Tag color='#ff3860'>{fails}</Tag>
            <span>{'Fallidos'}</span>
          </Col>
          <Col>
            <Tag color='#ffdd57'>{updated}</Tag>
            <span>{'Actualizados'}</span>
          </Col>
        </Row>
        {total > 0 && (
          <>
            <Tabs defaultActiveKey='0'>
              <TabPane tab='Correctos' key='0'>
                <Spin tip={'Cargando...'} spinning={data[1].length === 0}>
                  <Table
                    size='small'
                    rowKey='index'
                    dataSource={data[1]}
                    pagination
                    /* scroll={{ x: 2500 }} auto*/
                  >
                    <Column title={extraFields[0].name} dataIndex={extraFields[0].name} ellipsis={true} />
                    <Column title={extraFields[1].name} dataIndex={extraFields[1].name} ellipsis={true} />
                    <Column title='Estado' dataIndex='status' ellipsis={true} />
                  </Table>
                </Spin>
              </TabPane>
              <TabPane tab='Incorrectos' key='1'>
                <Table
                  size='small'
                  rowKey='index'
                  dataSource={data[0]}
                  pagination
                  /* scroll={{ x: 2500 }}  auto*/
                >
                  <Column title={extraFields[0].name} dataIndex={extraFields[0].name} ellipsis={true} />
                  <Column title={extraFields[1].name} dataIndex={extraFields[1].name} ellipsis={true} />
                  <Column title='Estado' dataIndex='status' ellipsis={true} />
                </Table>
              </TabPane>
            </Tabs>
          </>
        )}
      </>
    );
  }
}

export default Result;
