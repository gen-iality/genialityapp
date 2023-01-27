import { Avatar, Card, Statistic } from 'antd';

interface props {
	loading: boolean;
	title: React.ReactNode | string;
	value: number | string;
	icon: React.ReactNode;
}

export default function AssemblyStatisticCard(props: props) {
	const { loading, title, value, icon } = props;
	return (
		<Card style={{ fontWeight: '700', color: '#6F737C' }}>
			<Statistic loading={loading} title={title} value={value} valueStyle={{fontSize:'30px'}} />
			<Avatar shape='square' size={70} style={{position:'absolute', right:'24px', bottom:'20%', backgroundColor:'#333F44'}} icon={icon} />
		</Card>
	);
}
