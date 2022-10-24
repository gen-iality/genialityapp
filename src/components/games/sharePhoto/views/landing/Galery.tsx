import { Button, Col, Row } from 'antd';
import React from 'react';
import FeedContainer from '../../components/FeedContainer';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';

export default function Galery() {
	const { goTo } = useSharePhotoInLanding();
	return (
		<>
			<Row gutter={[12, 12]}>
				<Col
					xs={24}
					style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button onClick={() => goTo('chooseAction')}>Atras</Button>
					{/* <Button>Siguiente</Button> */}
				</Col>
			</Row>
			<FeedContainer />
		</>
	);
}
