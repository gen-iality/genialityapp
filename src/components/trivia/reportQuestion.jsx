import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Moment from 'moment';
import XLSX from 'xlsx';

import { getAnswersByQuestion } from './services';

import EventContent from '../events/shared/content';

import { Table, Divider, Button } from 'antd';

let renderNombreUsuario = (name) => (!name ? <span>Usuario Invitado</span> : <span>{name}</span>);
const columns = [
  {
    title: 'Creado',
    dataIndex: 'creation_date_text',
    key: 'creation_date_text'
  },
  {
    title: 'Nombre',
    dataIndex: 'user_name',
    key: 'user_name',
    render: renderNombreUsuario
  },
  {
    title: 'Respuesta',
    dataIndex: 'response',
    key: 'response'
  }
];
class ReportQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameQuestion: '',
      listOfUserResponse: []
    };
  }

  loadData = async () => {
    const { location, match } = this.props;

    this.setState({ nameQuestion: location.state.titleQuestion });
    let response = await getAnswersByQuestion(location.state.surveyId, match.params.id);
    this.setState({ listOfUserResponse: response });
  };

  componentDidMount() {
    this.loadData();
  }

  exportReport = () => {
    let { nameQuestion, listOfUserResponse } = this.state;
    //Sheet names cannot exceed 31 chars
    nameQuestion = nameQuestion.substring(0, 30);
    const { match } = this.props;

    const exclude = ({ ...rest }) => rest;

    let data = listOfUserResponse.map((item) => exclude(item));

    for (let i = 0; data.length > i; i++) {
      if (Array.isArray(data[i].response)) {
        data[i].response = data[i].response.toString();
      }
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    const sheetName = nameQuestion.replace(/[.*+¿?^${}()|[\]\\]/g, '');
    XLSX.utils.book_append_sheet(wb, ws, `${sheetName}`);
    const name = `${match.params.id}`;

    XLSX.writeFile(wb, `${sheetName}-${name}${Moment().format('DDMMYY')}.xls`);
  };

  goBack = () => this.props.history.goBack();

  render() {
    let { nameQuestion, listOfUserResponse } = this.state;
    return (
      <Fragment>
        <EventContent title={nameQuestion} closeAction={this.goBack}>
          <Divider orientation='right'>Reporte</Divider>
          <Button onClick={this.exportReport}>Exportar resultados </Button>
          <Table dataSource={listOfUserResponse} columns={columns} />;
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(ReportQuestion);
