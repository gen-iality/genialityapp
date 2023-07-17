import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { Form, Col, Card } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

import { IDynamicFieldData } from '../../dynamic-fields/types';

import { FormInstance } from 'antd/es/form/Form';
import DynamicForm from './DinamicFormUserOrganization/DinamicFormUserOrganization';

const centerStyle: any = {
  margin: '0 auto',
  textAlign: 'center',
};

const textLeftStyle: any = {
  textAlign: 'left',
  width: '100%',
  padding: '10px',
};

type FormValuesType = any;

interface Props {
  //   basicDataUser: any;
  organization: any;
  onProperyChange?: (propertyName: string, propertyValue: any) => void;
  otherFields?: any[]; //todo: colocar el tipo IDynamicFieldData
  onSubmit?: (values: any) => void;
  form?: FormInstance;
  noSubmitButton?: boolean;
  onLastStep: () => void;
}

const OrganizationPropertiesForm = (props: Props) => {
  const { noSubmitButton, otherFields = [] } = props;

  const [newForm] = Form.useForm<FormValuesType>();

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [form, setForm] = useState<FormInstance | undefined>(props.form);
  const [dynamicFields] = useState<any[]>(props.organization.user_properties || otherFields); //todo: tipo IDynamicFieldData
  const [initialValues, setInitialValues] = useState<FormValuesType>({});

  const onFinish = useCallback((values: FormValuesType) => {
    setIsSubmiting(true);
    props.onSubmit && props.onSubmit(values);
    setIsSubmiting(false);
  }, []);

  const onValueChange = useCallback(
    (changedValues: any, values: FormValuesType) => {
      // TODO: validate empty fields here
      for (const key in changedValues) {
        const value: any = changedValues[key];
        props.onProperyChange && props.onProperyChange(key, value);
      }
      // TODO: update field visibility
    },
    [props.onProperyChange]
  );

  /* useEffect(() => {
    setInitialValues((previous: any) => ({
      ...previous,
      ...(props.basicDataUser || {}),
      ID: props.basicDataUser.password, 
    }));
  }, [props.basicDataUser]); */

  useEffect(() => {
    if (form) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  useEffect(() => {
    if (props.form) {
      setForm(props.form);
    } else {
      setForm(newForm);
    }
  }, [props.form, newForm]);

  return (
    <Col xs={24} sm={22} md={24} lg={24} xl={24} style={centerStyle}>
      {isSubmiting ? (
        <LoadingOutlined style={{ fontSize: '50px' }} />
      ) : (
        form && (
          <Card bordered={false} bodyStyle={textLeftStyle}>
            <DynamicForm
              noSubmitButton={noSubmitButton}
              form={form}
              dynamicFields={dynamicFields}
              initialValues={initialValues}
              onFinish={onFinish}
              onValueChange={onValueChange}
            />
          </Card>
        )
      )}
    </Col>
  );
};

export default OrganizationPropertiesForm;
