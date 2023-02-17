/**
 * This module define a component of form that enables edit the organization
 * properties data of an specify organization user.
 */

// React stuffs
import * as React from 'react'
import {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react'

// Ant Design stuffs
import {
  Button,
  Form,
  Col,
  Row,
  Card,
  Typography,
} from 'antd'

// API methods
import { UsersApi, TicketsApi, EventsApi, EventFieldsApi } from '@helpers/request'

const {
  Text,
  Paragraph,
  Title,
} = Typography


interface IOrganizationPropertiesFormProps {
  basicDataUser: object,
  orgMember: any,
}

const OrganizationPropertiesForm: React.FunctionComponent<IOrganizationPropertiesFormProps> = (props) => {
  return (
    <></>
  );
};

export default OrganizationPropertiesForm
