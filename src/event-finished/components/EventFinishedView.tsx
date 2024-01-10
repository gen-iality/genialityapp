import { Result, Row, Typography } from 'antd';

export const EventFinishedView = () => {
	return (
		<Row style={{ height: '80vh' }} justify='center' align='middle'>
			<Result
				style={{ width: '700px' }}
				status='info'
				title={<Typography.Title level={2}>Evento finalizado</Typography.Title>}
				subTitle={
					<Typography.Paragraph>
						¡Gracias a todos por participar! Este evento ha llegado a su fin. Estamos emocionados por haber compartido
						esta experiencia contigo. Esperamos verte en futuros eventos.
					</Typography.Paragraph>
				}
			/>
		</Row>
	);
};
