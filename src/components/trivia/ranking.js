import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Moment from 'moment';
import XLSX from 'xlsx';

import { getTriviaRanking } from './services';

import EventContent from '../events/shared/content';

import { Table as TableA, Divider, Button } from 'antd';
import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';

const columns = [
  {
    title: 'Creado',
    dataIndex: 'registerDate',
    key: 'registerDate',
  },
  {
    title: 'Nombre',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: 'Email',
    dataIndex: 'userEmail',
    key: 'userEmail',
  },
  {
    title: '# Preguntas',
    dataIndex: 'totalQuestions',
    key: 'totalQuestions',
  },
  {
    title: '# Respuestas OK',
    dataIndex: 'correctAnswers',
    key: 'correctAnswers',
  },
];
class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameQuestion: '',
      listOfUserResponse: [],
    };
  }

  loadData = async () => {
    const { match } = this.props;
    const response = await getTriviaRanking(match.params.id);
    this.setState({ listOfUserResponse: response });
  };

  componentDidMount() {
    this.loadData();
  }

  exportReport = () => {
    let { listOfUserResponse } = this.state;

    // eslint-disable-next-line no-unused-vars
    const exclude = ({ _id, ...rest }) => rest;

    let data = listOfUserResponse.map((item) => exclude(item));

    for (let i = 0; data.length > i; i++) {
      if (Array.isArray(data[i].response)) {
        data[i].response = data[i].response.toString();
      }
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${'ranking'}`);
    const name = `${this.props.match.params.id}`;

    XLSX.writeFile(wb, `ranking_${name}_${Moment().format('DDMMYY')}.xls`);
  };

  goBack = () => this.props.history.goBack();

  render() {
    let { nameQuestion, listOfUserResponse } = this.state;

    return (
      <Fragment>
        <Header title={'Ranking'} back />

        <Table header={columns} list={listOfUserResponse} pagination={false} exportData fileName={`Ranking`} />

        {/* <EventContent title={nameQuestion} closeAction={this.goBack}>
          <Divider orientation='right'>Reporte</Divider>
          <Button onClick={this.exportReport}>Exportar resultados </Button>
          <TableA dataSource={listOfUserResponse} columns={columns} />;
        </EventContent> */}
      </Fragment>
    );
  }
}

export default withRouter(Ranking);
