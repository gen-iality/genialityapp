import { Component, useState } from 'react';
import { utils, writeFileXLSX, read } from 'xlsx';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import { Row, Col, Button, Divider, Upload, Modal, Form, Input, Checkbox, Space, Alert, Typography } from 'antd';
import { UploadOutlined, DownloadOutlined, InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '../../context/MessageService';
import content from '@/containers/content';

Moment.locale('es');
momentLocalizer();

const Importacion = (props) => {
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [genericPassword, setGenericPassword] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [password, setPassword] = useState(null);

  const savePassword = (value) => {
    setPassword(value.password);
    setShowModal(false);
  };

  const content = () => {
    return (
      <Form onFinish={savePassword} preserve={false}>
        <Form.Item
          name='password'
          label='Contraseña'
          rules={[
            {
              required: true,
              message: '¡Por favor ingresa la contraseña!',
            },
          ]}
          hasFeedback>
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='Confirmar contraseña'
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '¡Por favor confirma la contraseña!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('¡Las constraseñas no coinciden!'));
              },
            }),
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button
              onClick={() => {
                Modal.destroyAll();
                setShowModal(false);
              }}>
              Cancelar
            </Button>
            <Button type='primary' htmlType='submit' onClick={() => Modal.destroyAll()}>
              Continuar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  const handleXlsFile = (files) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se envía la información...',
      action: 'show',
    });
    const f = files;
    const reader = new FileReader();
    try {
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheetObj = workbook.Sheets[sheetName];
        if (sheetObj['!ref']) {
          var range = utils.decode_range(sheetObj['!ref']);
          let fields = [];
          for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
            const keyCell = sheetObj[utils.encode_cell({ r: range.s.r, c: colNum })];
            let key = keyCell ? keyCell.v.trim() : undefined;
            //columna vacia continuamos
            if (!key) continue;
            fields[colNum] = { key: key, list: [], used: false };
            for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
              const secondCell = sheetObj[utils.encode_cell({ r: rowNum, c: colNum })];
              let val = secondCell ? secondCell.v : undefined;
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
          props.handleXls(fields, password);
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
    let data = [{}];
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
    writeFileXLSX(wb, `${name}${Moment().format('DDMMYY')}.xls`);
  };

  /** Se agregan campos extras para poder mostrar como información en CAMPOS REQUERIDOS */
  const addMoreItemsToExtraFields = () => {
    let modifiedExtraFields = [...props.extraFields, { name: 'rol', type: 'rol' }];
    /* if (password) {
      modifiedExtraFields = [...props.extraFields, { name: 'password', type: 'password' }];
    } */
    return modifiedExtraFields;
  };

  return (
    <React.Fragment>
      <div className='importacion-txt'>
        <p>
          Para importar los usuarios de tu evento, debes cargar un archivo excel (.xls) con las columnas organizadas
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
            onChange={(e) => handleXlsFile(e.fileList[0].originFileObj)}
            onDrop={(e) => handleXlsFile(e.fileList[0].originFileObj)}
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

      <Modal
        title='¿Desea crear una contraseña genérica?'
        icon={<ExclamationCircleOutlined />}
        footer={null}
        destroyOnClose={true}
        closable={false}
        visible={showModal}>
        <Alert
          message={
            genericPassword ? (
              <Typography.Paragraph>
                En el caso aceptar "SÍ deseo una contraseña genérica", se aplicará una contraseña genérica "sólo" a
                usuarios nuevos dentro de la plataforma, en caso de ya tener una cuenta, el mismo continuará con su
                antigua contraseña.
              </Typography.Paragraph>
            ) : (
              <Typography.Paragraph>
                En el caso de continuar con "NO deseo una contraseña genérica", se continuará con el proceso de
                importación de usuarios habitual, y la contraseña asignada sería el mismo correo electrónico (aplica
                para los nuevos usuarios), los usuarios antiguos continuarán con su misma contraseña.
              </Typography.Paragraph>
            )
          }
          type='info'
          showIcon
        />{' '}
        <br />
        <Checkbox
          onChange={(e) => {
            setGenericPassword(e.target.checked);
          }}>
          {genericPassword ? 'Sí' : 'No'}
        </Checkbox>{' '}
        <br />
        {genericPassword ? (
          content()
        ) : (
          <div style={{ textAlign: 'right' }}>
            <Button
              type='primary'
              onClick={() => {
                Modal.destroyAll();
                setShowModal(false);
              }}>
              Continuar
            </Button>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default Importacion;
