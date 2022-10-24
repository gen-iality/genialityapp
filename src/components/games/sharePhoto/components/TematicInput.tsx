import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { Card, Form, Input, Switch, Typography } from 'antd';
import { useState } from 'react'

export default function TematicInput() {
  const [mode, setMode] = useState<'text' | 'image'>('text');

	const handleChangeMode = () => {
		setMode(prev => (prev === 'text' ? 'image' : 'text'));
	};
	return (
		<Card
			title='Instrucciones y Tematica'
			bodyStyle={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}}>
			<Typography>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia
				corrupti quaerat impedit repudiandae quos accusantium eos dolorum,
				laboriosam provident iure, blanditiis recusandae optio cupiditate
				voluptas aliquam culpa deserunt minus sequi nulla numquam veritatis
				illum. Aspernatur voluptatem ad amet reprehenderit tempora.
			</Typography>
			<div>
				<Switch onChange={handleChangeMode} />
			</div>
			{mode === 'text' && (
				<Form.Item
					label={<label>Tematica</label>}
					// initialValue={sharePhoto?.title}
					name='tematic'>
					<Input type='text' />
				</Form.Item>
			)}
			{mode === 'image' && (
				<Form.Item label={<label>Tematica</label>}>
					<ImageUploaderDragAndDrop
						imageDataCallBack={imageUrl => console.log(imageUrl)}
						imageUrl={''}
						width={1080}
						height={1080}
					/>
				</Form.Item>
			)}
		</Card>
	);
}
