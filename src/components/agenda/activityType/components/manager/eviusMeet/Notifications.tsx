import { Grid } from 'antd';
import Transfer, { TransferDirection } from 'antd/lib/transfer';
import { useState } from 'react';
import { notificationsItems } from './notificationsItems';

const { useBreakpoint } = Grid;

const DEFAULT_DISABLE_NOTIFICATIONS = ['notify.chatMessages', 'notify.disconnected'];

interface Props {
	values?: string[];
	onChange?: (list: string[]) => void;
}

export default function Notifications(props: Props) {
	const [targetKeys, setTargetKeys] = useState(props.values || DEFAULT_DISABLE_NOTIFICATIONS);
	const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
	const screens = useBreakpoint();

	const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
		if (props.onChange) props.onChange(nextTargetKeys);
		setTargetKeys(nextTargetKeys);
	};

	const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	};

	return (
		<Transfer
			dataSource={notificationsItems}
			showSelectAll={false}
			oneWay
			titles={['Desactivados', 'Activos']}
			listStyle={{
				borderRadius: '5px',
				width: screens.xs ? 135 : 300,
				height: screens.xs ? 225 : 300,
			}}
			targetKeys={targetKeys}
			selectedKeys={selectedKeys}
			onChange={onChange}
			onSelectChange={onSelectChange}
			render={item => item.render}
			showSearch
			locale={{
				itemsUnit: 'opciones',
				itemUnit: 'opción',
				notFoundContent: '',
				searchPlaceholder: 'Buscar...',
			}}
		/>
	);
}
