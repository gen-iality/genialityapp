import { CaretLeftOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, notification, Row, Typography } from 'antd';
import { Field, FieldArray, Formik } from 'formik';
import { apply, keys } from 'ramda';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import InputField from '../formFields/InputField';
import FileField from '../formFields/FileField';
import ImageField from '../formFields/ImageField';
import SelectField from '../formFields/SelectField';
import RichTextComponentField from '../formFields/RichTextComponentField';
import SwitchField from '../formFields/SwitchField';
import Loading from '../loaders/loading';
import useGetCompanyInitialValues from './customHooks/useGetCompanyInitialValues';
import useGetEventCompaniesStandTypesOptions from './customHooks/useGetEventCompaniesStandTypesOptions';
import useGetEventCompaniesSocialNetworksOptions from './customHooks/useGetEventCompaniesSocialNetworksOptions';
import { createEventCompany, updateEventCompany } from './services';

const { Title } = Typography;
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const buttonsLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 1000;
const TIMES_AND_VENUES_MAX_LENGTH = 100;
const URL_MAX_LENGTH = 500;
const SERVICE_DESCRIPTION_MAX_LENGTH = 1000;
//const SERVICES_LIMIT = 4
const SOCIAL_NETWORKS_LIMIT = 4;
//const ADVISOR_LIMIT = 3
const GALLERY_LIMIT = 30;
const CONTACT_INFO_DESCRIPTION_MAX_LENGTH = 1000;

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(NAME_MAX_LENGTH)
    .min(3, 'Ingrese un nombre de empresa válido')
    .required('El nombre de la empresa es requerido'),
  description: yup.string(),
  short_description: yup.string(),
  stand_image: yup.string().required('la imagen es requerida'),
  list_image: yup.string().required('la imagen es requerida'),
  times_and_venues: yup.string(),
  contact_info: yup.object().shape({
    //image: yup.string(),
    description: yup.string(),
  }),
  advisor: yup
    .array()
    //.max(ADVISOR_LIMIT)
    .of(
      yup.object().shape({
        //image: yup.string().url(),
        name: yup.string().required('Este campo es requerido'),
        codPais: yup.string().required('Este campo es requerido'),
        number: yup.string().required('Este campo es requerido'),
        cargo: yup.string().required('Este campo es requerido'),
        email: yup.string().required('Este campo es requerido'),
      })
    ),
  services: yup
    .array()
    //.max(SERVICES_LIMIT)
    .of(
      yup.object().shape({
        description: yup.string(),
        //image: yup.string().url(),
        nombre: yup
          .string()
          .min(3, 'nombre de servicio no válido')
          .required('El nombre del servicio es requerido'),
        category: yup.string(),
      })
    ),
  webpage: yup
    .string()
    .url()
    .max(URL_MAX_LENGTH),
  email: yup.string().max(40),
  telefono: yup.string().max(10),
  video_url: yup
    .string()
    .url()
    .max(URL_MAX_LENGTH),
  linkedin: yup
    .string()
    .url()
    .max(URL_MAX_LENGTH),
  social_networks: yup
    .array()
    .max(SOCIAL_NETWORKS_LIMIT)
    .of(
      yup.object().shape({
        network: yup.string(),
        url: yup.string().url(),
      })
    ),

  stand_type: yup.string(),
  visible: yup.boolean(),
});
export const defaultInitialValues = {
  name: '',
  stand_type: '',
  stand_image: '',
  list_image: '',
  visible: false,
  description: '',
  short_description: '',
  times_and_venues: '',
  contact_info: { description: '', image: '' },
  advisor: [],
  services: [],
  brochure: '',
  webpage: '',
  telefono: '',
  email: '',
  video_url: '',
  social_networks: [],
  gallery: [],
  visitors_space_id: '',
};
export const companyFormKeys = keys(defaultInitialValues);

function CrearEditarEmpresa({ event, match, history }) {
  const { companyId } = match.params;
  const [standTypesOptions, loadingStandTypes] = useGetEventCompaniesStandTypesOptions(event._id);
  const [socialNetworksOptions, loadingSocialNetworks] = useGetEventCompaniesSocialNetworksOptions(event._id);
  const [initialValues, loadingInitialValues] = useGetCompanyInitialValues(event._id, companyId);

  const onSubmit = useCallback(
    (values, { setSubmitting }) => {
      const isNewRecord = !companyId;
      const createOrEdit = isNewRecord ? createEventCompany : updateEventCompany;
      const paramsArray = isNewRecord ? [event._id, values] : [event._id, companyId, values];
      const errorObject = {
        message: 'Error',
        description: isNewRecord ? 'Ocurrió un error creando la empresa' : 'Ocurrió un error actualizando la empresa',
      };
      console.log(paramsArray);
      setSubmitting(true);
      apply(createOrEdit, paramsArray)
        .then(() => history.push(`/event/${event._id}/empresas`))
        .catch((error) => {
          console.log('ERROR');
          console.error(error);
          notification.error(errorObject);
          setSubmitting(false);
        });
    },
    [history, event._id, companyId]
  );

  if (loadingStandTypes || loadingSocialNetworks || loadingInitialValues) {
    return <Loading />;
  }

  return (
    <div>
      <Title level={4}>{!companyId ? 'Crear empresa' : 'Editar empresa'}</Title>
      <div>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({ isSubmitting, errors, values, handleSubmit, handleReset }) => {
            console.error(errors);
            return (
              <Form onReset={handleReset} onSubmitCapture={handleSubmit} {...formLayout}>
                <Row justify='start'>
                  <Col xs={20}>
                    <Field
                      name='name'
                      component={InputField}
                      label='Nombre empresa *'
                      placeholder='Ingrese el nombre de su empresa o stand'
                      maxLength={NAME_MAX_LENGTH}
                    />

                    <Field name='video_url' component={InputField} label='Video' placeholder='Url video' />

                    <ImageField required name='stand_image' label='Banner de la empresa' />

                    <ImageField name='list_image' label='Logo de la empresa' />

                    <RichTextComponentField
                      name='description'
                      label='Descripción larga'
                      maxLength={DESCRIPTION_MAX_LENGTH}
                    />

                    <RichTextComponentField
                      name='short_description'
                      label='Descripción Corta'
                      maxLength={DESCRIPTION_MAX_LENGTH}
                    />

                    <Field
                      name='telefono'
                      component={InputField}
                      label='Teléfono de la empresa'
                      placeholder='Ingrese su telefono'
                    />
                    <Field
                      name='email'
                      component={InputField}
                      label='correo de la empresa'
                      placeholder='ejemplo@ejemplo.com'
                    />
                    <Field name='webpage' component={InputField} label='Página web' placeholder='Url página web' />
                    {/* <ImageField
                      name='contact_info.image'
                      label='Imagen de información de contacto'
                      placeholder='Url imagen'
                      maxLength={URL_MAX_LENGTH}
                    />

                    <RichTextComponentField
                      name='contact_info.description'
                      label='Descripción de información de contacto'
                      maxLength={CONTACT_INFO_DESCRIPTION_MAX_LENGTH}
                    />*/}

                    <Field
                      name='stand_type'
                      component={SelectField}
                      label='Tipo de stand'
                      placeholder='Tipo de stand'
                      options={standTypesOptions}
                    />

                    <FileField name='brochure' label='Brochure' placeholder='' />

                    <FieldArray
                      name='services'
                      render={(arrayHelpers) => {
                        return !!values.services && values.services.length > 0 ? (
                          <>
                            {values.services.map((_service, serviceIndex) => (
                              <div key={`service-item-${serviceIndex}`}>
                                <Field
                                  name={`services[${serviceIndex}].nombre`}
                                  component={InputField}
                                  label={`Nombre servicio ${serviceIndex + 1}`}
                                  placeholder='Nombre del servicio'
                                  maxLength={20}
                                />

                                <Field
                                  name={`services[${serviceIndex}].category`}
                                  component={SelectField}
                                  label={`Categoría servicio ${serviceIndex + 1}`}
                                  placeholder='Categoría'
                                  options={[
                                    { value: 'Servicio', label: 'Servicio' },
                                    { value: 'Producto', label: 'Producto' },
                                  ]}
                                />

                                <RichTextComponentField
                                  name={`services[${serviceIndex}].description`}
                                  label={`Descripción servicio ${serviceIndex + 1}`}
                                  maxLength={SERVICE_DESCRIPTION_MAX_LENGTH}
                                />

                                <ImageField
                                  name={`services[${serviceIndex}].image`}
                                  label={`Imagen servicio ${serviceIndex + 1}`}
                                  placeholder='Url imagen'
                                  maxLength={URL_MAX_LENGTH}
                                />

                                <Form.Item {...buttonsLayout}>
                                  {values.services.length > 0 && (
                                    <Button
                                      type='danger'
                                      icon={<DeleteOutlined />}
                                      onClick={() => {
                                        arrayHelpers.remove(serviceIndex);
                                      }}
                                      style={{ marginRight: '20px' }}>
                                      {'Eliminar'}
                                    </Button>
                                  )}

                                  {/* values.services.length < SERVICES_LIMIT && */}
                                  {serviceIndex === values.services.length - 1 && (
                                    <Button
                                      type='primary'
                                      icon={<PlusCircleOutlined />}
                                      onClick={() => {
                                        arrayHelpers.push({ description: '', image: '' });
                                      }}>
                                      {'Agregar servicio'}
                                    </Button>
                                  )}
                                </Form.Item>
                              </div>
                            ))}
                          </>
                        ) : (
                          <Form.Item {...buttonsLayout}>
                            <Button
                              type='primary'
                              icon={<PlusCircleOutlined />}
                              onClick={() => {
                                arrayHelpers.push({ description: '', image: '' });
                              }}>
                              {'Agregar servicio'}
                            </Button>
                          </Form.Item>
                        );
                      }}
                    />
                    <FieldArray
                      name='social_networks'
                      render={(arrayHelpers) => {
                        return !!values.social_networks && values.social_networks.length > 0 ? (
                          <>
                            {values.social_networks.map((_sn, socialNetworkIndex) => (
                              <div key={`social-network-item-${socialNetworkIndex}`}>
                                <Field
                                  name={`social_networks[${socialNetworkIndex}].network`}
                                  component={SelectField}
                                  label={`Red social ${socialNetworkIndex + 1}`}
                                  placeholder='Red social'
                                  options={socialNetworksOptions}
                                />

                                <Field
                                  name={`social_networks[${socialNetworkIndex}].url`}
                                  component={InputField}
                                  label={`Url red social ${socialNetworkIndex + 1}`}
                                  placeholder='Url red social'
                                  maxLength={URL_MAX_LENGTH}
                                />

                                <Form.Item {...buttonsLayout}>
                                  {values.social_networks.length > 0 && (
                                    <Button
                                      type='danger'
                                      icon={<DeleteOutlined />}
                                      onClick={() => {
                                        arrayHelpers.remove(socialNetworkIndex);
                                      }}
                                      style={{ marginRight: '20px' }}>
                                      {'Eliminar'}
                                    </Button>
                                  )}
                                  {values.social_networks.length < SOCIAL_NETWORKS_LIMIT &&
                                    socialNetworkIndex === values.social_networks.length - 1 && (
                                      <Button
                                        type='primary'
                                        icon={<PlusCircleOutlined />}
                                        onClick={() => {
                                          arrayHelpers.push({ url: '', network: undefined });
                                        }}>
                                        {'Agregar red social'}
                                      </Button>
                                    )}
                                </Form.Item>
                              </div>
                            ))}
                          </>
                        ) : (
                          <Form.Item {...buttonsLayout}>
                            <Button
                              type='primary'
                              icon={<PlusCircleOutlined />}
                              onClick={() => {
                                arrayHelpers.push({ url: '', network: undefined });
                              }}>
                              {'Agregar red social'}
                            </Button>
                          </Form.Item>
                        );
                      }}
                    />
                    <FieldArray
                      name='advisor'
                      render={(arrayHelpers) => {
                        return !!values.advisor && values.advisor.length > 0 ? (
                          <>
                            {values.advisor.map((_sn, advisorIndex) => (
                              <div key={`advisor-item-${advisorIndex}`}>
                                <Field
                                  name={`advisor[${advisorIndex}].name`}
                                  component={InputField}
                                  label={`Nombre del contacto advisor ${advisorIndex + 1}`}
                                  placeholder='Nombre del contacto advisor'
                                />
                                <Field
                                  name={`advisor[${advisorIndex}].cargo`}
                                  component={InputField}
                                  label={`Cargo del advisor ${advisorIndex + 1}`}
                                  placeholder='Cargo advisor'
                                />
                                <Field
                                  name={`advisor[${advisorIndex}].codPais`}
                                  component={InputField}
                                  label={`Codigo del pais advisor ${advisorIndex + 1}`}
                                  placeholder='Ingrese el codigo internacional de su pais sin agregar (+)'
                                />
                                <Field
                                  name={`advisor[${advisorIndex}].number`}
                                  component={InputField}
                                  label={`Número de contacto advisor ${advisorIndex + 1}`}
                                  placeholder='Número de contacto advisor'
                                />
                                <Field
                                  name={`advisor[${advisorIndex}].email`}
                                  component={InputField}
                                  label={`Email de contacto advisor ${advisorIndex + 1}`}
                                  placeholder='Email de contacto advisor'
                                />
                                <ImageField
                                  name={`advisor[${advisorIndex}].image`}
                                  label={`Imagen del contacto advisor ${advisorIndex + 1}`}
                                  placeholder='Url imagen'
                                  maxLength={URL_MAX_LENGTH}
                                />
                                <Form.Item {...buttonsLayout}>
                                  {values.advisor.length > 0 && (
                                    <Button
                                      type='danger'
                                      icon={<DeleteOutlined />}
                                      onClick={() => {
                                        arrayHelpers.remove(advisorIndex);
                                      }}
                                      style={{ marginRight: '20px' }}>
                                      {'Eliminar'}
                                    </Button>
                                  )}
                                  {/*values.advisor.length < ADVISOR_LIMIT && */}
                                  {advisorIndex === values.advisor.length - 1 && (
                                    <Button
                                      type='primary'
                                      icon={<PlusCircleOutlined />}
                                      onClick={() => {
                                        arrayHelpers.push({
                                          name: '',
                                          image: '',
                                          codPais: '',
                                          number: '',
                                          email: '',
                                          cargo: '',
                                        });
                                      }}>
                                      {'Agregar advisor'}
                                    </Button>
                                  )}
                                </Form.Item>
                              </div>
                            ))}
                          </>
                        ) : (
                          <Form.Item {...buttonsLayout}>
                            <Button
                              type='primary'
                              icon={<PlusCircleOutlined />}
                              onClick={() => {
                                arrayHelpers.push({
                                  name: '',
                                  image: '',
                                  codPais: '',
                                  number: '',
                                  email: '',
                                  cargo: '',
                                });
                              }}>
                              {'Agregar advisor'}
                            </Button>
                          </Form.Item>
                        );
                      }}
                    />

                    <FieldArray
                      name='gallery'
                      render={(arrayHelpers) => {
                        return !!values.gallery && values.gallery.length > 0 ? (
                          <>
                            {values.gallery.map((_sn, galleryIndex) => (
                              <div key={`social-network-item-${galleryIndex}`}>
                                <ImageField
                                  name={`gallery[${galleryIndex}].image`}
                                  label={`Imagen galería ${galleryIndex + 1}`}
                                />

                                <Form.Item {...buttonsLayout}>
                                  {values.gallery.length > 1 && (
                                    <Button
                                      type='danger'
                                      icon={<DeleteOutlined />}
                                      onClick={() => {
                                        arrayHelpers.remove(galleryIndex);
                                      }}
                                      style={{ marginRight: '20px' }}>
                                      {'Eliminar'}
                                    </Button>
                                  )}
                                  {values.gallery.length < GALLERY_LIMIT && galleryIndex === values.gallery.length - 1 && (
                                    <Button
                                      type='primary'
                                      icon={<PlusCircleOutlined />}
                                      onClick={() => {
                                        arrayHelpers.push({ image: '' });
                                      }}>
                                      {'Agregar imagen'}
                                    </Button>
                                  )}
                                </Form.Item>
                              </div>
                            ))}
                          </>
                        ) : (
                          <Form.Item {...buttonsLayout}>
                            <Button
                              type='primary'
                              icon={<PlusCircleOutlined />}
                              onClick={() => {
                                arrayHelpers.push({ image: '' });
                              }}>
                              {'Agregar imagen'}
                            </Button>
                          </Form.Item>
                        );
                      }}
                    />

                    <Field name='visible' component={SwitchField} label='Visible' />

                    <Form.Item {...buttonsLayout}>
                      <Link to={`/event/${event._id}/empresas`}>
                        <Button
                          disabled={isSubmitting}
                          loading={isSubmitting}
                          icon={<CaretLeftOutlined />}
                          style={{ marginRight: '20px' }}>
                          {'Volver'}
                        </Button>
                      </Link>
                      <Button type='primary' htmlType='submit' disabled={isSubmitting} loading={isSubmitting}>
                        {'Guardar'}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default CrearEditarEmpresa;
