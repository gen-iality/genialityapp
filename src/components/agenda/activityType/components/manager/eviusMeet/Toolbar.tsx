import { Card, Form, List, Switch } from 'antd';
// import { TransferDirection } from 'antd/lib/transfer';
import React, { cloneElement, useState } from 'react';
import { toolbarItems } from './toolbarItems';

// const { useBreakpoint } = Grid;

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
	// const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
	// const screens = useBreakpoint();

	// const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
	// 	if (props.onChange) props.onChange(nextTargetKeys);
	// 	setTargetKeys(nextTargetKeys);
	// };

	const handleChange = (checked: boolean, key: string) => {
		if (checked) {
			const nextTargetKeys = [...targetKeys, key];
			if (props.onChange) props.onChange(nextTargetKeys);
			setTargetKeys(nextTargetKeys);
		} else {
			const nextTargetKeys = [...targetKeys.filter(item => item !== key)];
			if (props.onChange) props.onChange(nextTargetKeys);
			setTargetKeys(nextTargetKeys);
		}
	};

	// const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
	// 	setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	// };

	return (
		<Form layout='vertical'>
			<Card bordered={false}>
				<List
					size='small'
					dataSource={toolbarItems}
					renderItem={option => (
						<List.Item
							style={{ padding: '0px' }}
							key={option.key}
							extra={
								<Form.Item style={{ margin: '10px' }}>
									<Switch
										checked={targetKeys.includes(option.key)}
										onChange={checked => handleChange(checked, option.key)}
									/>
								</Form.Item>
							}>
							<List.Item.Meta avatar={cloneElement(option.icon, { style: { fontSize: '24px' } })} title={option.label} />
						</List.Item>
					)}
				/>
			</Card>
		</Form>
	);
}
