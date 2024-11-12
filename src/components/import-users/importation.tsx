import { FunctionComponent, useState } from 'react'
import { utils, writeFileXLSX, read } from 'xlsx'
import dayjs from 'dayjs'
import momentLocalizer from 'react-widgets-moment'
import { Row, Col, Button, Divider, Upload, UploadFile, Alert } from 'antd'
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons'
import { StateMessage } from '@context/MessageService'
import { uploadImagedummyRequest } from '@/Utilities/imgUtils'
import { FieldType } from './types'

momentLocalizer()

interface IImportationProps {
  extraFields: any[]
  organization?: any
  event: any
  handleXls: (data: any[]) => void
}

const Importation: FunctionComponent<IImportationProps> = (props) => {
  const [errMsg, setErrMsg] = useState('')

  const handleXlsFile = (files: UploadFile) => {
    if (files.status === 'error') {
      StateMessage.show(null, 'error', 'Error al cargar el archivo excel')
      return
    }
    // The execution stops, since ant design updates the upload event with each change in the file upload progress, this generates an error in the steps of importing users
    if (files.status !== 'done') return
    StateMessage.show(
      'loading',
      'loading',
      ' Por favor espere mientras se envía la información...',
    )
    const f = files.originFileObj
    const reader = new FileReader()
    try {
      reader.onload = (e: any) => {
        const data = e.target.result
        const workbook = read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheetObj = workbook.Sheets[sheetName]
        if (sheetObj['!ref']) {
          const range = utils.decode_range(sheetObj['!ref'])
          const fields: FieldType[] = []
          for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
            const keyCell = sheetObj[utils.encode_cell({ r: range.s.r, c: colNum })]
            const key = keyCell ? keyCell.v.trim() : undefined
            //columna vacia continuamos
            if (!key) continue
            fields[colNum] = { key: key, list: [], used: false }
            for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
              const secondCell = sheetObj[utils.encode_cell({ r: rowNum, c: colNum })]
              let val = secondCell ? secondCell.v : undefined
              /** Validation so that the checkIn field saves its value as a string and not as an integer, when Excel is imported */
              props.extraFields.map((field) => {
                if (field.type === 'checkInField' && field.name === key)
                  val = val?.toString()
              })
              fields[colNum].list.push(val)
            }
          }

          StateMessage.destroy('loading')
          StateMessage.show(null, 'success', 'importación de usuarios exitosa')

          //por si no pudimos agregar ningún dato
          if (!fields.length) {
            setErrMsg('Excel en blanco, o algún problema con el archivo o el formato')
            return
          }
          props.handleXls(fields)
          return
        } else {
          StateMessage.destroy('loading')
          StateMessage.show(null, 'error', 'Excel en blanco')
          setErrMsg('Excel en blanco')
        }
      }
      reader.readAsBinaryString(f)
      StateMessage.destroy('loading')
    } catch (e) {
      StateMessage.destroy('loading')
      StateMessage.show(null, 'error', 'Error cargando la información del archivo')
      console.error(e)
    }
  }

  const downloadExcel = () => {
    const data: any[] = [{}]
    props.extraFields.map((extra) => {
      return (data[0][extra.name] = '')
    })

    /** Se agrega campo requerido que no viene en la consulta de la base de datos */
    data[0]['rol'] = ''
    /* if (password) {
      data[0]['password'] = password;
    } */
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    let name = props.organization ? 'usersorganization_template' : 'attendees_template'
    name = props.event ? name + '_' + props.event.name : name

    utils.book_append_sheet(wb, ws, 'Template')
    writeFileXLSX(wb, `${name}${dayjs().format('DDMMYY')}.xls`)
  }

  /** Se agregan campos extras para poder mostrar como información en CAMPOS REQUERIDOS */
  const addMoreItemsToExtraFields = () => {
    const modifiedExtraFields = [...props.extraFields, { name: 'rol', type: 'rol' }]
    /* if (password) {
      modifiedExtraFields = [...props.extraFields, { name: 'password', type: 'password' }];
    } */
    return modifiedExtraFields
  }

  return (
    <>
      <div className="importacion-txt">
        <p>
          Para importar los usuarios de tu curso, debes cargar un archivo excel (.xls) con
          las columnas organizadas (como se muestra abajo). Para mayor facilidad,{' '}
          <strong>descarga nuestro template</strong> para organizar los datos de tus
          asistentes.
        </p>
      </div>
      <h2 className="has-text-grey has-text-weight-bold">CAMPOS REQUERIDOS</h2>
      {errMsg && <Alert type="error" message={errMsg} />}
      <Row wrap gutter={[8, 8]}>
        {addMoreItemsToExtraFields().map((extra, key) => (
          <Col key={key}>
            <span className="has-text-grey-light">{extra?.label || extra?.name}</span>
            <Divider type="vertical" />
          </Col>
        ))}
      </Row>
      <br />
      <Row justify="center" align="middle" wrap gutter={[16, 16]}>
        <Col>
          <Upload.Dragger
            maxCount={1}
            onChange={(e) => handleXlsFile(e.fileList[0])}
            onDrop={(e) => {
              console.log('dropped file:', e)
            }}
            customRequest={uploadImagedummyRequest}
            multiple={false}
            accept=".xls,.xlsx"
            style={{ margin: '0 15px', padding: '0 !important' }}
          >
            <p style={{ textAlign: 'center' }}>
              <InboxOutlined /> <span>Importar Excel</span>
            </p>
          </Upload.Dragger>
        </Col>
        <Col>
          <Button type="link" icon={<DownloadOutlined />} onClick={downloadExcel}>
            Descargar Template
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default Importation