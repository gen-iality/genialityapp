import { ReactNode } from 'react';

import { InputNumber, Select, Space, Switch, Tooltip, Typography } from 'antd';
import { AccessTypeCardInterface, textTooltipType, iconTooltipType, extraProperties } from '../interfaces/interfaces';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import ShieldAccountIcon from '@2fd/ant-design-icons/lib/ShieldAccount';
import AccountTieIcon from '@2fd/ant-design-icons/lib/AccountTie';
import IncognitoIcon from '@2fd/ant-design-icons/lib/Incognito';
import MessageIcon from '@2fd/ant-design-icons/lib/Message';
import MessageLockIcon from '@2fd/ant-design-icons/lib/MessageLock';
import DatabaseIcon from '@2fd/ant-design-icons/lib/Database';
import DatabaseOffIcon from '@2fd/ant-design-icons/lib/DatabaseOff';
import CardAccountDetailsStarIcon from '@2fd/ant-design-icons/lib/CardAccountDetailsStar';
import AccountKeyIcon from '@2fd/ant-design-icons/lib/AccountKey';
import CashMultipleIcon from '@2fd/ant-design-icons/lib/CashMultiple';
import CashCheckIcon from '@2fd/ant-design-icons/lib/CashCheck';

//evento publico con registro sin autenticación de usuario
// PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS
const iconWithTooltip = (text: textTooltipType, icon: iconTooltipType) => {
  return <Tooltip title={text}>{icon}</Tooltip>;
};

export const AccessTypeCardData: AccessTypeCardInterface[] = [
  {
    index: 'PUBLIC_EVENT_WITH_REGISTRATION',
    icon: <AccountTieIcon />,
    title: 'Evento público con registro',
    description:
      'Tus asistentes deberán registrarse en la plataforma y en tu evento para poder ver el contenido. Si ya poseen una cuenta en Evius podrán iniciar sesión y continuar con la inscripción en tu evento ',
    infoIcon: [
      iconWithTooltip('Tiene autenticación de usuario', <AccountKeyIcon />),
      iconWithTooltip('Puede recolectar información de sus asistentes', <DatabaseIcon />),
      iconWithTooltip('Tiene chat público', <MessageIcon />),
      iconWithTooltip('Tiene chat privado', <MessageLockIcon />),
    ],
    extra: ({ callBackSelectedItem = () => {}, extraState = false }: extraProperties) => {
      return (
        <Space direction='vertical'>
          <Typography.Text strong style={{ fontWeight: '500' }}>
            Registrar sin autenticar usuario
          </Typography.Text>
          <Switch
            checked={extraState}
            // defaultChecked={extraState}
            checkedChildren={'Si'}
            unCheckedChildren={'No'}
            onChange={(state) => {
              const validateState = state
                ? 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS'
                : 'PUBLIC_EVENT_WITH_REGISTRATION';
              callBackSelectedItem(validateState);
            }}
          />
        </Space>
      );
    },
  },
  {
    index: 'UN_REGISTERED_PUBLIC_EVENT',
    icon: <AccountGroupIcon />,
    title: 'Evento público sin registro',
    description:
      'Tus asistentes podrán ingresa a tu evento sin ningún tipo de autenticación o registro. Solo se podrán habilitar los módulos informativos.',
    infoIcon: [
      iconWithTooltip('Los asistentes son anonimos', <IncognitoIcon />),
      iconWithTooltip('No puede recolectar información de sus asistentes', <DatabaseOffIcon />),
      iconWithTooltip('Tiene chat público', <MessageIcon />),
    ],
  },
  {
    index: 'PRIVATE_EVENT',
    icon: <ShieldAccountIcon />,
    title: 'Evento privado por invitación',
    description:
      'Solo pueden ingresar los asistentes que reciben una invitación a su correo electrónico, desde el cual podrán iniciar sesión de forma rápida con solo un clic.',
    infoIcon: [
      iconWithTooltip('Requiere invitación', <CardAccountDetailsStarIcon />),
      iconWithTooltip('Tiene chat público', <MessageIcon />),
      iconWithTooltip('Tiene chat privado', <MessageLockIcon />),
    ],
  },
  {
    index: 'PAYMENT_EVENT',
    icon: <CashCheckIcon />,
    title: 'Evento pago',
    description: 'Solo pueden ingresar los asistentes que cancelaron el monto asignado.',
    infoIcon: [
      iconWithTooltip('Requiere pago', <CashMultipleIcon />),
      iconWithTooltip('Tiene autenticación de usuario', <AccountKeyIcon />),
      iconWithTooltip('Puede recolectar información de sus asistentes', <DatabaseIcon />),
      iconWithTooltip('Tiene chat público', <MessageIcon />),
      iconWithTooltip('Tiene chat privado', <MessageLockIcon />),
    ],
    payment: true,
    extra: ({ changeValue = () => {}, valueInput = 0, payment = false , currency = 'COP', changeCurrency = () => {}}: extraProperties) => {
      return (
        <Space direction='vertical'>
          <Typography.Text strong style={{ fontWeight: '500' }}>
            Valor de la inscripción.
          </Typography.Text>
          <Space>
          <InputNumber
            min={ currency === 'COP' ? 2000 : 1}
            disabled={!payment}
            value={valueInput}
            onChange={(state) => {
              changeValue(state);
            }}
          />
          <Select
            value={currency}
            disabled={!payment}
            options={[
              { value: 'COP', label: 'COP' },
              { value: 'USD', label: 'USD' },
            ]}
            onChange={changeCurrency}
          />
          </Space>
          <Typography.Text style={{ marginTop: '8px' }}>
            El valor mínimo es de $2000 pesos o $1 dolar.
          </Typography.Text>
        </Space>
      );
    },
  },
];
