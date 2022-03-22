import ImgInput from '../../shared/imageInput';
import { Row, Col } from 'antd';
import { Actions } from '../../../helpers/request';
import Axios from 'axios';
import { useContextNewEvent } from '../../../context/newEventContext';
import { DispatchMessageService } from '../../../context/MessageService';

function Apariencia(props) {
  const { saveImageEvent, imageEvents, onChangeCheck, valueInputs } = useContextNewEvent();

  const ImagenStyle = {
    width: '100%',
    height: '110px',
    border: '2px dashed #aab8c0',
    fontSize: '12px',
    color: '#aab8c0',
    justifyContent: 'center',
    alignContent: 'center',
    display: 'grid',
    borderRadius: '5px',
    cursor: 'pointer',
  };
  //Cambio en el input de imagen
  const changeImg = async (files, indexImage) => {
    if (files) {
      const file = files[0];
      const url = '/api/files/upload',
        path = [],
        self = this;
      if (file) {
        const uploaders = files.map((file) => {
          let data = new FormData();
          data.append('file', file);
          return Actions.post(url, data).then((image) => {
            if (image) path.push(image);
          });
        });

        // eslint-disable-next-line no-unused-vars
        await Axios.all(uploaders).then((data) => {
          saveImageEvent(path[0], indexImage);

          DispatchMessageService({
            type: 'success',
            msj: 'Imagen cargada correctamente...',
            action: 'show',
          });
        });
      } else {
        DispatchMessageService({
          type: 'error',
          msj: 'Error al cargar imagen.',
          action: 'show',
        });
      }
    } else {
      saveImageEvent(files, indexImage);
    }
  };

  return (
    <>
      <div className='step-aparencia' style={{ marginTop: '5%' }}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <ImgInput
              indexImage={'logo'}
              changeImg={changeImg}
              picture={imageEvents['logo'] || '#FFF'}
              style={ImagenStyle}
              width='320'
              height='180'
              text='Agregar logo'></ImgInput>
          </Col>
          <Col xs={24} sm={24} md={12} lg={18} xl={18} xxl={18}>
            <ImgInput
              indexImage={'portada'}
              changeImg={changeImg}
              picture={imageEvents['portada'] || '#FFF'}
              style={ImagenStyle}
              width='1920'
              height='540'
              text='Agregar portada'></ImgInput>
          </Col>
          <Col xs={24} sm={24} md={12} lg={18} xl={18} xxl={18}>
            <ImgInput
              indexImage={'piepagina'}
              changeImg={changeImg}
              picture={imageEvents['piepagina'] || '#FFF'}
              style={ImagenStyle}
              width='1920'
              height='280'
              text='Agregar pie de pagina'></ImgInput>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <ImgInput
              indexImage={'imgfondo'}
              changeImg={changeImg}
              picture={imageEvents['imgfondo'] || '#FFF'}
              style={ImagenStyle}
              width='1920'
              height='2160'
              text='Agregar imagen de fondo'></ImgInput>
          </Col>
        </Row>
        <Row className='container-swicht'>
          {/*<Col xs={24} sm={24} md={12} lg={16} xl={16} xxl={16}>
            <div>
              <p className='theme'>Tema</p>
              <span style={{ fontSize: '12px' }}>
                Claro <Switch checked={valueInputs['temaDark'] || false} onChange={onChangeCheck}  /> Oscuro
              </span>
            </div>
  </Col>*/}
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <div>
              <span className='nota'>
                Nota: estos campos son opcionales y se pueden llenar o editar en cualquier momento del evento
              </span>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Apariencia;
