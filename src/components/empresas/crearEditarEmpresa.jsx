import { CaretLeftOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Col, Form, notification, Row, Typography } from 'antd'
import { Field, FieldArray, Formik } from 'formik'
import { apply, keys } from 'ramda'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import InputField from '../formFields/InputField'
import FileField from '../formFields/FileField'
import ImageField from '../formFields/ImageField'
import SelectField from '../formFields/SelectField'
import RichTextComponentField from '../formFields/RichTextComponentField'
import SwitchField from '../formFields/SwitchField'
import Loading from '../loaders/loading'
import useGetCompanyInitialValues from './customHooks/useGetCompanyInitialValues'
import useGetEventCompaniesStandTypesOptions from './customHooks/useGetEventCompaniesStandTypesOptions'
import useGetEventCompaniesSocialNetworksOptions from './customHooks/useGetEventCompaniesSocialNetworksOptions'
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
const SERVICE_DESCRIPTION_MAX_LENGTH = 30
const SERVICES_LIMIT = 4
const SOCIAL_NETWORKS_LIMIT = 4
const CONTACT_INFO_DESCRIPTION_MAX_LENGTH = 2000

const validationSchema = yup.object().shape( {
  name: yup.string()
    .max( NAME_MAX_LENGTH )
    .required(),
  description: yup.string(),
  times_and_venues: yup.string(),
  contact_info: yup.object().shape({
    image: yup.string(),
    description: yup.string(),
  }),
  services: yup.array()
    .max( SERVICES_LIMIT )
    .of(
      yup.object().shape( {
        description: yup.string(),
        image: yup.string().url().required()
      } )
    ),
  webpage: yup.string()
    .url()
    .max( URL_MAX_LENGTH )
    .required(),
  linkedin: yup.string()
    .url()
    .max( URL_MAX_LENGTH ),
  social_networks: yup.array().max(SOCIAL_NETWORKS_LIMIT).of(
    yup.object().shape({
      network: yup.string().required(),
      url: yup.string().url().required()
    })
  ),
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
  contact_info: { description: '', image: '' },
  services: [ { description: '', image: '' } ],
  brochure: undefined,
  webpage: '',
  social_networks: [{ network: null, url: '' }]
};
export const companyFormKeys = keys( defaultInitialValues )

function CrearEditarEmpresa ( { event, match, history } ) {
  const { companyId } = match.params
  const [ standTypesOptions, loadingStandTypes ] = useGetEventCompaniesStandTypesOptions( event._id )
  const [ socialNetworksOptions, loadingSocialNetworks ] = useGetEventCompaniesSocialNetworksOptions( event._id )
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

  if ( loadingStandTypes || loadingSocialNetworks || loadingInitialValues ) {
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
          { ( { isSubmitting, values, handleSubmit, handleReset } ) => {
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
                    <ImageField
                      name="stand_image"
                      label="Imagen principal"
                      placeholder=""
                      required
                    />
                    <RichTextComponentField
                      name="description"
                      label="Descripción"
                      maxLength={ DESCRIPTION_MAX_LENGTH }
                    />

                    <RichTextComponentField
                      name="times_and_venues"
                      label="Información de sedes y horarios"
                      maxLength={ TIMES_AND_VENUES_MAX_LENGTH }
                    />

                    <Field
                      name="contact_info.image"
                      component={ InputField }
                      label="Imagen de información de contacto"
                      placeholder="Url imagen"
                      maxLength={ URL_MAX_LENGTH }
                      required
                    />

                    <RichTextComponentField
                      name="contact_info.description"
                      label="Descripción de información de contacto"
                      maxLength={CONTACT_INFO_DESCRIPTION_MAX_LENGTH}
                    />

                    <FieldArray
                      name="services"
                      render={ ( arrayHelpers ) => {
                        return !!values.services && values.services.length > 0
                          ? (
                            <>
                              { values.services.map( ( _service, serviceIndex ) => (
                                <div key={ `service-item-${ serviceIndex }` }>
                                  <RichTextComponentField
                                    name={ `services[${ serviceIndex }].description` }
                                    label={ `Descripción servicio ${ serviceIndex + 1 }` }
                                    maxLength={ SERVICE_DESCRIPTION_MAX_LENGTH }
                                    required
                                  />

                                  <Field
                                    name={ `services[${ serviceIndex }].image` }
                                    component={ InputField }
                                    label={ `Imagen servicio ${ serviceIndex + 1 }` }
                                    placeholder="Url imagen"
                                    maxLength={ URL_MAX_LENGTH }
                                    required
                                  />

                                  <Form.Item { ...buttonsLayout }>
                                    { values.services.length > 1 && (
                                      <Button
                                        type="danger"
                                        icon={ <DeleteOutlined /> }
                                        onClick={ () => {
                                          arrayHelpers.remove( serviceIndex )
                                        } }
                                        style={ { marginRight: '20px' } }
                                      >
                                        { 'Eliminar' }
                                      </Button>
                                    ) }
                                    { values.services.length < SERVICES_LIMIT && serviceIndex === values.services.length - 1 && (
                                      <Button
                                        type="primary"
                                        icon={ <PlusCircleOutlined /> }
                                        onClick={ () => {
                                          arrayHelpers.push( { description: '', image: '' } )
                                        } }
                                      >
                                        { 'Agregar servicio' }
                                      </Button>
                                    ) }
                                  </Form.Item>
                                </div>
                              ) ) }
                            </>
                          ) : (
                            <Form.Item { ...buttonsLayout }>
                              <Button
                                type="primary"
                                icon={ <PlusCircleOutlined /> }
                                onClick={ () => {
                                  arrayHelpers.push( { description: '', image: '' } )
                                } }
                              >
                                { 'Agregar servicio' }
                              </Button>
                            </Form.Item>
                          )
                      }
                      }
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
                      name="brochure"
                      component={ InputField }
                      label="B"
                      placeholder="Url página web"
                      required
                    />

                    <FileField
                      name="brochure"
                      label="Brochure"
                      placeholder=""
                      required
                    />


                    <Field
                      name="webpage"
                      component={ InputField }
                      label="Página web"
                      placeholder="Url página web"
                      required
                    />

                    <FieldArray
                      name="social_networks"
                      render={ ( arrayHelpers ) => {
                        return !!values.social_networks && values.social_networks.length > 0
                          ? (
                            <>
                              { values.social_networks.map( ( _sn, socialNetworkIndex ) => (
                                <div key={ `social-network-item-${ socialNetworkIndex }` }>
                                  <Field
                                    name={`social_networks[${ socialNetworkIndex }].network`}
                                    component={ SelectField }
                                    label={ `Red social ${ socialNetworkIndex + 1 }` }
                                    placeholder="Red social"
                                    options={ socialNetworksOptions }
                                    required
                                  />

                                  <Field
                                    name={ `social_networks[${ socialNetworkIndex }].url` }
                                    component={ InputField }
                                    label={ `Url red social ${ socialNetworkIndex + 1 }` }
                                    placeholder="Url red social"
                                    maxLength={ URL_MAX_LENGTH }
                                    required
                                  />

                                  <Form.Item { ...buttonsLayout }>
                                    { values.social_networks.length > 1 && (
                                      <Button
                                        type="danger"
                                        icon={ <DeleteOutlined /> }
                                        onClick={ () => {
                                          arrayHelpers.remove( socialNetworkIndex )
                                        } }
                                        style={ { marginRight: '20px' } }
                                      >
                                        { 'Eliminar' }
                                      </Button>
                                    ) }
                                    { values.social_networks.length < SOCIAL_NETWORKS_LIMIT && socialNetworkIndex === values.social_networks.length - 1 && (
                                      <Button
                                        type="primary"
                                        icon={ <PlusCircleOutlined /> }
                                        onClick={ () => {
                                          arrayHelpers.push( { description: '', image: '' } )
                                        } }
                                      >
                                        { 'Agregar red social' }
                                      </Button>
                                    ) }
                                  </Form.Item>
                                </div>
                              ) ) }
                            </>
                          ) : (
                            <Form.Item { ...buttonsLayout }>
                              <Button
                                type="primary"
                                icon={ <PlusCircleOutlined /> }
                                onClick={ () => {
                                  arrayHelpers.push( { description: '', image: '' } )
                                } }
                              >
                                { 'Agregar red social' }
                              </Button>
                            </Form.Item>
                          )
                      }
                      }
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
