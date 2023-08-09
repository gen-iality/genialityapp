import { Card, Col, Row } from 'antd';
import { Bar, Line } from 'react-chartjs-2';
import React from 'react';
import { useSatistic } from '../../hooks/useStatistic';
import { ReportProps } from '../../interfaces/auction.interface';

export default function Report({eventId} : ReportProps) {

    const { offers } = useSatistic(eventId);

  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        label: 'Ventas mensuales',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Row justify='center'>
      <Col xs={24} sm={24} md={12} lg={8} xl={7} xxl={4}>
        <Card>
          {' '}
          <Bar data={data} options={options} />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={8} xl={7} xxl={4}>
        <Card>Reporte</Card>
      </Col>
    </Row>
  );
}
