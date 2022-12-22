import { Card, Row } from 'antd';
import React from 'react';

interface CardContainer {
	title?: React.ReactNode;
	extra?: React.ReactNode;
	children: React.ReactNode;
	backgroundImage?: string;
}

interface CardStyles {
	headStyles: React.CSSProperties;
	bodyStyles: React.CSSProperties;
	styles: React.CSSProperties;
}

const CardContainer = ({ title, extra, children, backgroundImage }: CardContainer) => {
	const cardStyles: CardStyles = {
		headStyles: { border: 'none' },
		bodyStyles: { padding: '0px 24px 24px 24px', height: '100%', },
		styles: {
			height: '100%',
			borderRadius: '15px',
			backgroundColor: '#FFFFFF',
			background: backgroundImage ? `url("${backgroundImage}")`: '',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
      
		},
	};
	return (
		<Card
			extra={extra}
			title={title}
			headStyle={cardStyles.headStyles}
			bodyStyle={cardStyles.bodyStyles}
			style={cardStyles.styles}>
			{children}
		</Card>
	);
};

export default CardContainer;
