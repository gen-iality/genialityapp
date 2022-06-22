import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Redirect, withRouter, Link, useLocation, useHistory } from 'react-router-dom';
import Moment from 'moment';
import {
  Tabs,
  Row,
  Col,
  Checkbox,
  Space,
  Typography,
  Button,
  Form,
  Input,
  Switch,
  Empty,
  Card,
  Image,
  Modal,
  TimePicker,
} from 'antd';
import Loading from '../profile/loading';
import Header from '../../antdComponents/Header';
import AgendaContext from '../../context/AgendaContext';
import { RouterPrompt } from '../../antdComponents/RoutePrompt';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

// TODO: put this type in some site
interface EventType {
  _id: string,
  name: string,
};

interface LocationStateType {
  edit: string | null,
};

export interface AgendaEditProps {
  event: EventType,
  matchUrl: string,
};
  
function AgendaEdit(props: AgendaEditProps) {
  const [name, setName] = useState('');
  const [activityEdit, setActivityEdit] = useState<null | string>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const [showPendingChangesModal, setShowPendingChangesModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const location = useLocation<LocationStateType>();
  const history = useHistory();

  const agendaContext = useContext(AgendaContext);

  const submit = (changePathWithoutSaving: boolean) => {}
  const remove = () => {}
  const handleChange = (e) => { /** Core here */ }

  if (!location.state || shouldRedirect) return <Redirect to={props.matchUrl} />;

  return (
    <>
    <Form onFinish={() => submit(true)} {...formLayout}>
      <RouterPrompt
        when={showPendingChangesModal}
        title='Tienes cambios sin guardar.'
        description='¿Qué deseas hacer?'
        okText='No guardar'
        okSaveText='Guardar'
        cancelText='Cancelar'
        onOK={() => true}
        onOKSave={submit}
        onCancel={() => false}
        form={false}
        save
      />

      <Header
        title={`Actividad - ${name}`}
        back
        customBack={props.matchUrl}
        save
        form
        remove={remove}
        saveName={location.state.edit || activityEdit ? '' : 'Crear'}
        saveNameIcon
        edit={location.state.edit || activityEdit}
        extra={
          isEditing && (
            <Form.Item label={'Publicar'} labelCol={{ span: 14 }}>
              <Switch
                checkedChildren='Sí'
                unCheckedChildren='No'
                name={'isPublished'}
                checked={agendaContext.isPublished}
                onChange={(e) => handleChange(e, 'isPublished')}
              />
            </Form.Item>
          )
        }
      />

      {isLoading ? <Loading /> : (
        <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
          {/* All core here */}
        </Tabs>
      )}
    </Form>
    </>
  );
}

export default withRouter(AgendaEdit);