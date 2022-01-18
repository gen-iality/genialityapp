import React, { useState } from 'react';
import { Col, Modal, Row, Transfer, Typography, Grid } from 'antd';
import { FastForwardOutlined } from '@ant-design/icons';

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

const ModalListRequestsParticipate = () => {
  const screens = useBreakpoint();
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const onChange = (nextTargetKeys, direction, moveKeys) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
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
  return (
    <Modal
      width={700}
      // bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      closable={true}
      visible={true}
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
            dataSource={mockData}
            titles={['Solicitudes', 'Aprobadas']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
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
