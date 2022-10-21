import { useState } from 'react';
import { utils, writeFileXLSX, read } from 'xlsx';
import dayjs from 'dayjs';
import momentLocalizer from 'react-widgets-moment';
import { Row, Col, Button, Divider, Upload } from 'antd';
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@context/MessageService';
import content from '@containers/content';
import { uploadImagedummyRequest } from '@/Utilities/imgUtils';

dayjs.locale('es');
momentLocalizer();

const Importacion = (props) => {
  const [errMsg, setErrMsg] = useState('');
  const handleXlsFile = (files) => {
    if (files.status === 'error') {
      DispatchMessageService({
        type: 'error',
        msj: 'Error al cargar el archivo excel',
        action: 'show',
      });
      return;
    }
    // The execution stops, since ant design updates the upload event with each change in the file upload progress, this generates an error in the steps of importing users
    if (files.status !== 'done') return;
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se envía la información...',
      action: 'show',
    });
    const f = files.originFileObj;
    const reader = new FileReader();
    try {
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheetObj = workbook.Sheets[sheetName];
        if (sheetObj['!ref']) {
          const range = utils.decode_range(sheetObj['!ref']);
          const fields = [];
          for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
            const keyCell = sheetObj[utils.encode_cell({ r: range.s.r, c: colNum })];
            const key = keyCell ? keyCell.v.trim() : undefined;
            //columna vacia continuamos
            if (!key) continue;
            fields[colNum] = { key: key, list: [], used: false };
            for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
              const secondCell = sheetObj[utils.encode_cell({ r: rowNum, c: colNum })];
              let val = secondCell ? secondCell.v : undefined;
              /** Validation so that the checkIn field saves its value as a string and not as an integer, when Excel is imported */
              props.extraFields.map((field) => {
                if (field.type === 'checkInField' && field.name === key) val = val?.toString();
              });
              fields[colNum].list.push(val);
            }
          }

          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'success',
            msj: 'importación de usuarios exitosa',
            action: 'show',
          });

          //por si no pudimos agregar ningún dato
          if (!fields.length) {
            setErrMsg('Excel en blanco, o algún problema con el archivo o el formato');
            return;
          }
          props.handleXls(fields);
          return;
        } else {
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'error',
            msj: 'Excel en blanco',
            action: 'show',
          });
          setErrMsg('Excel en blanco');
        }
      };
      reader.readAsBinaryString(f);
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
    } catch (e) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: 'Error cargando la información',
        action: 'show',
      });
    }
  };

  const downloadExcel = () => {
    const data = [{}];
    props.extraFields.map((extra) => {
      return (data[0][extra.name] = '');
    });

    //data[0]['tiquete'] = '';
    /** Se agrega campo requerido que no viene en la consulta de la base de datos */
    data[0]['rol'] = '';
    /* if (password) {
      data[0]['password'] = password;
    } */
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    let name = props.organization ? 'usersorganization_template' : 'attendees_template';
    name = props.event ? name + '_' + props.event.name : name;

    utils.book_append_sheet(wb, ws, 'Template');
    writeFileXLSX(wb, `${name}${dayjs().format('DDMMYY')}.xls`);
  };

  /** Se agregan campos extras para poder mostrar como información en CAMPOS REQUERIDOS */
  const addMoreItemsToExtraFields = () => {
    const modifiedExtraFields = [...props.extraFields, { name: 'rol', type: 'rol' }];
    /* if (password) {
      modifiedExtraFields = [...props.extraFields, { name: 'password', type: 'password' }];
    } */
    return modifiedExtraFields;
  };

  return (
    <>
      <div className='importacion-txt'>
        <p>
          Para importar los usuarios de tu curso, debes cargar un archivo excel (.xls) con las columnas organizadas
          (como se muestra abajo). Para mayor facilidad, <strong>descarga nuestro template</strong> para organizar los
          datos de tus asistentes.
        </p>
      </div>
      <h2 className='has-text-grey has-text-weight-bold'>CAMPOS REQUERIDOS</h2>
      <Row wrap gutter={[8, 8]}>
        {addMoreItemsToExtraFields().map((extra, key) => (
          <Col key={key}>
            <span className='has-text-grey-light'>{extra?.label || extra?.name}</span>
            <Divider type='vertical' />
          </Col>
        ))}
      </Row>
      <br />
      <Row justify='center' align='middle' wrap gutter={[16, 16]}>
        <Col>
          <Upload.Dragger
            maxCount={1}
            onChange={(e) => handleXlsFile(e.fileList[0])}
            onDrop={(e) => handleXlsFile(e.fileList[0])}
            customRequest={uploadImagedummyRequest}
            multiple={false}
            accept='.xls,.xlsx'
            style={{ margin: '0 15px', padding: '0 !important' }}>
            <p style={{ textAlign: 'center' }}>
              <InboxOutlined /> <span>Importar Excel</span>
            </p>
          </Upload.Dragger>
        </Col>
        <Col>
          <Button type='link' icon={<DownloadOutlined />} onClick={downloadExcel}>
            Descargar Template
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Importacion;
