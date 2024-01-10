import { Button, Modal, ModalProps, Result, Typography, Grid } from 'antd';

interface Props extends ModalProps {
	onCancel: () => void;
}

const { useBreakpoint } = Grid;

export const CapacityCompleted = ({ onCancel, ...modalProps }: Props) => {
	const screens = useBreakpoint();
	return (
		<Modal width={!screens.xs ? '800px' : ''} onCancel={onCancel} {...modalProps} footer={null}>
			<Result
				status={'403'}
				title={<Typography.Title level={4}>Límite de Asistentes Alcanzado</Typography.Title>}
				subTitle={
					<Typography.Paragraph>
						Lo sentimos, pero el evento ha alcanzado su límite máximo de asistentes. Actualmente, no hay capacidad
						adicional disponible para nuevos participantes. Te invitamos a estar atento a futuros eventos y agradecemos
						tu comprensión.
					</Typography.Paragraph>
				}
				extra={
					<Button size='large' type='primary' onClick={onCancel}>
						Aceptar
					</Button>
				}>
				Si tienes alguna pregunta, por favor, contacta con el administrador de tu evento.
			</Result>
		</Modal>
	);
};
