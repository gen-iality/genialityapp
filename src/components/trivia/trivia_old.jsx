import React, { Component, Fragment } from 'react';
import { Redirect, Link } from 'react-router-dom';
import EventContent from '../events/shared/content_old';
import { SurveysApi, AgendaApi } from '../../helpers/request';
import { deleteSurvey } from './services';
import 'react-tabs/style/react-tabs.css';
import { Table } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, CrownOutlined } from '@ant-design/icons';
import { message, Space, Button } from 'antd';

class trivia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      data: [],
      dataAgenda: [],
      activity_id: '',
      survey: '',
      publish: '',
      shareholders: [{ name: '' }]
    };
    this.destroy = this.destroy.bind(this);
  }

  async componentDidMount() {
    this.getInformation();
  }
  // Se realiza la funcion para obtener todos los datos necesarios tanto para encuesta como para agenda
  getInformation = async () => {
    const info = await SurveysApi.getAll(this.props.event._id);
    console.log(info, 'info');

    const dataAgenda = await AgendaApi.byEvent(this.props.event._id);
    console.log(dataAgenda, 'agenda');
    //Se envía al estado la data obtenida de las api
    this.setState({
      dataAgenda: dataAgenda.data,
      data: info.data,
      survey: info.survey,
      publicada: info.publicada
    });
  };
  // Funcion para permitir el cambio del value de los input y enviarlo al state
  changeInput = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  //Funcion para eliminar un dato de la lista
  destroy(idTrivia) {
    message.loading({ content: 'Eliminando Encuesta', key: 'deleting' });

    SurveysApi.deleteOne(this.props.event._id, idTrivia).then(async () => {
      let deleteSurveyInFire = await deleteSurvey(idTrivia);

      message.success({ content: deleteSurveyInFire.message, key: 'deleting' });
      this.getInformation();
    });
  }

  render() {
    const columns = [
      {
        title: 'Nombre de la encuesta',
        dataIndex: 'survey',
        key: 'survey'
      },
      {
        title: 'Publicada',
        dataIndex: 'publish',
        key: 'publish'
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size='middle'>
            <Link to={{ pathname: `${this.props.matchUrl}/report`, state: { report: record._id } }}>
              <SearchOutlined />
            </Link>
            <Link to={{ pathname: `${this.props.matchUrl}/ranking/${record._id}`, state: { report: record._id } }}>
              <CrownOutlined alt='ranking' />
            </Link>
            <Link to={{ pathname: `${this.props.matchUrl}/encuesta`, state: { edit: record._id } }}>
              <EditOutlined />
            </Link>
            <DeleteOutlined onClick={this.destroy.bind(record.survey, record._id)} />
          </Space>
        )
      }
    ];
    const { matchUrl } = this.props;
    const { data } = this.state;
    if (this.state.redirect) return <Redirect to={{ pathname: `${matchUrl}`, state: { new: true } }} />;
    return (
      <Fragment>
        <div className='columns is-12'>
          <Link to={{ pathname: `${matchUrl}/encuesta` }}>
            <Button style={{ float: 'right' }}>
              <span className='icon'>
                <i className='fas fa-plus-circle' />
              </span>
              <spa>Nueva Encuesta</spa>
            </Button>
          </Link>
          <EventContent title={'Encuestas'}>
            <Table dataSource={data} columns={columns} />
          </EventContent>
        </div>
      </Fragment>
    );
  }
}

export default trivia;
