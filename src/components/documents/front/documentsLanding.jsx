import { notification, List, Avatar, Button } from 'antd';
import { Component } from 'react';
import { getFiles } from '../services';
import { Col, Card, Result, Row, Space } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import Loading from '../../loaders/loading';
import DocumentsList from '../documentsList';
import { DocumentsApi } from '../../../helpers/request';
import { Tabs } from 'antd';
import withContext from '../../../context/withContext';
import { utils, writeFileXLSX } from 'xlsx';
const { TabPane } = Tabs;

class documentsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      loading: true,
      category_id: null,
      previewImage: '',
      data: [],
      folders: [],
    };
  }

  exportFile = async (e) => {
    e.preventDefault();
    const data = this.props.cEventUser?.value?.properties?.documents_user;
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'CARTONES BINGO');
    writeFileXLSX(wb, `CARTONES BINGO_${this.props.cEventUser?.value?.properties?.displayName}.xls`);
  };

  async componentDidMount() {
    let { documents } = this.state;
    let data = [];

    try {
      let eventId = this.props.cEvent.value?._id;
      let folders = await DocumentsApi.getAll(eventId);
      documents = await getFiles(eventId);

      this.setState({
        folders: folders.data,
      });

      //Se itera para poder pasar un array al componente List de ant
      for (const document in documents) {
        data.push(documents[document]);
      }

      this.setState({ data }, this.removeLoader);
    } catch (error) {
      console.error(error);

      notification.error({
        message: 'Error',
        description: 'Ha ocurrido un error obteniendo los documentos',
      });
    }

    // console.log('DOCUMENTES_USER=>', this.props.cEventUser?.value?.properties?.documents_user);
  }

  removeLoader = () => {
    this.setState({ loading: false });
  };

  render() {
    const { data, loading, folders } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <div style={{ paddingLeft: '25px', paddingRight: '25px' }}>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='Documentos del evento' key='1'>
            <Col xs={24} sm={20} md={20} lg={20} xl={20} style={{ margin: '0 auto' }}>
              {folders && folders.length > 0 && <DocumentsList data={folders} files={data} />}

              {(!folders || !folders.length) && (
                <div className='site-card-border-less-wrapper'>
                  <Card title='' bordered={false}>
                    <Result title='Aún no se han agregado archivos.' />
                  </Card>
                </div>
              )}
            </Col>
          </TabPane>
          {this.props.cEventUser?.value && (
            <TabPane tab={`Mis documentos`} key='2'>
              {this.props.cEventUser?.value?.properties?.documents_user?.length < 10 ? (
                <List
                  style={{ padding: 10 }}
                  itemLayout='vertical'
                  dataSource={this.props.cEventUser?.value?.properties?.documents_user}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar src='https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/000000/external-file-interface-kiranshastry-lineal-color-kiranshastry-2.png' />
                        }
                        title={<a href={item.url}>{item.name}</a>}
                        description={
                          <Button onClick={() => window.open(item.url)} shape='round' type='primary'>
                            Ver Documento
                          </Button>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : this.props.cEventUser?.value?.properties?.documents_user?.length >= 10 ? (
                <Row>
                  <Space direction='vertical'>
                    <Row>
                      {`Hola ${this.props.cEventUser?.value?.properties?.displayName} tienes ${this.props.cEventUser?.value?.properties?.documents_user.length} cartones, por favor descarga el archivo para verlos`}
                    </Row>
                    <Row>
                      <Button
                        icon={<CloudDownloadOutlined />}
                        onClick={(e) => this.exportFile(e)}
                        shape='round'
                        type='primary'>
                        Descargar Lista de cartones
                      </Button>
                    </Row>
                  </Space>
                </Row>
              ) : (
                this.props.cEventUser?.value?.properties?.documents_user == undefined && (
                  <div className='site-card-border-less-wrapper'>
                    <Card title='' bordered={false}>
                      <Result title={`Hola, No Tienes documentos asignados`} />
                    </Card>
                  </div>
                )
              )}
            </TabPane>
          )}
        </Tabs>
      </div>
    );
  }
}

let DocumentsWithContext = withContext(documentsDetail);
export default DocumentsWithContext;
