import { Card, Col, Row } from 'antd';
import { SharePhoto } from '../../types';

interface Props {
	sharePhoto: SharePhoto;
}

export default function TabStyle(props: Props) {
  const { sharePhoto } = props;
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24}>
				<Card>Here goes style setup</Card>
			</Col>
		</Row>
	);
}
