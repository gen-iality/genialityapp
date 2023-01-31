import { GraphicsData, VoteResponse } from '@/components/events/surveys/types';
import { singularOrPluralString } from '@/Utilities/singularOrPluralString';
import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';
import useAssemblyInCMS from '../../hooks/useAssemblyInCMS';

interface Props {
	graphicsData: GraphicsData;
  responses: VoteResponse[]
}

export default function ParticipationSection(props: Props) {
	const { graphicsData, responses } = props;
	const { totalAttendees, attendeesChecked } = useAssemblyInCMS();
	console.log({ graphicsData });
	const participationInQuestion = responses.length;
	const noParticipationInQuestion = attendeesChecked - participationInQuestion;
	return (
		<Card style={{ height: '100%' }} headStyle={{border:'none'}} bodyStyle={{paddingTop:'0px'}} title={`Participación`}>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
					<Card bodyStyle={{}}>
						<Statistic
							title='Cantidad de inscritos que participaron en esta pregunta'
							value={participationInQuestion}
							precision={0}
							valueStyle={{ color: '#1890FF' }}
							suffix={singularOrPluralString(participationInQuestion, 'Participante', 'Participantes', true)}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
					<Card>
						<Statistic
							title='Cantidad de inscritos que no participaron en esta pregunta'
							value={noParticipationInQuestion}
							precision={0}
							valueStyle={{ color: '#1890FF' }}
							suffix={singularOrPluralString(noParticipationInQuestion, 'Participante', 'Participantes', true)}
						/>
					</Card>
				</Col>
			</Row>
		</Card>
	);
}
