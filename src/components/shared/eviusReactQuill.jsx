import { useRef, useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import { Actions } from '@helpers/request'

import htmlEditButton from 'quill-html-edit-button'

const { Quill } = ReactQuill
Quill.register({
  'modules/htmlEditButton': htmlEditButton,
})

/**
 * Se creo un componente para extender la funcionalidad de Quill para que las imagenes que se suban no queden cómo base64 sino se suben
 * a un servidor y se guarda es el src a esa imagen, para no guardar la imagen en la base de datos.
 * También centralizamos la configuración de QUILL para que sea la misma en todo lado donde lo usamos
 * @param {{name?:string, data?: string, handleChange?: (x: string) => void}} props
 */
function EviusReactQuill(props) {
  const reactQuilllRef = useRef(null)

  function imageHandlerUpload(clicked) {
    const ImageData = QuillImageDropAndPaste.ImageData
    if (clicked) {
      let fileInput = this.container.querySelector('input.ql-image[type=file]')
      if (fileInput == null) {
        fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        fileInput.setAttribute(
          'accept',
          'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',
        )
        fileInput.classList.add('ql-image')
        fileInput.addEventListener('change', function (e) {
          const files = e.target.files
          let file
          if (files.length > 0) {
            file = files[0]
            const type = file.type
            const reader = new FileReader()
            reader.onload = (e) => {
              // handle the inserted image
              const dataUrl = e.target.result
              imageHandler(dataUrl, type, new ImageData(dataUrl, type), reactQuilllRef)
              fileInput.value = ''
            }
            reader.readAsDataURL(file)
          }
        })
      }
      fileInput.click()
    }
  }

  const imageHandler = async (imageDataUrl, type, imageData, reactQuilllRef) => {
    if (reactQuilllRef.current.getEditor) {
      const editor = reactQuilllRef.current.getEditor()
      //no se cómo definir el nombre de la imagen
      const filename = 'default.png'
      const blob = imageData.toBlob()
      const file = imageData.toFile(filename)

      // generate a form data
      const formData = new FormData()

      // append blob data
      formData.append('filename', filename)
      formData.append('file', blob)

      // or just append the file
      formData.append('file', file)

      const url = '/api/files/upload'
      // upload image to your server

      const image = await Actions.post(url, formData)

      const index = (editor.getSelection() || {}).index
      editor.insertEmbed(index, 'image', image, 'user')
    }
  }

  //add new custom button to the toolbar "image" to upload images to the server
  const setupToolBarImageUploadInput = (reactQuilllRef) => {
    const editor = reactQuilllRef.current.getEditor()
    editor.getModule('toolbar').addHandler('image', imageHandlerUpload)
  }

  useEffect(() => {
    setupToolBarImageUploadInput(reactQuilllRef)
  }, [])

  var modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ header: [0, 1, 2, 3, 4, 5] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ align: [] }],
        [{ syntax: true }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
      ],
    },
    htmlEditButton: {},
  }

  return (
    <>
      <ReactQuill
        id="reactQuill"
        ref={reactQuilllRef}
        modules={modules}
        onChange={props.handleChange}
        value={props.data}
      />
    </>
  )
}

export default EviusReactQuill
