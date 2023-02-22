import { Grid, Transfer } from 'antd';
import { TransferDirection } from 'antd/lib/transfer';
import { useState } from 'react';
import { toolbarItems } from './toolbarItems';

const { useBreakpoint } = Grid;

const DEFAULT_TOOLBAR_OPTIONS = [
	'hangup',
	'microphone',
	'camera',
	'participants-pane',
	'tileview',
	'settings',
	'fullscreen',
];

interface Props {
	values?: string[];
	onChange?: (list: string[]) => void;
}

export default function Toolbar(props: Props) {
	const [targetKeys, setTargetKeys] = useState(props.values || DEFAULT_TOOLBAR_OPTIONS);
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
			dataSource={toolbarItems}
			oneWay
			showSelectAll={false}
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
