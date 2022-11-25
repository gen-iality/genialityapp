import { utils, writeFileXLSX, read } from 'xlsx';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { Row, Col, Button, Divider, Upload } from 'antd';
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@/context/MessageService';
import { uploadImagedummyRequest } from '@/Utilities/imgUtils';
import { extraFields, ImportValuesInterface } from '../interfaces/bingo';
import MicrosoftExcelIcon from '@2fd/ant-design-icons/lib/MicrosoftExcel';
import { TemplateData } from '../../bingo/constants/constants';
import { useState } from 'react';

Moment.locale('es');
momentLocalizer();

const ImportValues = ({
  templateName,
  handleXls,
  extraFields,
  event,
  setEnableSaveButton,
  setImportData,
  templateDataDefault,
}: ImportValuesInterface) => {
  /* generate an array of column objects */
  const objectDataGenerator = (refstr: any) => {
    let o = [],
      C = utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = { name: utils.encode_col(i), key: i };
    return o;
  };
  const [downloadWithTemplate, setDownloadWithTemplate] = useState(true);
  const handleXlsFile = (files: any) => {
    if (files.status === 'error') {
      DispatchMessageService({
        type: 'error',
        msj: 'Error al cargar el documento',
        action: 'show',
      });
      return;
    }
    // The execution stops, since ant design updates the upload event with each change in the file upload progress, this generates an error in the steps of importing users
    if (files.status !== 'done') return;
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se valida el documento',
      action: 'show',
    });
    const file = files.originFileObj;
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    try {
      reader.onload = (e: any) => {
        /* Parse data */
        const importData = e.target.result;
        const wb = read(importData, { type: 'binary' });
        /* Get first worksheet */
        const workSheetName = wb.SheetNames[0];
        const workSheet = wb.Sheets[workSheetName];
        /* Convert array of arrays */
        const data = utils.sheet_to_json(workSheet, { header: 2 });
        data.map((r: any, i) => {
          return objectDataGenerator(workSheet['!ref']).map((c) => {
            return r[c.key];
          });
        });

        if (data.length === 0) {
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'error',
            msj: 'Documento en blanco',
            action: 'show',
          });
        } else {
          setEnableSaveButton(false);
          DispatchMessageService({
            key: 'loading',
            action: 'destroy',
          });
          DispatchMessageService({
            type: 'success',
            msj: 'Documento cargado correctamente, ya puedes guardarlo',
            action: 'show',
          });
        }
        handleXls(data);
      };
      reader.readAsBinaryString(file);

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
    let data: any = [];
    let cleanAttribute: string = '';
    let name: string | undefined = '';
    if (downloadWithTemplate === true) {
      data = templateDataDefault || TemplateData;
    } else {
      extraFields.forEach((extra) => {
        if (extra.name === '') return;
        let key: string = extra.name;
        data.push({ [key]: cleanAttribute });
      });
    }
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    name = templateName ? templateName : event.name;
    utils.book_append_sheet(wb, ws, 'Template');
    writeFileXLSX(wb, `${name}${Moment().format('DD_MM_YYYY')}.xls`);
  };
  return (
    <>
      <h2 className='has-text-grey has-text-weight-bold'>CAMPOS REQUERIDOS</h2>
      <Row justify='center' align='middle'>
        {extraFields.map((extra: extraFields, key) => (
          <Col key={key}>
            <span className='has-text-grey-light'>{extra?.label || extra?.name}</span>
            <Divider type='vertical' />
          </Col>
        ))}
      </Row>
      <br />
      <Row justify='space-around' align='middle' wrap gutter={[16, 16]}>
        <Col span={12}>
          <Upload.Dragger
            maxCount={1}
            onChange={(e: any) => handleXlsFile(e.fileList[0])}
            onDrop={(e: any) => handleXlsFile(e.fileList[0])}
            customRequest={uploadImagedummyRequest}
            multiple={false}
            onRemove={(e) => {
              setImportData([[]]);
              setEnableSaveButton(true);
            }}
            accept='.xls,.xlsx'
            style={{ margin: '0 15px', padding: '0 !important' }}>
            <p style={{ textAlign: 'center' }}>
              <MicrosoftExcelIcon /> <span>Importar Excel</span>
            </p>
          </Upload.Dragger>
        </Col>
        <Col span={12}>
          <Button size='large' type='link' icon={<DownloadOutlined />} onClick={downloadExcel}>
            Descargar Template
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ImportValues;
