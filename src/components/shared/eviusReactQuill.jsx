import React, { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import { toolbarEditor } from '../../helpers/constants';
import { Actions } from '../../helpers/request';

const { Quill } = ReactQuill;
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);

/**
 * Se creo un componente para extender la funcionalidad de Quill para que las imagenes que se suban no queden cómo base64 sino se suben
 * a un servidor y se guarda es el src a esa imagen, para no guardar la imagen en la base de datos.
 * También centralizamos la configuración de QUILL para que sea la misma en todo lado donde lo usamos
 * @param {*} props
 */

function EviusReactQuill(props) {
  let reactQuilllRef = useRef(null);
  const [modules, setModules] = useState({});

  useEffect(() => {
    console.log('general', props.data);
  }, [props.data]);

  useEffect(() => {
    let setupToolBarImageUploadInput = (reactQuilllRef) => {
      var ImageData = QuillImageDropAndPaste.ImageData;
      let editor = reactQuilllRef.current.getEditor();

      editor.getModule('toolbar').addHandler('image', function(clicked) {
        if (clicked) {
          var fileInput = this.container.querySelector('input.ql-image[type=file]');
          if (fileInput == null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
            fileInput.classList.add('ql-image');
            fileInput.addEventListener('change', function(e) {
              var files = e.target.files,
                file;
              if (files.length > 0) {
                file = files[0];
                var type = file.type;
                var reader = new FileReader();
                reader.onload = (e) => {
                  // handle the inserted image
                  var dataUrl = e.target.result;
                  imageHandler(dataUrl, type, new ImageData(dataUrl, type), reactQuilllRef);
                  fileInput.value = '';
                };
                reader.readAsDataURL(file);
              }
            });
          }
          fileInput.click();
        }
      });
    };

    setupToolBarImageUploadInput(reactQuilllRef);

    let imageHandler = async (imageDataUrl, type, imageData, reactQuilllRef) => {
      if (reactQuilllRef.current.getEditor) {
        let editor = reactQuilllRef.current.getEditor();
        //no se cómo definir el nombre de la imagen
        var filename = 'default.png';
        var blob = imageData.toBlob();
        var file = imageData.toFile(filename);

        // generate a form data
        var formData = new FormData();

        // append blob data
        formData.append('filename', filename);
        formData.append('file', blob);

        // or just append the file
        formData.append('file', file);

        const url = '/api/files/upload';
        // upload image to your server

        let image = await Actions.post(url, formData);

        let index = (editor.getSelection() || {}).index;
        editor.insertEmbed(index, 'image', image, 'user');
      }
    };

    setModules({
      ...toolbarEditor,
      // toolbar: {
      //   // handlers: {
      //   //   image: imageHandler,
      //   // },
      // },
      imageDropAndPaste: imageHandler,
      // imageDropAndPaste: {
      //   // add an custom image handler
      //   handler: (imageDataUrl, type, imageData) => {
      //     imageHandler(imageDataUrl, type, imageData, reactQuilllRef);
      //   },
      // },
    });
  }, []);

  return <ReactQuill ref={reactQuilllRef} modules={modules} onChange={props.handleChange} value={props.data} />;
}

export default EviusReactQuill;
