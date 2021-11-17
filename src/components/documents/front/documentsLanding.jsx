import { notification, List, Avatar, Button } from 'antd';
import React, { Component } from 'react';
import { getFiles } from '../services';
import { Col, Card, Result } from 'antd';
import Loading from '../../loaders/loading';
import DocumentsList from '../documentsList';
import { DocumentsApi } from '../../../helpers/request';
import { Tabs } from 'antd';
import withContext from '../../../Context/withContext';

const { TabPane } = Tabs;

const ExampleData = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

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

  async componentDidMount() {
    console.log('propsdocs', this.props.cEventUser);
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
      <>
        <Tabs defaultActiveKey='1'>
          <TabPane tab={`Documentos de ${this.props.cEventUser?.value?.properties?.displayName}`} key='1'>
            {this.props.cEventUser?.value?.properties?.documents_user ? (
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
            ) : (
              <div className='site-card-border-less-wrapper'>
                <Card title='' bordered={false}>
                  <Result
                    title={`Hola ${this.props.cEventUser?.value?.properties?.displayName}, No Tienes documentos por ver para este evento`}
                  />
                </Card>
              </div>
            )}
          </TabPane>

          <TabPane tab='Documentos del evento' key='2'>
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
        </Tabs>
      </>
    );
  }
}

let DocumentsWithContext = withContext(documentsDetail);
export default DocumentsWithContext;
