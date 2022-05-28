import { Link, useHistory } from 'react-router-dom';
import { Tooltip, Typography, Row, Col, Button } from 'antd';
import { PlusCircleOutlined, SaveOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { UseCurrentUser } from '../context/userContext';

const { Title } = Typography;

const Header = (props) => {
  const history = useHistory();
  let cUser = UseCurrentUser();
  const {
    title, //titulo del encabezado
    titleTooltip, //tooltip para el encabezado
    addUrl, //link para ir a la vista de agregar
    addFn, //link para ir a la vista de agregar
    edit, //id del elemento a editar
    remove, //método para eliminar
    save, //boolean, para que aparezca el botón de guardar
    saveMethod, //viene el método para guardar
    saveName,
    back, //boolean, permite aparecer el icono para volver atrás
    form, //si viene, es para poder saber sí el botón de guardar colocarlo como "submit"
    extra, //código adicional de alguna acción fuera de la estructura en el header
    description,
    loadingSave,
    saveNameIcon,
    customBack,
  } = props;

  return (
    <>
      <Title level={4}>
        {(back || customBack) && (
          <Tooltip placement='bottomLeft' title={'Atrás'}>
            <ArrowLeftOutlined
              id='goBack'
              onClick={() => (customBack ? history.push(customBack) : history.goBack())}
              style={{ marginRight: '10px' }}
            />
          </Tooltip>
        )}
        <Tooltip placement='bottomLeft' title={titleTooltip}>
          {title}
        </Tooltip>
      </Title>
      {description && <p>{description}</p>}
      <Row wrap justify='end' gutter={[8, 8]} /* style={ form ? {position: 'fixed', right: 0, zIndex: 1} : ''} */>
        <Col>{extra && <div>{extra}</div>}</Col>
        <Col>
          {addUrl && (
            <Link to={addUrl}>
              <Button type='primary' icon={<PlusCircleOutlined />} size='middle'>
                {'Agregar'}
              </Button>
            </Link>
          )}
          {addFn && (
            <Button type='primary' icon={<PlusCircleOutlined />} size='middle' onClick={addFn}>
              {'Agregar'}
            </Button>
          )}
        </Col>
        <Col>
          {save && (
            <Button
              onClick={saveMethod}
              type={'primary'}
              icon={saveNameIcon && !edit ? <PlusCircleOutlined /> : <SaveOutlined />} //Condición momentanea hasta que se le coloque otra funcionalidad ó texto ó sea necesario otro icono
              size='middle'
              htmlType={form ? 'submit' : 'button'}
              loading={loadingSave}
              disabled={loadingSave}>
              {saveName ? saveName : 'Guardar'}
            </Button>
          )}
        </Col>
        <Col>
          {edit && (
            <Button id='removeHeader' onClick={remove} type='link' danger icon={<DeleteOutlined />}>
              {'Eliminar'}
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
};

export default Header;
