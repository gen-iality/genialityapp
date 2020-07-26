import { CaretLeftOutlined } from '@ant-design/icons'
import { Button, Col, notification, Row, Typography } from 'antd'
import { Field, Form, Formik } from 'formik'
import { apply } from 'ramda'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import InputField from '../formFields/InputField'
import SelectField from '../formFields/SelectField'
import SwitchField from '../formFields/SwitchField'
import Loading from '../loaders/loading'
import useGetCompanyInitialValues from './customHooks/useGetCompanyInitialValues'
import useGetEventCompaniesStandTypesOptions from './customHooks/useGetEventCompaniesStandTypesOptions'
import { createEventCompany, updateEventCompany } from './services'

const { Title } = Typography

const validationSchema = yup.object().shape({
  name: yup.string().required().max(100),
  stand_type: yup.string().required(),
  visible: yup.boolean().required(),
})

function CrearEditarEmpresa({ event, match, history }) {
  const { companyId } = match.params
  const [standTypesOptions, loadingStandTypes] = useGetEventCompaniesStandTypesOptions(event._id)
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
          {({ isSubmitting }) => {
            return (
              <Form>
                <Row justify="center">
                  <Col xs={20}>
                    <Field
                      name="name"
                      component={InputField}
                      label="Nombre empresa"
                      placeholder="Nombre empresa"
                      required={true}
                    />

                    <Field
                      name="stand_type"
                      component={SelectField}
                      label="Tipo de stand"
                      placeholder="Tipo de stand"
                      required={true}
                      options={standTypesOptions}
                    />

                    <Field
                      name="visible"
                      component={SwitchField}
                      label="Visible"
                    />

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
                  </Col>
                </Row>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default CrearEditarEmpresa
