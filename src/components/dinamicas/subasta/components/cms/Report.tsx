import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, Modal, Result, Row, Space, Statistic, Typography } from 'antd';
import { Bar } from 'react-chartjs-2';
import { useSatistic } from '../../hooks/useStatistic';
import { ReportProps } from '../../interfaces/auction.interface';
import { filterUserID, orgOfferds, priceChartValues } from '../../utils/utils';

import useProducts from '../../hooks/useProducts';
import { CloseCircleOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { resetProducts } from '../../services';
import { DispatchMessageService } from '@/context/MessageService';

export default function Report({ eventId, reload }: ReportProps) {
  const { offers,callOffers } = useSatistic(eventId, reload);
  const { products, refresh } = useProducts(eventId);
  const [modal, setModal] = useState<boolean>(false);
  const [permit, setPermit] = useState<boolean>(true);

  useEffect(() => {
    if (reload) refresh();
  }, [reload]);

  const { labels, values, participants } = orgOfferds(offers);
  const { labelsProducts, increases, startPrices } = priceChartValues(products);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Pujas',
        data: values,
        backgroundColor: '#6e58b1',
        borderColor: '#6e58b1',
        borderWidth: 2,
      },
      {
        label: 'Participantes únicos',
        data: participants,
        backgroundColor: '#332d62',
        borderColor: '#332d62',
        borderWidth: 2,
      },
    ],
  };
  const dataCre = {
    labels: labelsProducts,
    datasets: [
      {
        label: 'Precio inicial',
        data: startPrices,
        backgroundColor: '#6e58b1',
        borderColor: '#6e58b1',
        borderWidth: 2,
      },
      {
        label: 'Ganancias',
        data: increases,
        backgroundColor: '#332d62',
        borderColor: '#332d62',
        borderWidth: 2,
      },
    ],
  };
  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        stepSize: 1,
      },
    },
  };
  const optionsCar = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  const reset = async () => {
  const response =  await resetProducts(eventId)
  if(response){
    DispatchMessageService({ type: 'success', msj: 'Datos Reiniciados', action: 'show' });
    refresh()
    callOffers()
  }
  }
  return (
    <>
      <Row justify='end' style={{paddingBottom: '10px'}}>
        <Modal
          visible={modal}
          onCancel={() => setModal(false)}
          destroyOnClose={true}
          footer={[
            <Button key={'btnCancelar'} type='default' onClick={() => setModal(false)} icon={<CloseCircleOutlined />}>
              Cancelar
            </Button>,
            <Button
              key={'btnEliminar'}
              type='primary'
              danger
              onClick={() => {
                setModal(false);
                reset()
              }}
              disabled={permit}
              icon={<DeleteOutlined />}>
              Reiniciar
            </Button>,
          ]}>
          <Result
            status={'warning'}
            title={
              <Typography.Text strong type='warning' style={{ fontSize: 22 }}>
                ¿Quieres reiniciar los datos?
              </Typography.Text>
            }
            extra={
              <Input
                placeholder={'Reiniciar'}
                onChange={(e) => {
                  if (e.target.value === 'Reiniciar') {
                    setPermit(false);
                  } else {
                    setPermit(true);
                  }
                }}
              />
            }
            subTitle={
              <Space style={{ textAlign: 'justify' }} direction='vertical'>
                <Typography.Paragraph>
                  Esta acción borrará permanentemente los datos de las pujas así como el precio de los productos subastados.
                </Typography.Paragraph>

                <Typography.Paragraph>
                  Para confirmar que deseas eliminar los datos de la subasta, escribe la siguiente palabra: 
                  <Typography.Text strong type='danger'>
                   {' Reiniciar'}
                  </Typography.Text>
                </Typography.Paragraph>
              </Space>
            }
          />
        </Modal>
      {true && (
        <Button icon={<ReloadOutlined />} danger type='primary' onClick={() => setModal(true)}>
          Reiniciar subasta
        </Button>
      )}
      </Row>
      <Row gutter={[32, 32]}>
        <Col span={12}>
          <Card 
            hoverable 
            style={{/* minHeight: '55vh', */ cursor: 'default', borderRadius: '20px'}} 
            title={'Gráfica de pujas por producto'}
            headStyle={{border: 'none'}}
          >
            <Space direction='vertical' size={16}>
              {/*@ts-ignore */}
              <Bar data={data} options={options} /> 

              <Row gutter={[8, 8]} wrap>
                <Col span={8}>
                  <Card style={{ height: '100%', cursor: 'default', border: '1px solid #C4C4C480' }}>
                    <Statistic
                      valueStyle={{ textAlign: 'center', fontSize: 30 }}
                      title='Articulos subastados'
                      value={labels.length}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card style={{ height: '100%', cursor: 'default', border: '1px solid #C4C4C480' }}>
                    <Statistic valueStyle={{ textAlign: 'center', fontSize: 30 }} title='Total de pujas' value={offers.length} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card style={{ height: '100%', cursor: 'default', border: '1px solid #C4C4C480' }}>
                    <Statistic
                      valueStyle={{ textAlign: 'center', fontSize: 30 }}
                      title='Total de participantes'
                      value={filterUserID(offers).length}
                    />
                  </Card>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            hoverable 
            style={{/* minHeight: '55vh', */ cursor: 'default', borderRadius: '20px'}}
            title={'Gráfica de ganancias por producto'}
            headStyle={{border: 'none'}}
          >
            <Space direction='vertical' size={16} style={{width: '100%'}}>
              <Bar data={dataCre} options={optionsCar} />

              <Result title='Próximamente'></Result>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
}
