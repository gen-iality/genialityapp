import { Component } from 'react';
import { utils, writeFileXLSX } from 'xlsx';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import Dropzone from 'react-dropzone';
import { Row, Col, Button, Divider, message } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';

Moment.locale('es');
momentLocalizer();

class Importacion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMsg: false,
    };
    this.handleXlsFile = this.handleXlsFile.bind(this); // properly bound once
  }

  handleXlsFile(files) {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras se envía la información..</>,
    });
    const f = files[0];
    const reader = new FileReader();
    const self = this;
    try {
      // reader.onload = (e) => {
      //   const data = e.target.result;
      //   const workbook = XLSX.read(data, { type: 'binary' });
      //   const sheetName = workbook.SheetNames[0];
      //   const sheetObj = workbook.Sheets[sheetName];
      //   if (sheetObj['!ref']) {
      //     var range = XLSX.utils.decode_range(sheetObj['!ref']);
      //     let fields = [];
      //     for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
      //       const keyCell = sheetObj[XLSX.utils.encode_cell({ r: range.s.r, c: colNum })];
      //       let key = keyCell ? keyCell.v.trim() : undefined;
      //       //columna vacia continuamos
      //       if (!key) continue;
      //       fields[colNum] = { key: key, list: [], used: false };
      //       for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
      //         const secondCell = sheetObj[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
      //         let val = secondCell ? secondCell.v : undefined;
      //         fields[colNum].list.push(val);
      //       }
      //     }
      //     message.destroy(loading.key);
      //     message.open({
      //       type: 'success',
      //       content: <>Importación de usuarios exitosa</>,
      //     });
      //     //por si no pudimos agregar ningún dato
      //     if (!fields.length) {
      //       this.setState({ errMsg: 'Excel en blanco, o algún problema con el archivo o el formato' });
      //       return;
      //     }
      //     self.props.handleXls(fields);
      //     return;
      //   } else {
      //     message.destroy(loading.key);
      //     message.open({
      //       type: 'error',
      //       content: <>Excel en blanco</>,
      //     });
      //     this.setState({ errMsg: 'Excel en blanco' });
      //   }
      // };
      // reader.readAsBinaryString(f);
    } catch (e) {
      message.destroy(loading.key);
      message.open({
        type: 'error',
        content: <>Error cargando la información</>,
      });
    }
  }

  downloadExcel = () => {
    let data = [{}];
    this.props.extraFields.map((extra) => {
      return (data[0][extra.name] = '');
    });
    // data[0]['tiquete'] = '';
    /** Se agrega campo requerido que no viene en la consulta de la base de datos */
    data[0]['rol'] = '';
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    let name = this.props.organization ? 'usersorganization_template' : 'attendees_template';
    name = this.props.event ? name + '_' + this.props.event.name : name;

    utils.book_append_sheet(wb, ws, 'Template');
    writeFileXLSX(wb, `${name}${Moment().format('DDMMYY')}.xls`);
  };

  /** Se agregan campos extras para poder mostrar como información en CAMPOS REQUERIDOS */
  addMoreItemsToExtraFields = () => {
    let modifiedExtraFields = [...this.props.extraFields, { name: 'rol', type: 'rol' }];
    return modifiedExtraFields;
  };

  render() {
    // console.log('debug this.props.extraFields', this.addMoreItemsToExtraFields());
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
          {this.addMoreItemsToExtraFields().map((extra, key) => (
            <Col key={key}>
              <span className='has-text-grey-light'>{extra?.label || extra?.name}</span>
              <Divider type='vertical' />
            </Col>
          ))}
        </Row>
        <br />
        <Row justify='center' wrap gutter={[16, 16]}>
          <Col>
            <Dropzone onDrop={this.handleXlsFile} accept='.xls,.xlsx' className='zone'>
              <Button type='primary' icon={<UploadOutlined />}>
                Importar Excel
              </Button>
            </Dropzone>
          </Col>
          <Col>
            <Button type='link' icon={<DownloadOutlined />} onClick={this.downloadExcel}>
              Descargar Template
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Importacion;
