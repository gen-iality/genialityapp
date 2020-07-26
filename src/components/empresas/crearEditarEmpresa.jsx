import { CaretLeftOutlined } from '@ant-design/icons'
import { Button, Input, notification, Select, Switch, Typography } from 'antd'
import { ErrorMessage, Form, Formik } from 'formik'
import { apply } from 'ramda'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import Loading from '../loaders/loading'
import useGetCompanyInitialValues from './customHooks/useGetCompanyInitialValues'
import useGetEventCompaniesStandTypes from './customHooks/useGetEventCompaniesStandTypes'
import { createEventCompany, updateEventCompany } from './services'

const { Option } = Select
const { Title } = Typography

const fieldItemStyle = { marginBottom: '30px' }
const validationSchema = yup.object().shape({
  company_name: yup.string().required().max(100),
  stand_type: yup.string().required(),
  enabled: yup.boolean().required(),
})

function standTypesOptionsMapper(standType, index) {
  const key = `sto-${standType}-${index}`

  return (
    <Option key={key} value={standType}>{standType}</Option>
  )
}

function CrearEditarEmpresa({ event, match, history }) {
  const { companyId } = match.params
  const [standTypes, loadingStandTypes] = useGetEventCompaniesStandTypes(event._id)
  const [initialValues, loadingInitialValues] = useGetCompanyInitialValues(event._id, companyId)

  const handleSubmit = useCallback((values, { setSubmitting }) => {
    const isNewRecord = !companyId
    const createOrEdit = isNewRecord ? createEventCompany : updateEventCompany
    const paramsArray = isNewRecord ? [event._id, values] : [event._id, companyId, values]
    const errorObject = {
      message: 'Error',
      description: isNewRecord
        ? 'Ocurrió un error creando la empresa'
        : 'Ocurrió un error actualizando la empresa'
    }

    setSubmitting(true)
    apply(createOrEdit, paramsArray)
      .then(() => history.push(`/event/${event._id}/empresas`))
      .catch((error) => {
        console.error(error)
        notification.error(errorObject)
        setSubmitting(false)
      })
  }, [history, event._id, companyId])

  if (loadingStandTypes || loadingInitialValues) {
    return <Loading />
  }

  return (
    <div>
      <Title level={4}>{!companyId ? 'Crear empresa' : 'Editar empresa'}</Title>
      <div>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, setFieldTouched }) => {
            return (
              <Form>
                <div style={{ width: '600px', margin: '0 auto' }}>
                  <div style={fieldItemStyle}>
                    <Input
                      placeholder={'Nombre empresa'}
                      value={values.company_name}
                      onChange={(evt) => setFieldValue('company_name', evt.target.value)}
                      onBlur={() => setFieldTouched('company_name')}
                    />
                    <ErrorMessage name="company_name" />
                  </div>

                  <div style={fieldItemStyle}>
                    <Select
                      placeholder={'Tipo de stand'}
                      value={values.stand_type}
                      onChange={(newValue) => setFieldValue('stand_type', newValue)}
                      onBlur={() => setFieldTouched('stand_type')}
                      style={{ width: '100%' }}
                    >
                      {standTypes.map(standTypesOptionsMapper)}
                    </Select>
                    <ErrorMessage name="stand_type" />
                  </div>

                  <div style={fieldItemStyle}>
                    <Switch
                      checked={values.enabled}
                      onChange={(newValue) => setFieldValue('enabled', newValue)}
                      style={{ marginRight: '10px' }}
                    />
                    {'Activar'}
                    <ErrorMessage name="enabled" />
                  </div>

                  <div>
                    <Link to={`/event/${event._id}/empresas`}>
                      <Button
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        icon={<CaretLeftOutlined />}
                        style={{ marginRight: '20px' }}
                      >
                        {'Volver'}
                      </Button>
                    </Link>
                    <Button type="primary" htmlType="submit" disabled={isSubmitting} loading={isSubmitting}>
                      {'Guardar'}
                    </Button>
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default CrearEditarEmpresa
