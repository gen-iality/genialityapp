import React, { useState, useCallback } from 'react';
import { Input } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { getIn } from 'formik'
import { concat, omit, pick } from 'ramda'
import { Field } from 'formik'
import ImageInput from "../../shared/imageInput";
import axios from "axios";
import { toast } from "react-toastify";
import { Actions } from "../../../helpers/request";
import { FormattedMessage } from "react-intl";

const FORMIK_PROPS_KEYS = [ 'form', 'field', 'meta' ]
const FORM_ITEM_PROPS_KEYS = [ 'label', 'required' ]
const NOT_PROPS_KEYS = concat( FORMIK_PROPS_KEYS, FORM_ITEM_PROPS_KEYS )

function ImageField ( rawProps ) {

  const [ picture, setPicture ] = useState( null );


  let ancho = "200";
  let alto = "200";
  let errorMsg = "";
  const props = omit( NOT_PROPS_KEYS, rawProps )
  const formikProps = pick( FORMIK_PROPS_KEYS, rawProps )
  const formItemProps = pick( FORM_ITEM_PROPS_KEYS, rawProps )

  const { name } = rawProps



  const handleChange = ( ( newValue, form, field ) => {
    form.setFieldValue( field.name, newValue )
  } )

  const handleBlur = ( ( form, field ) => {
    form.setFieldTouched( field.name, true )

  } )
  //funciones para cargar imagenes y enviar un popup para avisar al usuario que la imagen ya cargo o cambiar la imagen

  const validate = useCallback( () => {
    return undefined
  } )
  let saveEventImage = ( form, field, files, imageFieldName ) => {


    const file = files[ 0 ];
    let imageUrl = null;
    const url = "/api/files/upload";

    if ( file ) {

      // this.setState( {
      //   imageFile: file,
      //   event: { ...this.state.event, picture: null },
      // } );

      //envia el archivo de imagen como POST al API
      const uploaders = files.map( ( file ) => {
        let data = new FormData();
        data.append( "file", file );
        return Actions.post( url, data ).then( ( image ) => {
          console.log( "image", image );
          if ( image ) {

            setPicture( image );

            imageUrl = image;


            handleChange( image, form, field );
            handleBlur( form, field );
          }
        } );
      } );

      //this.setState( { isLoading: true } );

      //cuando todaslas promesas de envio de imagenes al servidor se completan
      axios.all( uploaders ).then( async ( data ) => {
        //let temp = { ...this.state.styles };
        //temp[ imageFieldName ] = imageUrl;


        //this.setState( { styles: temp, isLoading: false } );

        // self.setState( {
        //   fileMsg: "Imagen subida con exito",
        // } );

        toast.success( <FormattedMessage id="toast.img" defaultMessage="Ok!" /> );
      } );
    } else {
      //this.setState( { errImg: "Solo se permiten imágenes. Intentalo de nuevo" } );
    }
  }


  return (
    <Field
      name={ name }
      validate={ validate }
    >
      { ( { field, form, meta } ) => {
        const fieldError = meta.touched && meta.error

        return (
          <FormItem
            label={ formItemProps.label }
            required={ formItemProps.required }
            help={ fieldError }
            validateStatus={ fieldError ? "error" : undefined }
          >
            <Input
              value={ field.value }
            />
            <ImageInput
              picture={ field.value }
              width={ ancho }
              height={ alto }

              changeImg={ ( files ) => {
                saveEventImage( form, field, files, "nombre" );
              } }
              errImg={ errorMsg }
              { ...props }
            />
          </FormItem>
        )
      } }
    </Field>
  )
}

export default ImageField
