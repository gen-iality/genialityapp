import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import SurveyItem from './surveyItem';
import { changeSurveyStatus, listenSurveysByActivity } from '@/services/surveys';
import { SurveyInFirestore, SurveyStatus } from '@/types/survey';
import Loading from '@/components/profile/loading';

interface Props {
	event_id: string;
	activity_id: string;
	canSendComunications: any;
}

export default function SurveyManager(props: Props) {
	const [publishedSurveys, setPublishedSurveys] = useState<SurveyInFirestore[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const unsubscribe = listenSurveysByActivity(props.event_id, props.activity_id, setPublishedSurveys);
		return () => unsubscribe();
	}, []);

	const handleChange = async (surveyId: SurveyInFirestore['id'], surveyStatus: SurveyStatus) => {
		await changeSurveyStatus(surveyId, surveyStatus, props.event_id, props.activity_id, setLoading);
	};

	// if (loading) return <Loading />;

	if (!publishedSurveys.length)
		return (
			<Card title='Gestor de encuestas'>
				<div>No hay encuestas publicadas para esta actividad</div>
			</Card>
		);

	return (
		<Card title='Gestor de encuestas'>
			<Row style={{ padding: '8px 16px' }}>
				<Col xs={12} lg={8}>
					<label className='label'>Encuesta</label>
				</Col>
				<Col xs={4} lg={3}>
					<label className='label'>Publicar</label>
				</Col>
				<Col xs={4} lg={2}>
					<label className='label'>Abrir</label>
				</Col>
			</Row>
			{publishedSurveys.map(survey => (
				<SurveyItem key={`survey-${survey.id}`} survey={survey} onChange={handleChange} />
			))}
		</Card>
	);
}
