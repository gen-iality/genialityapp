import { CheckCircleFilled } from '@ant-design/icons';
import { Badge, Col, Image, Row } from 'antd';
import { isMobile } from 'react-device-detect';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';

export default function FooterWithHints() {
	const {
		whereIsGame: { points },
	} = useWhereIsInLanding();
	return (
		<Row align='middle' justify={isMobile ? 'space-around' : 'center'} gutter={[20, 0]}>
			{points.map(point => (
				<Col key={point.id} style={{}}>
					<Badge
						offset={[-10, 10]}
						count={point.isFound ? <CheckCircleFilled style={{ color: '#52C41A', fontSize: '32px' }} /> : 0}>
						<Image
							src={point.image}
							height={isMobile ? 40 : 60}
							preview={false}
							style={{
								filter: point.isFound ? 'grayscale(100%)' : '',
							}}
						/>
					</Badge>
				</Col>
			))}
		</Row>
	);
}
