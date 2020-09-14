import React, { useState } from "react";
import Dropzone from "react-dropzone";

let FileInput = ( props ) => {
  //Esto es para detectar cuando despues de cargar una imagen, la imagen efectivamente cargo y quitar el loading
  const [ stillOldImage, setStillOldImage ] = useState( false );
  if ( stillOldImage && stillOldImage !== props.picture ) {
    setStillOldImage( false );
  }


  let style = props.style || {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 50,
    width: "100%",
    borderWidth: 2,
    borderColor: "#b5b5b5",
    borderStyle: "dashed",
    borderRadius: 10,
  };
  let contentDrop = props.contentDrop || (
    <button
      onClick={ ( e ) => {
        e.preventDefault();
      } }
      className={ `button is-primary  is-outlined ${ stillOldImage ? "is-loading" : "" }` }>
      Cambiar Archivo
    </button>
  );
  // let divClass = props.divClass || "drop-img";
  let classDrop = props.classDrop || "dropzone";

  const ContainerDropzone = {
    maxWidth: "100%",
    minHeight: "auto"
  }

  return (
    <div className="inputImage" style={ ContainerDropzone }>
      <p>{ props.picture } </p>
      {/* el #FFF es por un error que se nos fue a la base de datos*/ }
      { props.picture && props.picture !== "#FFF" ? (
        <div style={ ContainerDropzone }>

          <Dropzone
            style={ style }
            onDrop={ ( e ) => {
              setStillOldImage( props.picture );
              props.changeImg( e );
            } }
            className={ classDrop }>
            { contentDrop }
          </Dropzone>
        </div>
      ) : (
          <div>
            <Dropzone onDrop={ props.changeImg } style={ style }>
              <div className="has-text-grey has-text-weight-bold has-text-centered">
                <span>Subir Archivo</span>

              </div>
            </Dropzone>
            <span>{ props.errImg }</span>
          </div>
        ) }
    </div>
  );
};
export default FileInput;
