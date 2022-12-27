import React, { useEffect, useState } from 'react';
import { Button, Card, ConfigProvider, Empty, Table, Tag, Typography } from 'antd';
import * as XLSX from 'xlsx';
import { Score } from '../../../common/Ranking/types';
const { Text, Title } = Typography;

export default function Participants({ participants }: { participants: Score[] }) {
  const donwloadExcel = () => {
    const headers = [
      'Nombre Completo',
      'Likes',
      'Fecha/Hora de creación'
    ];

    const data = participants.map((participant) => [
      participant.name,
      participant.score,
      new Date(participant.created_at).toLocaleString(),
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
      title: 'Puntaje',
      dataIndex: 'score',
      key: 'score',
      render: (score: any) => <Text>{score ?? ''}</Text>,
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at: any) => <Text style={{ wordBreak: 'break-all' }}>{created_at ?? ''}</Text>,
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

              <Button disabled={participants.length === 0} style={{ color: '#21A366' }} onClick={() => donwloadExcel()}>
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
