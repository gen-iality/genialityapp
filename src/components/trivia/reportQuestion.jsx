import { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { utils, writeFileXLSX } from 'xlsx';
import { getAnswersByQuestion } from './services';
import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';

let renderNombreUsuario = (name) => (!name ? <span>Usuario invitado</span> : <span>{name}</span>);
const columns = [
  {
    title: 'Creado',
    dataIndex: 'creation_date_text',
    key: 'creation_date_text',
  },
  {
    title: 'Nombre',
    dataIndex: 'user_name',
    key: 'user_name',
    render: renderNombreUsuario,
  },
  {
    title: 'Respuesta',
    dataIndex: 'response',
    key: 'response',
  },
];
class ReportQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameQuestion: '',
      listOfUserResponse: [],
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
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    const sheetName = nameQuestion.replace(/[.*+¿?^${}()|[\]\\]/g, '');
    utils.book_append_sheet(wb, ws, `${sheetName}`);
    const name = `${match.params.id}`;

    writeFileXLSX(wb, `${sheetName}-${name}${dayjs().format('DDMMYY')}.xls`);
  };

  goBack = () => this.props.history.goBack();

  render() {
    let { nameQuestion, listOfUserResponse } = this.state;
    return (
      <Fragment>
        <Header title={nameQuestion} back />

        <Table header={columns} list={listOfUserResponse} pagination={false} exportData fileName={nameQuestion} />

        {/* <EventContent title={nameQuestion} closeAction={this.goBack}>
          <Divider orientation='right'>Reporte</Divider>
          <Button onClick={this.exportReport}>Exportar resultados </Button>
          <TableA dataSource={listOfUserResponse} columns={columns} />;
        </EventContent> */}
      </Fragment>
    );
  }
}

export default withRouter(ReportQuestion);
