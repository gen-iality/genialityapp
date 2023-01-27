import { Card, Statistic } from 'antd';

interface props {
	loading: boolean;
	title: React.ReactNode | string;
	value: number | string;
}

export default function AssemblyStatisticCard(props: props) {
	const { loading, title, value } = props;
	return (
		<Card style={{ fontWeight: '700', color: '#6F737C' }}>
			<Statistic loading={loading} title={title} value={value} />
		</Card>
	);
}
