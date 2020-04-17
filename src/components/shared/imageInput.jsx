import React, { Component } from "react";
import Dropzone from "react-dropzone";

let ImageInput = (props) => {
  let style = props.style || {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 250,
    width: "100%",
    borderWidth: 2,
    borderColor: "#b5b5b5",
    borderStyle: "dashed",
    borderRadius: 10,
  };
  let contentDrop = props.contentDrop || (
    <button
      onClick={(e) => {
        e.preventDefault();
      }}
      className={`button is-primary is-inverted is-outlined ${props.isLoading ? "is-loading" : ""}`}>
      Cambiar foto
    </button>
  );
  let divClass = props.divClass || "drop-img";
  let classDrop = props.classDrop || "dropzone";

  return (
    <div>
      {props.picture ? (
        <div className={divClass}>
          <img src={props.picture} alt={"Imagen"} />
          <Dropzone accept="image/*" onDrop={props.changeImg} className={classDrop}>
            {contentDrop}
          </Dropzone>
        </div>
      ) : (
        <div>
          <Dropzone accept="image/*" onDrop={props.changeImg} style={style}>
            <div className="has-text-grey has-text-weight-bold has-text-centered">
              <span>Subir foto</span>
              <br />
              <small>(Tamaño recomendado: 1280px x 960px)</small>
            </div>
          </Dropzone>
          <span>{props.errImg}</span>
        </div>
      )}
    </div>
  );
};
export default ImageInput;
