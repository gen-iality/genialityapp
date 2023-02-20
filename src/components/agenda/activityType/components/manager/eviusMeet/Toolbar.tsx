import { Card, Transfer } from 'antd';
import { TransferDirection } from 'antd/lib/transfer';
import React, { useState } from 'react';

const TOOLBAR_KEYS = [
	'camera',
	'chat',
	'closedcaptions',
	'desktop',
	'download',
	'embedmeeting',
	'etherpad',
	'feedback',
	'filmstrip',
	'fullscreen',
	'hangup',
	'help',
	'highlight',
	'invite',
	'linktosalesforce',
	'livestreaming',
	'microphone',
	'noisesuppression',
	'participants-pane',
	'profile',
	'raisehand',
	'recording',
	'security',
	'select-background',
	'settings',
	'shareaudio',
	'sharedvideo',
	'shortcuts',
	'stats',
	'tileview',
	'toggle-camera',
	'videoquality',
	'whiteboard',
];

const transferValues = TOOLBAR_KEYS.map(key => ({ key, label: key }));

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

	const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
		if (props.onChange) props.onChange(nextTargetKeys);
		setTargetKeys(nextTargetKeys);
	};

	const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	};

	return (
		<Card title='Toolbar de reunión'>
			<Transfer
				dataSource={transferValues}
				titles={['Activado', 'Desactivado']}
				targetKeys={targetKeys}
				selectedKeys={selectedKeys}
				onChange={onChange}
				onSelectChange={onSelectChange}
				render={item => item.label}
			/>
		</Card>
	);
}
