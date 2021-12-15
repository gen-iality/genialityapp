import { CloseCircleFilled } from '@ant-design/icons';
import { Modal, PageHeader, Space, Grid, Typography } from 'antd';
import React, { useContext } from 'react';
import FormComponent from '../events/registrationForm/form';
import withContext from '../../Context/withContext';
import { HelperContext } from '../../Context/HelperContext';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
const { useBreakpoint } = Grid;

const stylePaddingDesktop = {
  paddingLeft: '25px',
  paddingRight: '25px',
};
const stylePaddingMobile = {
  paddingLeft: '10px',
  paddingRight: '10px',
};

const ModalPermission = (props) => {
  let { handleChangeTypeModal, typeModal } = useContext(HelperContext);
  const screens = useBreakpoint();
  const intl = useIntl();
  const textoTitle =
    typeModal == 'registerForTheEvent'
      ? intl.formatMessage({ id: 'modal.title.registerevent', defaultMessage: 'Registrarme al evento' })
      : typeModal == 'update'
      ? intl.formatMessage({ id: 'modal.title.update', defaultMessage: 'Actualizar mis datos' })
      : '';
  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
      centered
      footer={null}
      zIndex={1000}
      closable={false}
      visible={typeModal == 'register' || typeModal == 'update' || typeModal === 'registerForTheEvent'}>
      <PageHeader
        style={screens.xs ? stylePaddingMobile : stylePaddingDesktop}
        backIcon={
          <Link onClick={() => handleChangeTypeModal(null)} to={`/landing/${props.cEvent.value?._id}/`}>
            <Space>
              <CloseCircleFilled style={{ color: '#6B7283', fontSize: '20px' }} />
              <span style={{ fontSize: '16px', color: '#6B7283' }}>
                {intl.formatMessage({ id: 'modal.permissio.close', defaultMessage: 'Cerrar' })}
              </span>
            </Space>
          </Link>
        }
        onBack={() => null}
        title=' ' // NO eliminar el espacio en blanco
      />
      <div>
        <Typography.Title level={4} type='secondary'>
          {textoTitle}
        </Typography.Title>
      </div>
      <div
        // className='asistente-list'
        style={{
          height: '70vh',
          overflowY: 'hidden',
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingTop: '8px',
          paddingBottom: '8px',
        }}>
        <FormComponent />
      </div>
    </Modal>
  );
};

export default withContext(ModalPermission);
