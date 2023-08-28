import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, Modal, Result, Row, Space, Statistic, Typography } from 'antd';
import { Bar } from 'react-chartjs-2';
import { useSatistic } from '../../hooks/useStatistic';
import { FormatData, ReportProps } from '../../interfaces/auction.interface';
import { filterUserID, orgOfferds, priceChartValues } from '../../utils/utils';

import useProducts from '../../hooks/useProducts';
import { CloseCircleOutlined, DeleteOutlined, FileExcelOutlined, ReloadOutlined } from '@ant-design/icons';
import { resetProducts } from '../../services';
import { DispatchMessageService } from '@/context/MessageService';
import { utils, writeFileXLSX } from 'xlsx';
import moment from 'moment';

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
  const dataBids = {
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
  const dataPrice = {
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
  const optionsBids = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        stepSize: 1,
      },
    },
  };
  const optionsPrice = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  const formatDataExcel = ( {productos,participants, pujas, productsName, productsIncreases, productsPrice} : FormatData) => {

    const dataProducts : any[] = []
    const dataIncreases : any[] = []
    productos.forEach((label, index) => {
      dataProducts.push({
        producto: label,
        pujas: pujas[index],
        participantes: participants[index],
      });
    });
    productsName.forEach((label, index) => {
      dataIncreases.push({
        producto: label,
        'precio inicial': productsPrice[index],
        'precio final': productsPrice[index] + productsIncreases[index],
        ganancias: productsIncreases[index],
      });
    });
    return {
      productos: dataProducts,
      increases: dataIncreases
    };
  }
  const exportData = () => {  
    const data = formatDataExcel({productos: labels, participants, pujas: values, productsName: labelsProducts, productsIncreases: increases, productsPrice: startPrices})    
    if (data) {
      const workSheetProducts = utils.json_to_sheet(data.productos);
      const workSheetIncreases = utils.json_to_sheet(data.increases);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, workSheetProducts, `${'Pujas y participantes'}`);
      utils.book_append_sheet(wb, workSheetIncreases, `${'Ganancias por producto'}`);
      writeFileXLSX(wb, `${''}_${eventId}_${moment().format('DDMMYY')}.xls`);
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'No existen datos que exportar',
        action: 'show',
      });
    }
  }
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
      <Row justify='space-between' style={{paddingBottom: '10px'}}>
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
      
        <Button icon={<FileExcelOutlined />}  type='primary' onClick={exportData}>
          Generar Excel
        </Button>
      
        <Button icon={<ReloadOutlined />} danger type='primary' onClick={() => setModal(true)}>
          Reiniciar subasta
        </Button>
      
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
              <Bar data={dataBids} options={optionsBids} /> 

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
              <Bar data={dataPrice} options={optionsPrice} />
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
}
