import { Card, Col, Row } from 'antd';
import { SharePhoto } from '../../types';

interface Props {
	sharePhoto: SharePhoto;
}

export default function TabResults(props: Props) {
  const { sharePhoto } = props;
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24}>
				<Card style={{ display: 'flex', justifyContent: 'center' }}>Here goes results</Card>
			</Col>
		</Row>
	);
}
