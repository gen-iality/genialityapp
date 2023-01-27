import { GraphicsData } from '@/components/events/surveys/types';
import { singularOrPluralString } from '@/Utilities/singularOrPluralString'
import { Card, Col, Row, Statistic } from 'antd'
import React from 'react'

interface Props {
	graphicsData: GraphicsData;
}


export default function ParticipationSection(props: Props) {
  const { graphicsData } = props;
  return (
    <Card style={{ height: '100%' }}><Row gutter={[16, 16]}>
    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
      <Card bodyStyle={{}}>
        <Statistic
          title='Cantidad de inscritos que participaron en esta pregunta'
          value={15}
          precision={0}
          valueStyle={{ color: '#1890FF' }}
          suffix={singularOrPluralString(
            15,
            'Participante',
            'Participantes',
            true
          )}
        />
      </Card>
    </Col>
    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
      <Card>
        <Statistic
          title='Cantidad de inscritos que no participaron en esta pregunta'
          value={5}
          precision={0}
          valueStyle={{ color: '#1890FF' }}
          suffix={singularOrPluralString(
            15,
            'Participante',
            'Participantes',
            true
          )}
        />
      </Card>
    </Col>
  </Row></Card>
  )
}
