import { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { utils, writeFileXLSX } from 'xlsx';

import { getTriviaRanking } from './services';

import Header from '@antdComponents/Header';
import Table from '@antdComponents/Table';

const columns = [
  {
    title: 'Creado',
    dataIndex: 'registerDate',
    key: 'registerDate',
    ellipsis: true,
    sorter: (a, b) => a.registerDate.localeCompare(b.registerDate),
  },
  {
    title: 'Nombre',
    dataIndex: 'userName',
    key: 'userName',
    ellipsis: true,
    sorter: (a, b) => a.userName.localeCompare(b.userName),
  },
  {
    title: 'Email',
    dataIndex: 'userEmail',
    key: 'userEmail',
    ellipsis: true,
    sorter: (a, b) => a.userEmail.localeCompare(b.userEmail),
  },
  {
    title: '# Preguntas',
    dataIndex: 'totalQuestions',
    key: 'totalQuestions',
    ellipsis: true,
    sorter: (a, b) => a.totalQuestions - b.totalQuestions,
  },
  {
    title: '# Respuestas OK',
    dataIndex: 'correctAnswers',
    key: 'correctAnswers',
    ellipsis: true,
    sorter: (a, b) => a.correctAnswers - b.correctAnswers,
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
    const { listOfUserResponse } = this.state;

    // eslint-disable-next-line no-unused-vars
    const exclude = ({ _id, ...rest }) => rest;

    const data = listOfUserResponse.map((item) => exclude(item));

    for (let i = 0; data.length > i; i++) {
      if (Array.isArray(data[i].response)) {
        data[i].response = data[i].response.toString();
      }
    }
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, `${'ranking'}`);
    const name = `${this.props.match.params.id}`;

    writeFileXLSX(wb, `ranking_${name}_${dayjs().format('DDMMYY')}.xls`);
  };

  goBack = () => this.props.history.goBack();

  render() {
    const { nameQuestion, listOfUserResponse } = this.state;

    return (
      <Fragment>
        <Header title={'Ranking'} back />

        <Table header={columns} list={listOfUserResponse} pagination={false} exportData fileName={`Ranking`} />
      </Fragment>
    );
  }
}

export default withRouter(Ranking);
