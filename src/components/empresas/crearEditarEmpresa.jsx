import { CaretLeftOutlined } from '@ant-design/icons'
import { Button, Col, Form, notification, Row, Typography } from 'antd'
import { Field, Formik } from 'formik'
import { apply, keys } from 'ramda'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import InputField from '../formFields/InputField'
import FileField from '../formFields/FileField'
import SelectField from '../formFields/SelectField'
import RichTextComponentField from '../formFields/RichTextComponentField'
import SwitchField from '../formFields/SwitchField'
import Loading from '../loaders/loading'
import useGetCompanyInitialValues from './customHooks/useGetCompanyInitialValues'
import useGetEventCompaniesStandTypesOptions from './customHooks/useGetEventCompaniesStandTypesOptions'
import { createEventCompany, updateEventCompany } from './services'

const { Title } = Typography
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const buttonsLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const NAME_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 500
const TIMES_AND_VENUES_MAX_LENGTH = 100
const URL_MAX_LENGTH = 500

const validationSchema = yup.object().shape( {
  name: yup.string()
    .max( NAME_MAX_LENGTH )
    .required(),
  description: yup.string(),
  times_and_venues: yup.string(),
  services: yup.array()
    .max( 4 )
    .of(
      yup.object().shape( {
        description: yup.string().max( 30 ),
        image: yup.string().url( URL_MAX_LENGTH )
      } )
    ),
  webpage: yup.string()
    .url()
    .max( URL_MAX_LENGTH )
    .required(),
  linkedin: yup.string()
    .url()
    .max( URL_MAX_LENGTH ),
  facebook: yup.string()
    .url()
    .max( URL_MAX_LENGTH ),
  instagram: yup.string()
    .url()
    .max( URL_MAX_LENGTH ),
  twitter: yup.string()
    .url()
    .max( URL_MAX_LENGTH ),
  stand_type: yup.string()
    .required(),
  visible: yup.boolean()
    .required(),
} )
export const defaultInitialValues = {
  name: '',
  stand_type: undefined,
  stand_image: undefined,
  visible: false,
  description: '',
  times_and_venues: '',
  services: [],
  webpage: '',
  linkedin: '',
  facebook: '',
  instagram: '',
  twitter: '',
};
export const companyFormKeys = keys( defaultInitialValues )

function CrearEditarEmpresa ( { event, match, history } ) {
  const { companyId } = match.params
  const [ standTypesOptions, loadingStandTypes ] = useGetEventCompaniesStandTypesOptions( event._id )
  const [ initialValues, loadingInitialValues ] = useGetCompanyInitialValues( event._id, companyId )

  const onSubmit = useCallback( ( values, { setSubmitting } ) => {
    const isNewRecord = !companyId
    const createOrEdit = isNewRecord ? createEventCompany : updateEventCompany
    const paramsArray = isNewRecord ? [ event._id, values ] : [ event._id, companyId, values ]
    const errorObject = {
      message: 'Error',
      description: isNewRecord
        ? 'Ocurrió un error creando la empresa'
        : 'Ocurrió un error actualizando la empresa'
    }

    setSubmitting( true )
    apply( createOrEdit, paramsArray )
      .then( () => history.push( `/event/${ event._id }/empresas` ) )
      .catch( ( error ) => {
        console.error( error )
        notification.error( errorObject )
        setSubmitting( false )
      } )
  }, [ history, event._id, companyId ] )

  if ( loadingStandTypes || loadingInitialValues ) {
    return <Loading />
  }

  return (
    <div>
      <Title level={ 4 }>{ !companyId ? 'Crear empresa' : 'Editar empresa' }</Title>
      <div>
        <Formik
          enableReinitialize
          initialValues={ initialValues }
          validationSchema={ validationSchema }
          onSubmit={ onSubmit }
        >
          { ( { isSubmitting, handleSubmit, handleReset } ) => {
            return (
              <Form onReset={ handleReset } onSubmitCapture={ handleSubmit } { ...formLayout }>
                <Row justify="start">
                  <Col xs={ 20 }>
                    <Field
                      name="name"
                      component={ InputField }
                      label="Nombre empresa"
                      placeholder="Nombre empresa"
                      maxLength={ NAME_MAX_LENGTH }
                      required
                    />
                    <FileField
                      name="stand_image"
                      label="Imagen principal"
                      placeholder=""
                      required
                    />

                    <RichTextComponentField
                      name="description"
                      label="Descripción"
                      maxLength={ DESCRIPTION_MAX_LENGTH }
                      required
                    />

                    <RichTextComponentField
                      name="times_and_venues"
                      label="Información de sedes y horarios"
                      maxLength={ TIMES_AND_VENUES_MAX_LENGTH }
                      required
                    />

                    <Field
                      name="stand_type"
                      component={ SelectField }
                      label="Tipo de stand"
                      placeholder="Tipo de stand"
                      options={ standTypesOptions }
                      required
                    />

                    <Field
                      name="webpage"
                      component={ InputField }
                      label="Página web"
                      placeholder="Url página web"
                      required
                    />

                    <Field
                      name="linkedin"
                      component={ InputField }
                      label="Linkedin"
                      placeholder="Url linkedin"
                    />

                    <Field
                      name="facebook"
                      component={ InputField }
                      label="Facebook"
                      placeholder="Url facebook"
                    />

                    <Field
                      name="instagram"
                      component={ InputField }
                      label="Instagram"
                      placeholder="Url instagram"
                    />

                    <Field
                      name="twitter"
                      component={ InputField }
                      label="Twitter"
                      placeholder="Url twitter"
                    />

                    <Field
                      name="visible"
                      component={ SwitchField }
                      label="Visible"
                    />

                    <Form.Item { ...buttonsLayout }>
                      <Link to={ `/event/${ event._id }/empresas` }>
                        <Button
                          disabled={ isSubmitting }
                          loading={ isSubmitting }
                          icon={ <CaretLeftOutlined /> }
                          style={ { marginRight: '20px' } }
                        >
                          { 'Volver' }
                        </Button>
                      </Link>
                      <Button type="primary" htmlType="submit" disabled={ isSubmitting } loading={ isSubmitting }>
                        { 'Guardar' }
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )
          } }
        </Formik>
      </div>
    </div>
  )
}

export default CrearEditarEmpresa
