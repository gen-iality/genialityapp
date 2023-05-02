import { Component } from 'react'

//custom
import { List, Card, Button, Table, Typography } from 'antd'
import {
  DownloadOutlined,
  FileTextOutlined,
  FolderOutlined,
  DownOutlined,
} from '@ant-design/icons'

const columns = [
  {
    title: 'Documento',
    dataIndex: 'document',
    key: 'document',
    render: function (text, record) {
      console.log('record', record)
      return (
        <a href={record?.file} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      )
    },
  },
  {
    title: 'Descargar',
    dataIndex: 'file',
    key: 'document',
    render: function (text, record) {
      console.log('record', record)
      return (
        <a target="_blank" href={record?.file} rel="noopener noreferrer">
          <IconText text="Descargar" icon={<DownloadOutlined />} href={record?.file} />
        </a>
      )
    },
  },
]

// Estructura de boton para descargar documentos
const IconText = ({ icon, text, onSubmit }) => (
  <Button icon={icon} htmlType="submit" type="link" href={onSubmit} target="_blank">
    {text}
  </Button>
)

class DocumentsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data || [],
      documentDates: [],
      loading: true,
    }
  }

  removeLoader = () => {
    this.setState({ loading: false })
  }

  componentDidMount() {
    this.getDatesFromDocumentList()
  }

  async getDatesFromDocumentList() {
    const { data } = this.state
    const documentDates = []
    for (let i = 0; i < data.length; i++) {
      try {
        documentDates.push({
          document: data[i].title ? data[i].title : data[i].name,
          file: data[i].file,
        })
      } catch (e) {
        console.error(e)
      }
    }
    this.setState({ documentDates }, this.removeLoader)
  }

  render() {
    const { documentDates, data, loading } = this.state
    const { files } = this.props

    console.log('props', this.props)

    return (
      <div>
        {documentDates && data && data[0]?.activity_id ? (
          <Table dataSource={documentDates} columns={columns} loading={loading} />
        ) : (
          <>
            <Card //bodyStyle={{ backgroundColor: this.props.colors.backgroundColor }}
              style={{ textAlign: 'left' }}
            >
              <List
                itemLayout="horizontal"
                size="small"
                //Se traen los datos del state
                dataSource={data}
                //se mapean los datos del array data
                renderItem={(item) => (
                  <a href={item.file} rel="noopener noreferrer" target="_blank">
                    <List.Item
                      className="shadow-box"
                      key={item._id}
                      //boton de descarga
                      actions={[
                        <a
                          key={'itemDoc' + item._id}
                          target="_blank"
                          href={item.file}
                          download
                          rel="noopener noreferrer"
                        >
                          {item.type == 'folder' ? (
                            ''
                          ) : (
                            <IconText
                              text={
                                <Typography.Text //style={{ color: this.props.colors.texto }}
                                >
                                  Descargar
                                </Typography.Text>
                              }
                              icon={
                                <DownloadOutlined //style={{ color: this.props.colors.texto }}
                                />
                              }
                            />
                          )}
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
                      ]}
                    >
                      <List.Item.Meta
                        style={{ marginRight: '10%', fontSize: '20px' }}
                        avatar={
                          item.type == 'folder' ? (
                            <FolderOutlined //style={{ color: this.props.colors.texto }}
                            />
                          ) : (
                            <FileTextOutlined //style={{ color: this.props.colors.texto }}
                            />
                          )
                        }
                        title={
                          item.title ? (
                            <span
                              style={{
                                fontSize: '20px', //color: this.props.colors.texto
                              }}
                            >
                              {' '}
                              {item.title}{' '}
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: '20px', //color: this.props.colors.texto
                              }}
                            >
                              {' '}
                              {item.name}{' '}
                            </span>
                          )
                        }
                      />
                    </List.Item>
                    {files &&
                      files
                        .filter((file) => file.father_id == item._id)
                        .map((files, key) => (
                          <List.Item
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                            }}
                            key={key}
                            actions={[
                              <a
                                key={'itemDoc' + files._id}
                                target="_blank"
                                href={files.file}
                                download
                                rel="noopener noreferrer"
                              >
                                {files.type == 'folder' ? (
                                  <DownOutlined />
                                ) : (
                                  <IconText
                                    text={
                                      <Typography.Text //style={{ color: this.props.colors.texto }}
                                      >
                                        Descargar
                                      </Typography.Text>
                                    }
                                    icon={
                                      <DownloadOutlined //style={{ color: this.props.colors.texto }}
                                      />
                                    }
                                  />
                                )}
                              </a>,
                            ]}
                          >
                            <List.Item.Meta
                              style={{ marginRight: '10%' }}
                              avatar={
                                files.type == 'folder' ? (
                                  <FolderOutlined />
                                ) : (
                                  <FileTextOutlined />
                                )
                              }
                              title={files.title ? files.title : files.name}
                            />
                          </List.Item>
                        ))}
                  </a>
                )}
              />
            </Card>
          </>
        )}
      </div>
    )
  }
}
export default DocumentsList
