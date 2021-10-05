import React from 'react';
import ImgInput from '../../shared/imageInput';
import { Row, Col, Switch } from 'antd';

function Apariencia() {
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
  async function handleImage(files) {
    try {
      const file = files[0];
      if (file) {
        const imageData = await uploadImage(file);
        setData({
          ...data,
          image: imageData
        })
      } else {
        setErrorImage('Solo se permiten archivos de imágenes. Inténtalo de nuevo :)')
      }
    } catch (e) {
      sweetAlert.showError(handleRequestError(e));
    }
  };

  return (
    <>
      <div className='step-aparencia' style={{ marginTop: '5%' }}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <ImgInput style={ImagenStyle} width='320' height='180' text='Agregar logo'></ImgInput>
          </Col>
          <Col xs={24} sm={24} md={12} lg={18} xl={18} xxl={18}>
            <ImgInput style={ImagenStyle} width='1920' height='540' text='Agregar portada'></ImgInput>
          </Col>
          <Col xs={24} sm={24} md={12} lg={18} xl={18} xxl={18}>
            <ImgInput style={ImagenStyle} width='1920' height='280' text='Agregar pie de pagina'></ImgInput>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <ImgInput style={ImagenStyle} width='1920' height='2160' text='Agregar imagen de fondo'></ImgInput>
          </Col>
        </Row>
        <Row className='container-swicht'>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} xxl={16}>
            <div>
              <p className='theme'>Tema</p>
              <span style={{ fontSize: '12px' }}>
                Claro <Switch /> Oscuro
              </span>
            </div>
          </Col>
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
