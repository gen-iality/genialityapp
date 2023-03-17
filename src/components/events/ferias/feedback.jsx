import { MehOutlined } from '@ant-design/icons';
import { Card, Result } from 'antd';
const feedback = (props) => {
	const image = props.image || <MehOutlined />;
	const message = props.message || 'No hay datos';

	return (
		<div style={{ width: '100%', paddingTop: '20px' }}>
			<Card style={{backgroundColor:'#FFFFFF99'}}>
				<Result icon={image} title={message} />
			</Card>
		</div>
	);
};

export default feedback;
