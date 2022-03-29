import { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { CategoriesAgendaApi, TypesAgendaApi } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { Row, Col, Form, Input, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import { DispatchMessageService } from '../../context/MessageService';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { confirm } = Modal;

const AgendaTypeCatCE = (props) => {
  const matchUrl = props.match.url;
  const eventID = props.event._id;
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const subject = matchUrl.split('/').slice(-1)[0];
  const apiURL =
    subject === 'addcategorias' || subject === 'editcategorias'
      ? CategoriesAgendaApi
      : TypesAgendaApi;
  const history = useHistory();
  let [categoryValues, setCategoryValues] = useState({});
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    if (locationState.edit) {
      getOne();
    }
  }, []);

  const getOne = async () => {
    const response = await apiURL.getOne(locationState.edit, eventID);
    setCategoryValues(response);
    setName(response.name);
    if (subject === 'addcategorias' || (subject === 'editcategorias' && response.color)) {
      setColor(response.color);
    }
  };

  const onSubmit = async () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se guarda la información..',
      action: 'show'
    });

    if (subject === 'addcategorias' || subject === 'editcategorias') {
      setCategoryValues({ name: name, color: color ? color : '#000000' });
    } else {
      setCategoryValues({ name: name });
    }
    try {
      if (Object.keys(categoryValues).length) {
        if (locationState.edit) {
          await apiURL.editOne(categoryValues, locationState.edit, eventID);
        } else {
          await apiURL.create(eventID, categoryValues);
        }

        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
        history.push(
          `${props.matchUrl}/${
            subject === 'addcategorias' || subject === 'editcategorias'
              ? 'categorias'
              : 'tipos'
          }`
        );
      }
    } catch (e) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: handleRequestError(e).message,
        action: 'show',
      });
    }
  };

  const handleChangeComplete = (color) => {
    setColor(color.hex);
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const onRemoveId = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (locationState.edit) {
      confirm({
        title: `¿Está seguro de eliminar la categoría?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              await apiURL.deleteOne(locationState.edit, eventID);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              history.push(
                `${props.matchUrl}/${
                  subject === 'addcategorias' || subject === 'editcategorias'
                    ? 'categorias'
                    : 'tipos'
                }`
              );
            } catch (e) {
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e).message,
                action: 'show',
              });
            }
          };
          onHandlerRemove();
        },
      });
    }
  };

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header
        title={`${
          subject === 'addcategorias' || subject === 'editcategorias'
            ? 'Categoría'
            : 'Tipo'
        }`}
        back
        save
        saveMethod={onSubmit}
        form
        remove={onRemoveId}
        edit={locationState.edit}
      />

      <Row justify="center" wrap gutter={12}>
        <Col>
          <Form.Item label={'Nombre'}>
            <Input
              name={'name'}
              placeholder={`Nombre ${
                subject === 'addcategorias' || subject === 'editcategorias'
                  ? 'de la categoría'
                  : 'del tipo'
              }`}
              value={name}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
          {subject === 'addcategorias' || subject === 'editcategorias' ? (
            <Form.Item label={'Color'}>
              <ChromePicker color={color} onChange={handleChangeComplete} />
            </Form.Item>
          ) : null}
        </Col>
      </Row>
    </Form>
  );
};

export default withRouter(AgendaTypeCatCE);
