import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Button, Typography } from 'antd';

let FileInput = (props) => {
  //Esto es para detectar cuando despues de cargar una imagen, la imagen efectivamente cargo y quitar el loading
  const [stillOldImage, setStillOldImage] = useState(false);
  if (stillOldImage && stillOldImage !== props.picture) {
    setStillOldImage(false);
  }

  let style = props.style || {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 50,
    width: '100%',
    borderWidth: 2,
    borderColor: '#b5b5b5',
    borderStyle: 'dashed',
    borderRadius: 10,
  };
  let contentDrop = props.contentDrop || (
    <Button
      type='text'
      size='large'
      block
      onClick={(e) => {
        e.preventDefault();
      }}
      loading={stillOldImage}>
      Cambiar Archivo
    </Button>
  );
  // let divClass = props.divClass || "drop-img";
  let classDrop = props.classDrop || 'dropzone';

  const ContainerDropzone = {
    maxWidth: '100%',
    minHeight: 'auto',
  };

  return (
    <div className='inputImage' style={ContainerDropzone}>
      <p>{props.picture} </p>
      {/* el #FFF es por un error que se nos fue a la base de datos*/}
      {props.picture && props.picture !== '#FFF' ? (
        <div style={ContainerDropzone}>
          <Dropzone
            style={style}
            onDrop={(e) => {
              setStillOldImage(props.picture);
              props.changeImg(e);
            }}
            className={classDrop}>
            {contentDrop}
          </Dropzone>
        </div>
      ) : (
        <div>
          <Dropzone onDrop={props.changeImg} style={style}>
            <Typography.Text strong style={{ fontSize: '16px' }}>
              Subir Archivo
            </Typography.Text>
          </Dropzone>
          <span>{props.errImg}</span>
        </div>
      )}
    </div>
  );
};
export default FileInput;
