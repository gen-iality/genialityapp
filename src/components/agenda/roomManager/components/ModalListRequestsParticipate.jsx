import { useContext, useEffect, useState } from 'react';
import { Col, Modal, Row, Transfer, Typography, Grid } from 'antd';
import AgendaContext from '@context/AgendaContext';

const { useBreakpoint } = Grid;

const mockData = [];
for (let i = 0; i < 5; i++) {
  mockData.push({
    key: i.toString(),
    title: `Solicitud para participar ${i + 1}`,
    description: `description of content${i + 1}`,
  });
}

const ModalListRequestsParticipate = ({ handleModal, visible, refActivity }) => {
  const screens = useBreakpoint();
  const [targetKeys, setTargetKeys] = useState([]);
  const [dataRequest, setDataRequest] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const { requestList, removeRequest, approvedOrRejectedRequest } = useContext(AgendaContext);
  const onChange = async (nextTargetKeys, direction, moveKeys) => {
    //ELIMINAMOS LA SOLICITUD
    if (direction === 'left') {
      await Promise.all(
        moveKeys?.map(async (key) => {
          await removeRequest(`${refActivity}`, key);
        })
      );
    }
    //APPROBAMOS LA SOLICITUD
    if (direction === 'right') {
      await Promise.all(
        moveKeys?.map(async (key) => {
          await approvedOrRejectedRequest(`${refActivity}`, key, true);
        })
      );
    }
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
    if (requestList) {
      const approvedRequest = requestList.filter((request) => request.active).map((item) => item.key);
      setDataRequest(requestList);
      setTargetKeys(approvedRequest);
    }
  }, [requestList]);
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
