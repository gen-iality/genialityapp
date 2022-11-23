import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Typography } from 'antd';
import * as XLSX from 'xlsx';
const { Text, Title } = Typography;

export default function Participants({ participants }: { participants: any[] }) {
  const donwloadExcel = () => {
    const headers = ['UID', 'Nombre Completo', 'Correo Electronico', 'Puntaje', 'Tiempo'];
    const data = participants.map((participant) => [
      participant.uid,
      participant.name,
      participant.email,
      participant.score,
      new Date(participant.time.seconds * 1000).toLocaleString(),
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
      title: 'Tiempo',
      dataIndex: 'time',
      key: 'time',

      render: (time: any) => <Text>{new Date(time.seconds * 1000).toLocaleString() ?? ''}</Text>,
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      render: (uid: any) => <Text>{uid ?? ''}</Text>,
    },
  ];
  return (
    <Card hoverable style={{ borderRadius: '20px' }}>
      <Table
        title={() => (
          <>
            <Title level={3} style={{ textAlign: 'center' }}>
              Participantes
            </Title>

            <Button type='primary' onClick={() => donwloadExcel()}>
              Descargar Excel
            </Button>
          </>
        )}
        columns={columns}
        dataSource={participants}
      />
    </Card>
  );
}
