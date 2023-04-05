import { Link, useHistory } from 'react-router-dom'
import { Tooltip, Typography, Row, Col, Button } from 'antd'
import { PlusCircleOutlined, SaveOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { FunctionComponent, MouseEventHandler, ReactElement } from 'react'

const { Title, Text } = Typography

interface HeaderProps {
  title: string | ReactElement,
  titleTooltip?: string,
  addUrl?: string
  addFn?: MouseEventHandler<HTMLElement>,
  edit?: string,
  remove?: MouseEventHandler<HTMLElement>,
  save?: boolean,
  saveMethod?: MouseEventHandler<HTMLElement>,
  saveName?: string,
  back?: boolean,
  form?: boolean,
  extra?: any,
  description?: string | ReactElement,
  loadingSave?: boolean,
  saveNameIcon?: boolean,
  customBack?: string,
}

const Header: FunctionComponent<HeaderProps> = (props) => {
  const history = useHistory()
  const { eventIsActive } = useHelper()
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
    /* listLenght,
    messageHeaderAlert, */
  } = props

  return (
    <>
      <Title level={4}>
        {(back || customBack) && (
          <Tooltip placement="bottomLeft" title="Atrás">
            <ArrowLeftOutlined
              id="goBack"
              onClick={() => (customBack ? history.push(customBack) : history.goBack())}
              style={{ marginRight: '10px' }}
            />
          </Tooltip>
        )}
        <Tooltip placement="bottomLeft" title={titleTooltip}>
          {title}
        </Tooltip>
      </Title>
      {!eventIsActive && window.location.toString().includes('eventadmin') && (
        <Text style={{ color: 'red' }}>
          Tu curso se encuentra bloqueado
        </Text>
      )}
      {description && <p>{description}</p>}
      <Row wrap justify="end" gutter={[8, 8]} /* style={ form ? {position: 'fixed', right: 0, zIndex: 1} : ''} */>
        {extra && <Col><div>{extra}</div></Col>}
        {(addUrl || addFn) && <Col>
          {addUrl && (
            <Link to={addUrl}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                size="middle"
                disabled={!eventIsActive && window.location.toString().includes('eventadmin')}
              >
                Agregar
              </Button>
            </Link>
          )}
          {addFn && (
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              size="middle"
              onClick={addFn}
              disabled={!eventIsActive && window.location.toString().includes('eventadmin')}
            >
              Agregar
            </Button>
          )}
        </Col>}
        {save && (
          <Col>
            <Button
              onClick={saveMethod}
              type="primary"
              icon={saveNameIcon && !edit ? <PlusCircleOutlined /> : <SaveOutlined />} //Condición momentanea hasta que se le coloque otra funcionalidad ó texto ó sea necesario otro icono
              size="middle"
              htmlType={form ? 'submit' : 'button'}
              loading={loadingSave}
              disabled={!eventIsActive && window.location.toString().includes('eventadmin') ? true : loadingSave}
            >
              {saveName ? saveName : 'Guardar'}
            </Button>
          </Col>
        )}
        {edit && (
          <Col>          
            <Button
              id="removeHeader"
              onClick={remove}
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={!eventIsActive && window.location.toString().includes('eventadmin')}
            >
              Eliminar
            </Button>
          </Col>
        )}
      </Row>
    </>
  )
}

export default Header
