import { CloseCircleFilled } from '@ant-design/icons';
import { Modal, PageHeader, Space, Grid, Typography, Button } from 'antd';
import React, { useContext } from 'react';
import FormComponent from '../events/registrationForm/form';
import withContext from '../../context/withContext';
import { HelperContext } from '../../context/HelperContext';

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

  return (
    <Modal
      bodyStyle={{ textAlign: 'center', paddingRight: '10px', paddingLeft: '10px' }}
      centered
      footer={null}
      zIndex={1000}
      closable={true}
      onCancel={() => handleChangeTypeModal(null)}
      visible={typeModal == 'register' || typeModal == 'update' || typeModal === 'registerForTheEvent'}>
      <div
        // className='asistente-list'
        style={{
          // height: '70vh',
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
