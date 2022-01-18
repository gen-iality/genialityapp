import React, { useContext, useEffect, useState } from 'react';
import { Col, Modal, Row, Transfer, Typography, Grid } from 'antd';
import { FastForwardOutlined } from '@ant-design/icons';
import AgendaContext from 'Context/AgendaContext';

const { useBreakpoint } = Grid;

const mockData = [];
for (let i = 0; i < 5; i++) {
  mockData.push({
    key: i.toString(),
    title: `Solicitud para participar ${i + 1}`,
    description: `description of content${i + 1}`,
  });
}

const initialTargetKeys = mockData.filter((item) => +item.key > 10).map((item) => item.key);

const ModalListRequestsParticipate = ({ handleModal, visible }) => {
  const screens = useBreakpoint();
  const [targetKeys, setTargetKeys] = useState([]);
  const [dataRequest, setDataRequest] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const { request } = useContext(AgendaContext);
  const onChange = (nextTargetKeys, direction, moveKeys) => {
    if (direction === 'left') {
      console.log('A ELIMINAR');
    }
    console.log('DIRECTION==>', direction === 'left', nextTargetKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };
  useEffect(() => {
    if (request) {
      setDataRequest(request);
      setTargetKeys(request);
    }
  }, [request]);
  return (
    <Modal
      width={700}
      // bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      closable={true}
      onCancel={() => handleModal(false)}
      visible={visible}
      footer={null}>
      <Row gutter={[8, 8]}>
        <Col>
          <Typography.Title level={4}>Solicitudes para participar en la transmisión</Typography.Title>
        </Col>
        <Col>
          <Transfer
            pagination={{ pageSize: 7 }}
            showSelectAll={false}
            oneWay
            listStyle={{
              borderRadius: '5px',
              width: screens.xs ? 135 : 300,
              height: screens.xs ? 225 : 300,
            }}
            dataSource={dataRequest}
            titles={['Solicitudes', 'Aprobadas']}
            selectedKeys={selectedKeys}
            targetKeys={targetKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            onScroll={onScroll}
            render={(item) => item.title}
          />
        </Col>
        <Col>
          <Typography.Paragraph type='secondary'>
            Recuerde que al aprobar una solicitud, usted está dando acceso a esa persona a participar dentro de la
            transmisión. Puede eliminar el acceso en cualquier momento.
          </Typography.Paragraph>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalListRequestsParticipate;
