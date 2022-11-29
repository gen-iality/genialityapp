import React, { useEffect, useState } from 'react';
import { Button, Card, ConfigProvider, Empty, Table, Tag, Typography } from 'antd';
import * as XLSX from 'xlsx';
import { IParticipant } from '../../WhoWantsToBeAMillonaire/interfaces/Millonaire';
const { Text, Title } = Typography;

export default function Participants({ participants }: { participants: IParticipant[] }) {
  const donwloadExcel = () => {
    const headers = [
      'UID',
      'Nombre Completo',
      'Correo Electronico',
      'Puntaje',
      'Fecha de finalización',
      'Tiempo promedio por pregunta',
      'Tiempo total',
    ];
    const data = participants.map((participant) => [
      participant.uid,
      participant.name,
      participant.email,
      participant.score,
      new Date(participant.time.seconds * 1000).toLocaleString(),
      participant.stages.reduce((acc: number, stage: any) => acc + stage.time, 0) / participant.stages.length +
        ' segundos',
      participant.stages.reduce((acc: number, stage: any) => acc + stage.time, 0) + ' segundos',
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participantes');
    XLSX.writeFile(wb, 'Participantes.xlsx');
  };

  const columns = [
    {
      title: 'Nombre Completo',
      dataIndex: 'name',
      key: 'name',
      render: (name: any) => <Text>{name ?? ''}</Text>,
    },
    {
      title: 'Correo Electronico',
      dataIndex: 'email',
      key: 'email',
      render: (email: any) => <Text>{email ?? ''}</Text>,
    },
    {
      title: 'Puntaje',
      dataIndex: 'score',
      key: 'score',
      render: (score: any) => <Text>{score ?? ''}</Text>,
    },
    {
      title: 'Fecha de finalización',
      dataIndex: 'time',
      key: 'time',

      render: (time: any) => <Text>{new Date(time.seconds * 1000).toLocaleString() ?? ''}</Text>,
    },
    {
      title: 'Tiempo promedio de respuesta',
      dataIndex: 'stages',
      key: 'stages',
      render: (stages: any) => {
        const time = stages.reduce((acc: number, stage: any) => acc + stage.time, 0);
        return <Text>{time / stages.length + 's' ?? ''}</Text>;
      },
    },
    {
      title: 'Tiempo total de juego',
      dataIndex: 'stages',
      key: 'stages',
      render: (stages: any) => {
        const time = stages.reduce((acc: number, stage: any) => acc + stage.time, 0);
        return <Tag color='blue'>{time + 's' ?? ''}</Tag>;
      },
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      render: (uid: any) => <Text style={{ wordBreak: 'break-all' }}>{uid ?? ''}</Text>,
    },
  ];
  return (
    <Card hoverable style={{ borderRadius: '20px' }}>
      <ConfigProvider renderEmpty={() => <Empty description={'No hay participantes'} />}>
        <Table
          title={() => (
            <>
              <Title level={3} style={{ textAlign: 'center' }}>
                Participantes
              </Title>

              <Button style={{ color: '#21A366' }} onClick={() => donwloadExcel()}>
                Descargar Excel
              </Button>
            </>
          )}
          columns={columns}
          dataSource={participants}
        />
      </ConfigProvider>
    </Card>
  );
}
