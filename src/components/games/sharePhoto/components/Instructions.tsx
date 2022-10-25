import { Button, Card, Col, Image, Row, Typography } from 'antd';
import React, { useState } from 'react';

const exampleInstructions = [
	{
		type: 'image',
		content:
			'https://www.presteamshop.com/blog/wp-content/uploads/2020/09/que-es-un-banner-publicitario-y-para-que-sirve.png',
	},
	{
		type: 'text',
		content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam in labore possimus ad cum sed saepe, odit optio sunt dignissimos minus sint, nemo libero minima nulla molestiae quia aspernatur corporis incidunt temporibus assumenda esse consequuntur? Dolorem aliquam, placeat exercitationem asperiores consequuntur nisi, soluta quas a culpa nulla quidem facere eaque aperiam nam perferendis voluptatibus nobis perspiciatis quis, magni minus autem.`,
	},
];

const InstructionCardWithImage = () => {
	const [content, setContent] = useState<{
		type: 'image' | 'text';
		content: string;
	}>({
		type: 'image',
		content:
			'https://www.presteamshop.com/blog/wp-content/uploads/2020/09/que-es-un-banner-publicitario-y-para-que-sirve.png',
	});

	return (
		<Card title={'Tematica'} style={{ maxWidth: '500px' }}>
			{content.type === 'text' && <Typography>{content.content}</Typography>}
			{content.type === 'image' && (
				<Image preview={false} src={content.content} alt='' />
			)}
		</Card>
	);
};

export default function Instructions() {
	return (
		<div style={{ display: 'grid', placeContent: 'center', minHeight: '45vh' }}>
			<Row gutter={{ xs: 0, sm: 8, md: 16 }}>
				<Col>
					<Card title='Instrucciones' style={{ maxWidth: '500px' }}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam in
						labore possimus ad cum sed saepe, odit optio sunt dignissimos minus
						sint, nemo libero minima nulla molestiae quia aspernatur corporis
						incidunt temporibus assumenda esse consequuntur? Dolorem aliquam,
						placeat exercitationem asperiores consequuntur nisi, soluta quas a
						culpa nulla quidem facere eaque aperiam nam perferendis voluptatibus
						nobis perspiciatis quis, magni minus autem.
					</Card>
				</Col>
				<Col>
					<InstructionCardWithImage />
				</Col>
			</Row>
		</div>
	);
}
