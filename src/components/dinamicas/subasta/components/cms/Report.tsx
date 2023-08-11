import React, { useEffect } from 'react';
import { Card, Col, Divider, Result, Row, Space, Statistic } from 'antd';
import { Bar } from 'react-chartjs-2';
import { useSatistic } from '../../hooks/useStatistic';
import { ReportProps } from '../../interfaces/auction.interface';
import { filterUserID, orgOfferds, priceChartValues } from '../../utils/utils';

import useProducts from '../../hooks/useProducts';

export default function Report({ eventId, reload }: ReportProps) {
  const { offers } = useSatistic(eventId, reload);
  const { products, refresh } = useProducts(eventId);
  useEffect(() => {
    if(reload) refresh();
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

  return (
    <>
      <Row justify='center' gutter={[32, 32]}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={10}>
          <Card style={{ borderRadius: 20 }} title={'Gráfica de pujas x producto'}>
            {/*@ts-ignore */}
            <Bar data={data} options={options} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={10}>
          <Col style={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
            <Card style={{ width: 300, cursor: 'default' }} hoverable>
              <Statistic
                valueStyle={{ textAlign: 'center', fontSize: 30 }}
                title='Articulos subastados'
                value={labels.length}
              />
            </Card>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
            <Card style={{ width: 300, cursor: 'default' }} hoverable>
              <Statistic valueStyle={{ textAlign: 'center', fontSize: 30 }} title='Total de pujas' value={offers.length} />
            </Card>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
            <Card style={{ width: 300, cursor: 'default' }} hoverable>
              <Statistic
                valueStyle={{ textAlign: 'center', fontSize: 30 }}
                title='Total de participantes'
                value={filterUserID(offers).length}
              />
            </Card>
          </Col>
        </Col>
      </Row>
      <Divider />
      <Row justify='center' gutter={[16, 16]} style={{ margin: 10 }}>
        <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={10}>
          <Card style={{ borderRadius: 20 }} title={'Gráfica de ganancias por producto'}>
            <Bar data={dataCre} options={optionsCar} />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={10}>
          {/*       <Card style={{ borderRadius: 20 }}>
          <Pie data={dataCre} options={optionsCar} />
        </Card> */}
          <Result title='Próximamente'></Result>
        </Col>
      </Row>
    </>
  );
}
