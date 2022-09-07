import { Switch } from 'antd';
import { AccessTypeCardInterface } from '../interfaces/interfaces';
import AccountGroupIcon from '@2fd/ant-design-icons/lib/AccountGroup';
import ShieldAccountIcon from '@2fd/ant-design-icons/lib/ShieldAccount';
import BadgeAccountHorizontaIcon from '@2fd/ant-design-icons/lib/BadgeAccountHorizontal';
import IncognitoIcon from '@2fd/ant-design-icons/lib/Incognito';
import MessageIcon from '@2fd/ant-design-icons/lib/Message';
import MessageLockIcon from '@2fd/ant-design-icons/lib/MessageLock';
import DatabaseIcon from '@2fd/ant-design-icons/lib/Database';
import DatabaseOffIcon from '@2fd/ant-design-icons/lib/DatabaseOff';
import CardAccountDetailsStarIcon from '@2fd/ant-design-icons/lib/CardAccountDetailsStar';
import AccountKeyIcon from '@2fd/ant-design-icons/lib/AccountKey';

//evento publico con registro sin autenticación de usuario
// PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS

export const AccessTypeCardData: AccessTypeCardInterface[] = [
  {
    index: 'PUBLIC_EVENT_WITH_REGISTRATION',
    icon: <BadgeAccountHorizontaIcon />,
    title: 'Evento publico con registro',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    infoIcon: [<AccountKeyIcon />, <DatabaseIcon />, <MessageIcon />, <MessageLockIcon />],
    extra: (
      <>
        <h5>
          <b>Registro sin autenticación de usuario (Beta)</b>
        </h5>
        <Switch />
      </>
    ),
  },
  {
    index: 'UN_REGISTERED_PUBLIC_EVENT',
    icon: <AccountGroupIcon />,
    title: 'Evento publico sin registro',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    infoIcon: [<IncognitoIcon />, <DatabaseOffIcon />, <MessageIcon />],
  },
  {
    index: 'PRIVATE_EVENT',
    icon: <ShieldAccountIcon />,
    title: 'Evento privado por invitación',
    description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    infoIcon: [<CardAccountDetailsStarIcon />, <MessageIcon />, <MessageLockIcon />],
  },
];
