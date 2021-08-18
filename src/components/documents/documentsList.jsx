import React, { Component } from 'react';

//custom
import { List, Card, Button, Table } from 'antd';
import { DownloadOutlined, FileTextOutlined, FolderOutlined, DownOutlined } from '@ant-design/icons';

const columns = [
  {
    title: 'Documento',
    dataIndex: 'document',
    key: 'document',
  },
  {
    render: function(item) {
      const element = (
        <a target='_blank' href={item.file} download rel='noopener noreferrer'>
          <IconText text='Descargar' icon={DownloadOutlined} />
        </a>
      );
      return element;
    },
  },
];

// Estructura de boton para descargar documentos
const IconText = ({ icon, text, onSubmit }) => (
  <Button htmlType='submit' type='link' href={onSubmit} target='_blank'>
    {React.createElement(icon, { style: { margin: 0 } })}
    {text}
  </Button>
);

class documentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || [],
      documentDates: [],
      loading: true,
    };
  }

  removeLoader = () => {
    this.setState({ loading: false });
  };

  componentDidMount() {
    this.getDatesFromDocumentList();
  }

  async getDatesFromDocumentList() {
    const { data } = this.state;
    const documentDates = [];
    for (let i = 0; i < data.length; i++) {
      //if (data[i].activity_id) {
      try {
        //const agenda = await AgendaApi.getOne(data[i].activity_id, data[i].event_id)
        documentDates.push({
          //activity: agenda.name,
          document: data[i].title ? data[i].title : data[i].name,
          file: data[i].file,
        });
      } catch (e) {
        console.error(e);
      }
      // }
    }
    this.setState({ documentDates }, this.removeLoader);
  }

  render() {
    const { documentDates, data, loading } = this.state;
    const { files } = this.props;

    return (
      <div>
        {data[0].activity_id ? (
          <div>
            <Table dataSource={documentDates} columns={columns} loading={loading} />
          </div>
        ) : (
          <Card style={{ textAlign: 'left' }}>
            <List
              itemLayout='horizontal'
              //Se traen los datos del state
              dataSource={data}
              //se mapean los datos del array data
              renderItem={(item) => (
                <>
                  {console.log('item', item)}
                  <List.Item
                    key={item._id}
                    //boton de descarga
                    actions={[
                      <a key={'itemDoc' + item._id} target='_blank' href={item.file} download rel='noopener noreferrer'>
                        {item.type == 'folder' ? '' : <IconText text='Descargar' icon={DownloadOutlined} />}
                      </a>,
                      // <a
                      //     href={ApiGoogleDocuments + encodeURIComponent(item.file)}
                      //     target="_blank"
                      //     style={{ wordBreak: "break-word" }}
                      // >
                      //     <IconText
                      //         text="Previsualizar"
                      //         icon={EyeOutlined}
                      //     />
                      // </a>
                    ]}>
                    <List.Item.Meta
                      style={{ marginRight: '10%', fontSize: '20px' }}
                      avatar={item.type == 'folder' ? <FolderOutlined /> : <FileTextOutlined />}
                      title={
                        item.title ? (
                          <span style={{ fontSize: '20px' }}> {item.title} </span>
                        ) : (
                          <span style={{ fontSize: '20px' }}> {item.name} </span>
                        )
                      }
                    />
                  </List.Item>
                  {files
                    .filter((file) => file.father_id == item._id)
                    .map((files, key) => (
                      <List.Item
                        key={key}
                        actions={[
                          <a
                            key={'itemDoc' + files._id}
                            target='_blank'
                            href={files.file}
                            download
                            rel='noopener noreferrer'>
                            {files.type == 'folder' ? (
                              <DownOutlined />
                            ) : (
                              <IconText text='Descargar' icon={DownloadOutlined} />
                            )}
                          </a>,
                        ]}>
                        <List.Item.Meta
                          style={{ marginRight: '10%' }}
                          avatar={files.type == 'folder' ? <FolderOutlined /> : <FileTextOutlined />}
                          title={files.title ? files.title : files.name}
                        />
                      </List.Item>
                    ))}
                </>
              )}
            />
          </Card>
        )}
      </div>
    );
  }
}
export default documentsList;
