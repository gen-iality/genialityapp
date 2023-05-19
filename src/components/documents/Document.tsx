import { useState, useEffect, FunctionComponent } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { DocumentsApi } from '@helpers/request'
import { handleRequestError } from '@helpers/utils'
import { Form, Row, Col, Input, Modal, Upload, Button, Spin, Progress } from 'antd'
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { fireStorage } from '@helpers/firebase'
import Header from '@antdComponents/Header'
import dayjs from 'dayjs'
import { StateMessage } from '@context/MessageService'

const { confirm } = Modal

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

interface IDocumentProps {
  event: any
  simpleMode?: boolean
  fromPDFDocumentURL?: string | null
  parentUrl?: string
  notRecordFileInDocuments?: boolean
  /** To check if the document was uploaded */
  cbUploaded?: () => void
  /** When the document is removed */
  onRemoveDocumentContent?: () => void
  onSave?: (url: string) => void
}

const Document: FunctionComponent<IDocumentProps> = (props) => {
  const history = useHistory()
  const [document, setDocument] = useState<any>({})
  const [documentList, setDocumentList] = useState<any[]>([])
  const [files, setFiles] = useState('')
  const [fileName, setFileName] = useState('')
  const [extention, setExtention] = useState('')
  const [folder, setFolder] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadPercentage, setLoadPercentage] = useState(0)
  const [fromEditing, setFromEditing] = useState(false)

  const location = useLocation<any>()

  useEffect(() => {
    if (location.state.edit && !props.simpleMode) {
      getDocument()
    }
  }, [])

  useEffect(() => {
    if (!props.fromPDFDocumentURL) return

    // "Load" the file from URL.
    const url = props.fromPDFDocumentURL

    let filename = url.substring(url.lastIndexOf('/') + 1)
    if (filename.indexOf('?') !== -1) {
      filename = filename.substring(0, filename.indexOf('?'))
    }
    if (filename.indexOf('#') !== -1) {
      filename = filename.substring(0, filename.indexOf('#'))
    }
    const fakeDocument = {
      format: 'pdf',
      title: filename,
      name: filename,
      file: url,
      type: 'file',
      documentList: [
        {
          // "uid": "rc-upload-0",
          // "lastModified": {
          //   "$numberLong": "1661874625498"
          // },
          name: filename,
          size: 0, // Imposible to know this from URL in the easy way
          type: 'application/pdf',
          percent: 100,
          // "originFileObj": {
          //   "uid": "rc-upload-0"
          // },
          status: 'success',
          thumbUrl: null,
        },
      ],
      state: 'father',
    }

    setDocument(fakeDocument)
    setFolder(fakeDocument.folder)
    setFiles([fakeDocument.file])
    setDocumentList(fakeDocument.documentList)
  }, [props.fromPDFDocumentURL])

  const getDocument = async () => {
    const response = await DocumentsApi.getOne(location.state.edit, props.event._id)
    setDocument(response)
    setFolder(response.folder)
    setFiles([response.file])
    setDocumentList(response.documentList)
    setLoading(false)
    setFromEditing(true)
  }

  const resetDocument = () => {
    console.debug('reset all the Document component')
    setDocument({})
    setFolder(false)
    setFiles('')
    setDocumentList([])
    setLoading(false)
    setFromEditing(false)
    setLoadPercentage(0)
  }

  const onSubmit = async () => {
    setLoading(true)
    if (folder) {
      setDocument({ ...document, type: 'folder', folder })
    }

    if (!document.title) {
      StateMessage.show(null, 'error', 'El título es requerido')
    } else if (!files && document.type !== 'folder') {
      StateMessage.show(null, 'error', 'El archivo es requerido')
    } else {
      StateMessage.show(
        'loading',
        'loading',
        ' Por favor espere mientras se guarda la información...',
      )

      try {
        if (!props.notRecordFileInDocuments) {
          if (location.state.edit && !props.simpleMode) {
            console.debug('document editing')
            await DocumentsApi.editOne(
              folder ? { title: document.title, type: 'folder', folder } : document,
              location.state.edit,
              props.event._id,
            )
            console.debug('document edited')
          } else {
            console.debug('document creating')
            await DocumentsApi.create(
              folder ? { title: document.title, type: 'folder', folder } : document,
              props.event._id,
            )
            console.debug('document created')
            if (typeof props.cbUploaded === 'function') {
              props.cbUploaded()
              resetDocument()
            }
          }

          StateMessage.destroy('loading')
          StateMessage.show(null, 'success', 'Información guardada correctamente!')
        }

        if (!props.simpleMode && props.parentUrl) history.push(`${props.parentUrl}`)
        setLoading(false)
      } catch (e) {
        StateMessage.destroy('loading')
        StateMessage.show(null, 'error', handleRequestError(e).message)
      }
    }
  }

  const remove = () => {
    console.debug('call Document.remove')
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se borra la información...',
    )
    if (location.state.edit) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              /* if(document.type === 'folder') {
                const files = await DocumentsApi.getFiles(props.event._id, locationState.edit);

                files.data.forEach((element) => {
                  const ref = firebase.storage().ref(`documents/${props.event._id}/`);
                  var desertRef = ref.child(`${element.name}`);

                  //Delete the file
                  desertRef
                    .delete()
                    .then(function() {
                      //El dato se elimina aqui
                    })
                    .catch(function() {
                      //Si no muestra el error
                    });
                });
              } */
              if (!props.notRecordFileInDocuments) {
                await DocumentsApi.deleteOne(location.state.edit, props.event._id)
                StateMessage.destroy('loading')
                StateMessage.show(
                  null,
                  'success',
                  'Se eliminó la información correctamente!',
                )
              }
              if (!props.simpleMode) history.push(`${props.parentUrl}`)
              if (typeof props.onRemoveDocumentContent === 'function') {
                props.onRemoveDocumentContent()
              }
              lazyResetDocument()
            } catch (e) {
              StateMessage.destroy('loading')
              StateMessage.show(null, 'error', handleRequestError(e).message)
            }
          }
          onHandlerRemove()
        },
      })
    } else {
      if (typeof props.onRemoveDocumentContent === 'function') {
        props.onRemoveDocumentContent()
      }
      lazyResetDocument()
    }
  }

  const lazyResetDocument = () => {
    setTimeout(() => {
      // This function SHOULD be called, but, interactively the user calls to
      // remove, and before the App calls `onHandlerFile` again and edits the
      // progress (and other states), and we NEED avoid that re-calling, but we
      // can not because `onHandlerFile` listens the event `onChange` and it
      // does not check if that changing is from uploading or removing.
      resetDocument()
    }, 3000)
  }

  const handleChange = (e: any) => {
    const { name } = e.target
    const { value } = e.target
    setDocument({
      ...document,
      [name]: value,
    })
  }

  const onHandlerFile = async (e: any) => {
    console.log('onHandlerFile calling...', e)
    setLoading(true)
    setDocumentList(e.fileList)

    const ref = fireStorage.ref()
    setFiles(e.file.originFileObj)

    //Se crea el nombre con base a la fecha y nombre del archivo
    const name = dayjs().format('YYYY-DD-MM') + '-' + (files.name || 'unnamed')
    setFileName(name)
    //Se extrae la extencion del archivo por necesidad del aplicativo

    setExtention(name.split('.').pop() || '')

    const uploadTaskRef = ref.child(`documents/${props.event._id}/${name}`).put(files)
    //Se envia a firebase y se pasa la validacion para poder saber el estado del documento

    uploadTaskRef.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        )
        setLoadPercentage(progress)
        switch (snapshot.state) {
          case 'paused':
            break
          case 'running':
            break
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('You tried upload things to firestore:', error)
      },
      () => {
        console.log('calling succesUploadFile')
        succesUploadFile(uploadTaskRef)
        console.log('succesUploadFile called')
      },
    )
  }

  const succesUploadFile = async (uploadTaskRef) => {
    let file
    try {
      await uploadTaskRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        file = downloadURL
        console.log(downloadURL)
        // Send the URL to the parent component. Save it.
        if (typeof props.onSave === 'function') props.onSave(downloadURL)
        setLoading(false)
      })
      setDocument({
        ...document,
        format: extention,
        title: fileName,
        name: fileName,
        file: file,
        type: 'file',
        documentList: documentList,
      })
      // if (props.simpleMode) setInterval(() => onSubmit(), 1000);
    } catch (e) {
      console.error('cannot re get file', e)
      setLoading(true)
    }
  }

  const reload = () => {
    history.go(0)
  }

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header
        title={props.simpleMode ? 'Cargar documento' : 'Documento'}
        back={!props.simpleMode}
        save={props.simpleMode || (loadPercentage > 0 && true) || fromEditing}
        saveMethod={() => {
          props.simpleMode && onSubmit()
        }}
        form={!props.simpleMode}
        remove={() => {
          if (props.notRecordFileInDocuments) {
            remove()
          } else if (props.simpleMode) {
            history.push(
              `${location.pathname
                .replace('agenda/activity', 'documents')
                .replace('agenda', 'documents')}`,
            )
          } else {
            remove()
          }
        }}
        edit={location.state.edit}
        loadingSave={loading}
      />

      <Spin
        spinning={loading}
        tip={
          <>
            Por favor espere mientras cargue... <br />
            Si el problema persiste, favor de recargar <br />
            <Button type="primary" icon={<ReloadOutlined />} onClick={() => reload()}>
              Recargar
            </Button>
          </>
        }
      >
        <Row justify="center" wrap gutter={12}>
          <Col span={14}>
            {!folder && (
              <Form.Item
                label="Archivo"
                rules={[{ required: true, message: 'El archivo es requerido' }]}
              >
                <Upload
                  multiple={false}
                  name="file"
                  type="drag"
                  fileList={documentList}
                  defaultValue={documentList}
                  onChange={(e) => {
                    onHandlerFile(e)
                    e.file.status = 'success'
                  }}
                  listType="picture"
                  maxCount={1}
                >
                  <Button block icon={<UploadOutlined />}>
                    Toca para subir archivo
                  </Button>
                </Upload>
              </Form.Item>
            )}
            {loadPercentage > 0 && <Progress percent={loadPercentage} />}

            <Form.Item
              label="Título"
              rules={[{ required: true, message: 'El título es requerido' }]}
            >
              <Input
                name="title"
                placeholder={folder ? 'Título de la carpeta' : 'Título del documento'}
                value={document.title}
                onChange={(e) => handleChange(e)}
                disabled={documentList.length === 0 ? true : loading}
              />
            </Form.Item>
          </Col>
        </Row>
      </Spin>
    </Form>
  )
}

export default Document
