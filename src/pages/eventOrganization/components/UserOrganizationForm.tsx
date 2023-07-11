import React, { useEffect } from 'react';
import { IdcardOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Form, FormInstance, Input } from 'antd';
import { FormUserOrganization } from '../interface/organization.interface';
import { useIntl } from 'react-intl';
import { UseEventContext } from '@/context/eventContext';
import { eventWithCedula } from '@/helpers/helperEvent';
import { UploadImageWithEdition } from '@/components/upload/UploadImage';
import { UploadFile } from 'antd/lib/upload/interface';

interface Props {
  form: FormInstance<FormUserOrganization>;
  setimageFile: React.Dispatch<React.SetStateAction<UploadFile | undefined>>;
  filesSelected?: UploadFile | undefined;
}

export const UserOrganizationForm = ({ form, setimageFile, filesSelected }: Props) => {
  const intl = useIntl();

  const cEvent = UseEventContext();

  const ruleEmail: any[] = [
    {
      type: 'email',
      message: intl.formatMessage({
        id: 'register.rule.email.message',
        defaultMessage: 'Ingrese un email valido',
      }),
    },
    {
      required: true,
      message: intl.formatMessage({
        id: 'register.rule.email.message2',
        defaultMessage: 'Ingrese un email para su cuenta en Evius',
      }),
    },
  ];

  const rulePassword: any[] = [
    {
      required: true,
      message: intl.formatMessage({
        id: 'register.rule.password.message',
        defaultMessage: 'Ingrese una contraseña para su cuenta en Evius',
      }),
    },
    {
      type: 'string',
      min: 6,
      max: 18,
      message: intl.formatMessage({
        id: 'register.rule.password.message2',
        defaultMessage: 'La contraseña debe tener entre 6 a 18 caracteres',
      }),
    },
  ];

  const ruleCedula: any[] = [
    { required: true, message: 'Ingrese una cedula para su cuenta en Evius' },
    {
      type: 'string',
      min: 8,
      max: 12,
      message: 'La cedula debe tener entre 6 a 18 caracteres',
    },
  ];
  const ruleName = [
    {
      required: true,
      message: intl.formatMessage({
        id: 'register.rule.name.message',
        defaultMessage: 'Ingrese su nombre completo para su cuenta en Evius',
      }),
    },
  ];
  return (
    <div>
      <div style={{ marginTop: '30px' }}>
        <Form
          form={form}
          autoComplete='on'
          layout='vertical'
        >
          <UploadImageWithEdition
            onSetFile={(e) => {
              setimageFile(e);
            }}
            fileSelected={filesSelected}
          />
          <Form.Item
            label={'Correo electrónico'}
            name='email'
            hasFeedback
            style={{ marginBottom: '10px', textAlign: 'left' }}
            rules={ruleEmail}>
            <Input
              type='email'
              size='large'
              placeholder='micorreo@ejemplo.com'
              prefix={<MailOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: eventWithCedula(cEvent.value).isArkmed ? 'modal.label.cedula' : 'modal.label.password',
              defaultMessage: eventWithCedula(cEvent.value).isArkmed ? 'Cedula' : 'Contraseña',
            })}
            name='password'
            hasFeedback
            style={{ marginBottom: '10px', textAlign: 'left' }}
            rules={eventWithCedula(cEvent.value).isArkmed ? ruleCedula : rulePassword}>
            <Input.Password
              type='number'
              size='large'
              // placeholder="Cedula del medico ó especialista"
              placeholder={eventWithCedula(cEvent.value).isArkmed ? 'Cedula ó numero de identificación' : 'Contraseña'}
              prefix={<LockOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
            />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'modal.label.name',
              defaultMessage: 'Nombre',
            })}
            name='names'
            hasFeedback
            style={{ marginBottom: '10px', textAlign: 'left' }}
            rules={ruleName}>
            <Input
              type='text'
              size='large'
              placeholder={intl.formatMessage({
                id: 'modal.label.name',
                defaultMessage: 'Nombre',
              })}
              prefix={<UserOutlined style={{ fontSize: '24px', color: '#c4c4c4' }} />}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
