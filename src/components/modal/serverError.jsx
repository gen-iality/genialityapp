import { useState } from 'react';
import { Modal } from 'antd';

const ErrorServe = (props) => {
  const { errorData } = props;
  const [modal, setModal] = useState(true);

  const closeModal = () => {
    setModal(false);
  };

  return (
    <Modal title={`ERROR: ${errorData.status}`} onCancel={() => closeModal()} closable visible={modal}>
      <p>{typeof errorData.message === 'object' ? JSON.stringify(errorData.message) : errorData.message}</p>
    </Modal>
  );
};

export default ErrorServe;
